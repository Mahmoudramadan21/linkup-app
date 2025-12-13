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
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If user is authenticated, redirect them to feed
    if (!loading.initialize && isAuthenticated && !loading.logout) {
      router.replace('/feed'); 
    }
  }, [isAuthenticated, loading, router]);

  if (loading.initialize || isAuthenticated === null || loading.logout) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if(!loading.initialize && !isAuthenticated) {
    return <>{children}</>;
  }
};

export default Guest;
