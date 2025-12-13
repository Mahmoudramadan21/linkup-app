'use client';

import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading.initialize && isAuthenticated === false) {
      router.replace('/login'); // redirect to login if not authenticated
    }
  }, [isAuthenticated, loading, router]);

  // While auth is initializing, we can show a loading indicator
  if (loading.initialize || isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if(!loading.initialize && isAuthenticated) {
    return <>{children}</>;
  }
};

export default AuthGuard;
