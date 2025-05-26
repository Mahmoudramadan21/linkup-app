/*
 * Custom hook for handling reset password form logic
 * - Manages form state, validation, and submission
 * - Handles API calls for password reset
 * - Redirects to login page on success
 */

'use client';
import { useState, useEffect, useCallback, useMemo, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/services/auth/authService';
import { validateResetPasswordForm } from '@/utils/validation';
import { ERROR_MESSAGES } from '@/lib/constants';
import { ResetPasswordFormData, ResetPasswordFormErrors } from '@/types/auth';

export const useResetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    resetToken: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [serverSuccess, setServerSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Retrieve resetToken from sessionStorage
  useEffect(() => {
    const resetToken = typeof window !== 'undefined' ? sessionStorage.getItem('resetToken') || '' : '';
    const newErrors: ResetPasswordFormErrors = {};

    if (!resetToken) {
      newErrors.resetToken = 'No valid reset token found. Please start the password reset process again.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setFormData((prev) => ({ ...prev, resetToken }));
    }
  }, []);

  // Memoized validation errors
  const validationErrors = useMemo(() => validateResetPasswordForm(formData), [formData]);
  const hasErrors = Object.keys(validationErrors).length > 0 && !validationErrors.resetToken;

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
      const errors = validateResetPasswordForm(formData);
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      setIsLoading(true);
      setServerError('');
      setServerSuccess('');

      try {
        await resetPassword({
          resetToken: formData.resetToken,
          newPassword: formData.newPassword,
        });
        setServerSuccess('Password updated successfully.');
        sessionStorage.removeItem('resetToken');
        sessionStorage.removeItem('resetEmail');

        setTimeout(() => {
          router.push('/password-reset-success');
        }, 1500);
      } catch (error: any) {
        if (error.status === 400 && error.errors) {
          const newErrors: ResetPasswordFormErrors = {};
          error.errors.forEach((err: { field: string; message: string }) => {
            newErrors[err.field as keyof ResetPasswordFormErrors] = err.message;
          });
          setErrors(newErrors);
        } else if (error.status === 401) {
          setServerError('Invalid or expired reset token. Please start the password reset process again.');
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