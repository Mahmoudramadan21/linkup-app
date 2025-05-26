/*
 * Authentication service
 * - Handles API calls for authentication-related operations
 * - Uses configured Axios instance for HTTP requests
 */

import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  LoginFormData,
  LoginResponse,
  SignupApiPayload,
  SignupResponse,
  ApiErrorResponse,
  ForgotPasswordFormData,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyCodeFormData,
  VerifyCodeResponse,
} from "@/types/auth";

/*
 * Performs user login
 * - Sends login request to the backend
 * - Returns auth data on success
 */
export const login = async (
  formData: LoginFormData
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      formData
    );
    return response.data;
  } catch (error: any) {
    throw error as ApiErrorResponse;
  }
};

/*
 * Wrapper for user login
 * - Delegates to login function
 */
export const loginApi = async (
  formData: LoginFormData
): Promise<LoginResponse> => {
  return login(formData);
};

/*
 * Performs user signup
 * - Sends registration request to the backend
 * - Returns auth data on success
 */
export const signup = async (
  formData: SignupApiPayload
): Promise<SignupResponse> => {
  try {
    const response = await axiosInstance.post<SignupResponse>(
      API_ENDPOINTS.SIGNUP,
      formData
    );
    return response.data;
  } catch (error: any) {
    throw error as ApiErrorResponse;
  }
};

/*
 * Performs password reset request
 * - Sends forgot password request to the backend
 * - Returns response indicating success
 */
export const forgotPassword = async (
  formData: ForgotPasswordFormData
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ForgotPasswordResponse>(
      API_ENDPOINTS.FORGOT_PASSWORD,
      formData
    );
    return response.data;
  } catch (error: any) {
    throw error as ApiErrorResponse;
  }
};

/*
 * Performs password reset
 * - Sends reset password request to API
 * - Returns response indicating success
 */
export const resetPassword = async (formData: {
  resetToken: string;
  newPassword: string;
}): Promise<ResetPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ResetPasswordResponse>(
      API_ENDPOINTS.RESET_PASSWORD,
      formData
    );
    return response.data;
  } catch (error: any) {
    throw error as ApiErrorResponse;
  }
};

/*
 * Verifies code for password reset
 * - Sends verification code to API
 * - Returns reset token on success
 */
export const verifyCode = async (
  data: VerifyCodeFormData
): Promise<VerifyCodeResponse> => {
  try {
    const response = await axiosInstance.post<VerifyCodeResponse>(
      API_ENDPOINTS.VERIFY_CODE,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
