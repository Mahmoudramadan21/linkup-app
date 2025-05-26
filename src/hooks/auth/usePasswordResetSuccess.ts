/*
 * Custom hook for handling password reset success navigation
 * - Provides a function to navigate to the login page
 */

'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const usePasswordResetSuccess = () => {
  const router = useRouter();

  // Navigate to login page
  const handleContinue = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    handleContinue,
  };
};