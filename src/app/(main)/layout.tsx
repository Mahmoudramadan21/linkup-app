'use client';

import { ReactNode, Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import Header from '@/components/ui/common/Header';
import Aside from '@/components/ui/common/Aside';

import { useAppSocket } from '@/socket/useAppSocket';
import { getConversationsThunk } from '@/store/messageSlice';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Establish real-time WebSocket connection for messages
  useAppSocket();

  // Load Initial Conversations  
  useEffect(() => {
    dispatch(getConversationsThunk({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 540);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const showSidebar = !pathname.includes('/messages');
  const useContainer = !(pathname.includes('/explore') && isSmallScreen);

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <div className="flex flex-col">
        <Header />

        <div
          className={`flex-1 ${showSidebar ? (useContainer ? 'container mx-auto mt-4' : '') : ''} ${
            showSidebar ? 'xl:grid xl:grid-cols-[77.5%_20%] xl:gap-6' : ''
          }`}
        >
          <main className="flex-1">{children}</main>
          {showSidebar && (
            <Aside />
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default MainLayout;