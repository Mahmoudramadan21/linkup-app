/*
 * Root layout for the LinkUp application
 * - Defines global metadata
 * - Applies global styles
 * - Wraps all pages with a base HTML structure
 */

import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'LinkUp',
  description: 'A social media platform to connect and share moments.',
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}