/*
 * TypeScript interfaces for authentication
 * - Defines data structures for login, signup, forgot password forms, API responses, and components
 * - Used in LoginForm, SignupForm, ForgotPasswordForm, useLogin, useSignup, useForgotPassword, and authService
 */

export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface LoginFormErrors {
  usernameOrEmail?: string;
  password?: string;
}

export interface SignupFormData {
  profileName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'MALE' | 'FEMALE' | '';
  dateOfBirth: string;
  marketingConsent: boolean;
}

export interface SignupFormErrors {
  profileName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  dateOfBirth?: string;
  marketingConsent?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
}

export interface VerifyCodeFormData {
  email: string;
  code: string;
}

export interface VerifyCodeFormErrors {
  email?: string;
  code?: string;
}

export interface ResetPasswordFormData {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordFormErrors {
  resetToken?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface SignupApiPayload {
  profileName: string;
  username: string;
  email: string;
  password: string;
  gender: 'MALE' | 'FEMALE' | '';
  dateOfBirth: string;
}

export interface LoginResponse {
  message: string;
  data: FeedStoreAuthData;
}

export interface SignupResponse {
  message?: string;
  data: FeedStoreAuthData;
}

export interface ForgotPasswordResponse {
  message: string;
  codeSent: boolean;
}

export interface VerifyCodeResponse {
  message: string;
  resetToken: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface FeedStoreAuthData {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  profileName: string;
  profilePicture?: string;
  email?: string;
}

export interface ApiErrorResponse {
  status: number;
  message?: string;
  errors?: { field?: string; message?: string; msg?: string }[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}