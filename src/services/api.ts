/**
 * API client with advanced retry policies, token refresh, rate limiting handling,
 * and centralized error normalization.
 * @module services/api
 */

import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRetry, {
  exponentialDelay,
  isNetworkError,
  isRetryableError,
} from "axios-retry";

import { logout } from "./authService";
import { ErrorResponse } from "@/types/api";

// ====================================================================
// Configuration Constants
// ====================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_GENERAL_RETRIES = 3;

// ====================================================================
// Custom Types
// ====================================================================

interface RetryConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
  _tokenRefreshAttempted?: boolean;
}

// ====================================================================
// Singleton Axios Instance Creation
// ====================================================================

const createApiInstance = (): AxiosInstance => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
  }

  const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15_000, // 15 seconds
  });

  // ==================================================================
  // Retry Logic (Network errors, 5xx, and idempotent 429)
  // ==================================================================
  axiosRetry(api, {
    retries: MAX_GENERAL_RETRIES,
    retryDelay: exponentialDelay, // 1s, 2s, 4s...
    retryCondition: (error) => {
      return (
        isRetryableError(error) || // 5xx + some 4xx
        isNetworkError(error) ||
        error.response?.status === 429 // Rate limit – retry with backoff
      );
    },
    onRetry: (retryCount, error, requestConfig) => {
      console.warn(
        `[API Retry] Attempt ${retryCount}/${MAX_GENERAL_RETRIES} for ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
        error.response?.status || error.code
      );
    },
  });

  // ==================================================================
  // Request Interceptor – Prevent duplicate token refresh
  // ==================================================================
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Mark config to track custom retry state
    (config as RetryConfig)._retryCount ??= 0;
    return config;
  });

  // ==================================================================
  // Response Interceptor – Token Refresh + Unified Error Handling
  // ==================================================================
  api.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error) => {
      const config = error.config as RetryConfig;
      const status = error.response?.status;

      // ----------------------------------------------------------------
      // Normalize error response
      // ----------------------------------------------------------------
      const normalizedError: ErrorResponse = {
        message:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
        errors: error.response?.data?.errors,
        statusCode: status,
      };

      // ----------------------------------------------------------------
      // 429 – Rate limiting (already handled by axios-retry, just normalize)
      // ----------------------------------------------------------------
      if (status === 429) {
        normalizedError.message =
          error.response?.data?.message || "Too many requests. Please slow down.";
        return Promise.reject(normalizedError);
      }

      // ----------------------------------------------------------------
      // 401 – Unauthorized → Try to refresh token once per request
      // ----------------------------------------------------------------
      if (status === 401 && !config._tokenRefreshAttempted) {
        config._tokenRefreshAttempted = true;

        try {
          await api.post("/auth/refresh");
          // Retry the original request with new tokens
          return api(config);
        } catch (refreshError: any) {
          console.error("Token refresh failed:", refreshError);

          // If the refresh endpoint itself fails with 401 → invalid/expired refresh token
          if (refreshError.response?.status === 401 || config.url === "/auth/refresh") {
            await safeLogout();
          }

          return Promise.reject(normalizedError);
        }
      }

      // ----------------------------------------------------------------
      // Other errors – just reject with normalized shape
      // ----------------------------------------------------------------
      return Promise.reject(normalizedError);
    }
  );

  return api;
};

// ====================================================================
// Helper: Safe logout (won't throw in interceptors)
// ====================================================================
const safeLogout = async (): Promise<void> => {
  try {
    await logout();
    console.info("User logged out due to invalid/expired tokens");
  } catch (err) {
    console.error("Logout failed during token refresh error:", err);
  }
};

// ====================================================================
// Export singleton instance
// ====================================================================
const api = createApiInstance();

export default api;