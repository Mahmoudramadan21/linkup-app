/**
 * API client configuration for making HTTP requests with Axios.
 * @module services/api
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ErrorResponse } from "@/types/api";
import { logout } from "./authService";

/**
 * Creates and configures an Axios instance for API requests.
 * @returns Configured Axios instance
 * @throws Error if NEXT_PUBLIC_API_BASE_URL is not defined
 */
const createApiInstance = (): AxiosInstance => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env");
  }

  const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true, // Send cookies (accessToken, refreshToken, csrf-token)
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Fetch a new CSRF token from the backend
   */
  // const fetchCsrfToken = async (): Promise<void> => {
  //   try {
  //     await api.get("/auth/csrf-token", {
  //       headers: { "Cache-Control": "no-cache" },
  //     });

  //     let token: string | null = null;
  //     for (let attempt = 1; attempt <= MAX_COOKIE_READ_ATTEMPTS; attempt++) {
  //       token = getCookie(CSRF_TOKEN_COOKIE);
  //       if (token) break;
  //       await new Promise((resolve) => setTimeout(resolve, COOKIE_READ_DELAY));
  //     }

  //     if (!token) {
  //       console.warn(
  //         "CSRF token cookie not found after fetch. Check backend cookie configuration."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch CSRF token:", error);
  //     const token = getCookie(CSRF_TOKEN_COOKIE);
  //     if (token) {
  //       console.warn("Using existing csrf-token cookie as fallback:", token);
  //       return;
  //     }
  //     throw new Error("Unable to fetch CSRF token");
  //   }
  // };

  // Initial fetch
  // fetchCsrfToken().catch((error) => {
  //   console.error("Initial CSRF token fetch failed:", error);
  // });

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config;
      const errorResponse: ErrorResponse = {
        message:
          error.response?.data?.message || "An unexpected error occurred",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        errors: error.response?.data?.errors,
      };

      // 429 Too Many Requests
      if (error.response?.status === 429) {
        errorResponse.message =
          error.response?.data?.message ||
          "Too many requests, please try again later";
        return Promise.reject(errorResponse);
      }

      // 401 Unauthorized
      if (
        error.response?.status === 401 &&
        (!originalRequest._retryCount || originalRequest._retryCount < 2)
      ) {
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        try {
          await api.post("/auth/refresh");
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          if (originalRequest.url === "/auth/refresh") {
            try {
              await logout();
              console.log(
                "User logged out due to failed refresh token attempt"
              );
            } catch (logoutError) {
              console.error(
                "Logout failed after refresh failure:",
                logoutError
              );
            }
          }
          return Promise.reject(errorResponse);
        }
      }

      return Promise.reject(errorResponse);
    }
  );

  return api;
};

// Singleton Axios instance
const api = createApiInstance();
export default api;
