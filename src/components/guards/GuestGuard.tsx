'use client';

import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';

interface GuestProps {
  children: ReactNode;
}

const Guest = ({ children }: GuestProps) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!loading.initialize && isAuthenticated) {
      router.replace('/feed');
    }
  }, [isAuthenticated, loading.initialize, router]);

  if (loading.initialize) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Guest
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};

export default Guest;
