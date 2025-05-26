/*
 * Axios instance configuration
 * - Centralizes Axios setup for API requests
 * - Configures base URL, headers, and interceptors
 * - Handles token-based authentication and error formatting
 */

import axios, { AxiosError } from 'axios';
import { getAccessToken, refreshAccessToken, removeAuthData } from '@/utils/auth';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiErrorResponse } from '@/types/auth';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

/*
 * Intercepts requests to add authorization token
 * - Retrieves access token from auth utilities
 * - Attaches token to request headers
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * Intercepts responses to handle errors and token refresh
 * - Retries requests with refreshed token on 401 errors
 * - Redirects to login on token refresh failure
 * - Formats error responses for consistent handling
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const status = error.response?.status || 500;
    let message = 'An unexpected error occurred';

    console.error(`API Error [${status}]:`, error.response?.data || error.message);

    if (status === 401 && !originalRequest._retry && originalRequest.url !== API_ENDPOINTS.REFRESH_TOKEN) {
      originalRequest._retry = true;

      try {
        console.log('Attempting to refresh token...');
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          throw new Error('Failed to refresh token');
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('Retrying original request:', originalRequest.url);
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error('Failed to refresh token:', refreshError.message);

        if (refreshError.response) {
          console.error('Refresh token error response:', refreshError.response.data);
        }

        removeAuthData();
        if (typeof window !== 'undefined') {
          console.log('Redirecting to login page...');
          window.location.href = '/login';
        }

        const refreshApiError: ApiErrorResponse = {
          status: 401,
          message: 'Session expired. Please log in again.',
        };
        return Promise.reject(refreshApiError);
      }
    }

    switch (status) {
      case 400:
        message =
          (error.response?.data as { message: string })?.message ||
          'Validation error. Please check your input.';
        break;
      case 401:
        message = 'Authentication failed. Please log in.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message =
          (error.response?.data as { message: string })?.message ||
          'Resource not found.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Internal server error. Please try again later.';
        break;
      default:
        message =
          (error.response?.data as { message: string })?.message ||
          'Request failed. Please try again.';
    }

    const apiError: ApiErrorResponse = {
      status,
      message,
      errors: (error.response?.data as { errors: { field?: string; message?: string; msg?: string }[] })?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default axiosInstance;