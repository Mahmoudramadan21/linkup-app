/*
 * Custom hook for handling verification code form logic
 * - Manages form state, validation, timer, and submission
 * - Handles API calls for code verification and resend
 * - Redirects to reset-password page on success
 */

'use client';
import { useState, useEffect, useCallback, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { verifyCode, forgotPassword } from '@/services/auth/authService';
import { validateVerifyCodeForm } from '@/utils/validation';
import { ERROR_MESSAGES } from '@/lib/constants';
import { VerifyCodeFormData, VerifyCodeFormErrors } from '@/types/auth';

export const useVerifyCode = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<VerifyCodeFormData>({ email: '', code: '' });
  const [errors, setErrors] = useState<VerifyCodeFormErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [serverSuccess, setServerSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Retrieve email from sessionStorage
  useEffect(() => {
    const email = typeof window !== 'undefined' ? sessionStorage.getItem('resetEmail') || '' : '';
    if (!email) {
      setServerError('No valid email found. Please start the password reset process.');
    } else {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, []);

  // Handle timer logic
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Memoized validation errors
  const validationErrors = useMemo(() => validateVerifyCodeForm(formData), [formData]);
  const hasErrors = Object.keys(validationErrors).length > 0;

  // Handle code input change
  const handleCodeChange = useCallback((code: string) => {
    setFormData((prev) => ({ ...prev, code }));
    setErrors((prev) => ({ ...prev, code: undefined }));
    setServerError('');
    setServerSuccess('');
  }, []);

  // Handle resend code
  const handleResend = useCallback(async () => {
    if (!canResend) return;
    setIsLoading(true);
    setServerError('');
    setServerSuccess('');
    try {
      await forgotPassword({ email: formData.email });
      setServerSuccess('A new verification code has been sent to your email.');
      setTimer(30);
      setCanResend(false);
    } catch (error: any) {
      if (error.status === 429) {
        setServerError('Too many requests. Please try again later.');
      } else {
        setServerError(error.message || ERROR_MESSAGES.SERVER_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  }, [canResend, formData.email]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      const errors = validateVerifyCodeForm(formData);
      setErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }
      setIsLoading(true);
      setServerError('');
      setServerSuccess('');
      try {
        const response = await verifyCode(formData);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('resetToken', response.resetToken);
        }
        setServerSuccess('Code verified successfully.');
        setTimeout(() => {
          router.push('/reset-password');
        }, 1500);
      } catch (error: any) {
        if (error.status === 400 && error.errors) {
          const newErrors: VerifyCodeFormErrors = {};
          error.errors.forEach((err: { field: string; message: string }) => {
            newErrors[err.field as keyof VerifyCodeFormErrors] = err.message;
          });
          setErrors(newErrors);
        } else if (error.status === 401) {
          setServerError('Invalid or expired verification code.');
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

  // Format timer as MM:SS
  const formatTimer = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    formData,
    errors,
    serverError,
    serverSuccess,
    isLoading,
    timer,
    canResend,
    handleCodeChange,
    handleResend,
    handleSubmit,
    validationErrors,
    hasErrors,
    formatTimer,
  };
};