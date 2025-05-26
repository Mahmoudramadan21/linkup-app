/*
 * Custom hook for handling forgot password form logic
 * - Manages form state, validation, and submission
 * - Handles API calls for password reset request
 * - Redirects to verify-code page on success
 */

'use client';
import { useState, useCallback, useMemo, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/services/auth/authService';
import { validateForgotPasswordForm } from '@/utils/validation';
import { ERROR_MESSAGES } from '@/lib/constants';
import { ForgotPasswordFormData, ForgotPasswordFormErrors } from '@/types/auth';

export const useForgotPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [serverSuccess, setServerSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoized validation errors
  const validationErrors = useMemo(() => validateForgotPasswordForm(formData), [formData]);
  const hasErrors = Object.keys(validationErrors).length > 0;

  // Handle input changes
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
    setServerSuccess('');
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      const errors = validateForgotPasswordForm(formData);
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      setIsLoading(true);
      setServerError('');
      setServerSuccess('');

      try {
        await forgotPassword(formData);
        setServerSuccess('If the email exists, a verification code has been sent.');
        setFormData({ email: '' });

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('resetEmail', formData.email);
        }

        setTimeout(() => {
          router.push('/verify-code');
        }, 1500);
      } catch (error: any) {
        if (error.status === 400 && error.errors) {
          const newErrors: ForgotPasswordFormErrors = {};
          error.errors.forEach((err: { field: string; message: string }) => {
            newErrors.email = err.message;
          });
          setErrors(newErrors);
        } else if (error.status === 429) {
          setServerError('Too many requests. Please try again later.');
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
    serverSuccess,
    isLoading,
    handleChange,
    handleSubmit,
    validationErrors,
    hasErrors,
  };
};