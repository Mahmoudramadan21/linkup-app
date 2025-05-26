/*
 * Custom hook for handling login form logic
 * - Manages form state, validation, and submission
 * - Handles API calls for authentication
 * - Redirects to feed on successful login
 */

'use client';
import { useState, useCallback, useMemo, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth/authService';
import { setAuthData } from '@/utils/auth';
import { ERROR_MESSAGES } from '@/lib/constants';
import { validateLoginForm } from '@/utils/validation';
import { LoginFormData, LoginFormErrors } from '@/types/auth';

export const useLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    usernameOrEmail: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Memoized validation errors
  const validationErrors = useMemo(() => validateLoginForm(formData), [formData]);
  const hasErrors = Object.keys(validationErrors).length > 0;

  /*
   * Handles input changes
   * - Updates form data state
   * - Clears relevant errors
   * - Supports both input and select elements
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setServerError('');
    },
    []
  );

  /*
   * Handles form submission
   * - Validates form data
   * - Makes API call to authenticate user
   * - Stores auth data and redirects on success
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      const errors = validateLoginForm(formData);
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      setIsLoading(true);
      setServerError('');

      try {
        const response = await login(formData);
        setAuthData(response.data);
        router.push('/feed');
      } catch (error: any) {
        if (error.status === 400 && error.errors) {
          const newErrors: LoginFormErrors = {};
          error.errors.forEach((err: { field: string; message: string }) => {
            newErrors[err.field as keyof LoginFormErrors] = err.message;
          });
          setErrors(newErrors);
        } else if (error.status === 401) {
          setServerError('Invalid email/username or password');
        } else if (error.status === 429) {
          setServerError('Too many login attempts. Please try again later.');
        } else {
          setServerError(error.message || ERROR_MESSAGES.SERVER_ERROR);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, router]
  );

  return {
    formData,
    errors,
    serverError,
    isLoading,
    rememberMe,
    setRememberMe,
    handleChange,
    handleSubmit,
    validationErrors,
    hasErrors,
  };
};