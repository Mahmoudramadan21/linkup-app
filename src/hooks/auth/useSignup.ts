/*
 * Custom hook for handling signup form logic
 * - Manages form state, validation, and submission
 * - Handles API calls for user registration
 * - Redirects to feed on successful signup
 */

'use client';
import { useState, useCallback, useMemo, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/services/auth/authService';
import { setAuthData } from '@/utils/auth';
import { ERROR_MESSAGES } from '@/lib/constants';
import { SignupFormData, SignupFormErrors } from '@/types/auth';
import { validateSignupForm } from '@/utils/validation';

export const useSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    profileName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoized validation errors
  const validationErrors = useMemo(() => validateSignupForm(formData), [formData]);
  const hasErrors = Object.keys(validationErrors).length > 0;

  // Handle input changes
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value, type } = e.target;
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setServerError('');
    },
    []
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      const errors = validateSignupForm(formData);
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      setIsLoading(true);
      setServerError('');

      try {
        const formattedDateOfBirth = new Date(formData.dateOfBirth).toISOString().split('T')[0];
        const response = await signup({
          profileName: formData.profileName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          dateOfBirth: formattedDateOfBirth,
        });

        setAuthData({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          userId: response.data.userId,
          username: response.data.username,
          profileName: response.data.profileName,
          profilePicture: response.data.profilePicture,
          email: formData.email,
        });

        router.push('/feed');
      } catch (error: any) {
        if (error.status === 400 && error.errors) {
          const newErrors: SignupFormErrors = {};
          error.errors.forEach((err: { field: string; message: string }) => {
            const field = err.field === 'profilename' ? 'profileName' : err.field;
            newErrors[field as keyof SignupFormErrors] = err.message;
          });
          setErrors(newErrors);
        } else if (error.status === 409) {
          setServerError('Email or username already exists');
        } else if (error.status === 400) {
          setServerError('Invalid data. Please check your inputs.');
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
    handleChange,
    handleSubmit,
    validationErrors,
    hasErrors,
  };
};