/*
 * Authentication utility functions
 * - Manages auth data storage in localStorage
 * - Provides methods to get and refresh tokens
 * - Handles session cleanup
 */

import { FeedStoreAuthData } from '@/types/auth';
import axiosInstance from '@/lib/axios';

/*
 * Stores authentication data in localStorage
 * - Saves user credentials and tokens
 */
export const setAuthData = (data: FeedStoreAuthData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authData', JSON.stringify(data));
  }
};

/*
 * Retrieves authentication data from localStorage
 * - Returns parsed auth data or null if not found
 */
export const getAuthData = (): FeedStoreAuthData | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('authData');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

/*
 * Removes authentication data from localStorage
 * - Clears user session
 */
export const removeAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authData');
  }
};

/*
 * Gets the access token from auth data
 * - Returns the token or null if not available
 */
export const getAccessToken = (): string | null => {
  const authData = getAuthData();
  return authData ? authData.accessToken : null;
};

/*
 * Gets the refresh token from auth data
 * - Returns the token or null if not available
 */
export const getRefreshToken = (): string | null => {
  const authData = getAuthData();
  return authData ? authData.refreshToken : null;
};

/*
 * Refreshes the access token using the refresh token
 * - Sends a POST request to the refresh token endpoint
 * - Updates auth data with new tokens
 * - Redirects to login on failure
 */
export const refreshAccessToken = async (retryCount = 0): Promise<string | null> => {
  if (typeof window === 'undefined' || retryCount > 1) return null;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
    const data = response.data;
    const newAuthData: FeedStoreAuthData = {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken || refreshToken,
      userId: data.data.userId,
      username: data.data.username,
      profileName: data.data.profileName,
      profilePicture: data.data.profilePicture,
      email: data.data.email || '',
    };

    setAuthData(newAuthData);
    return newAuthData.accessToken;
  } catch (error: any) {
    console.error('Refresh token error:', error.message);
    if (retryCount === 0) {
      return refreshAccessToken(retryCount + 1);
    }
    removeAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
};