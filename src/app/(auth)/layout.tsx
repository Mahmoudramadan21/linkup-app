/*
 * Authentication layout for auth pages
 * - Provides a consistent layout for authentication pages (e.g., login, signup)
 * - Includes background images and accessibility features
 * - Uses Tailwind classes for styling
 */

import { memo, useMemo } from 'react';
import Image from 'next/image';
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'LinkUp | Authentication',
    template: '%s | LinkUp',
  },
  description: 'Sign up or log in to LinkUp to connect with friends and share your moments.',
  openGraph: {
    title: 'LinkUp | Authentication',
    description: 'Connect with friends and share your moments on LinkUp.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUp | Authentication',
    description: 'Connect with friends and share your moments on LinkUp.',
  },
};

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Memoize children rendering for performance
  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <div className="auth-layout__wrapper" itemScope itemType="http://schema.org/WebPage">
      <a href="#main-content" className="auth-layout__skip-link">
        Skip to main content
      </a>
      <div className="auth-layout__liquid" role="banner" aria-hidden="true">
        <Image
          src="/svgs/liquid.svg"
          alt=""
          width={600}
          height={636}
          className="auth-layout__image--liquid"
          aria-hidden="true"
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 600px"
        />
      </div>
      <div className="auth-layout__footer" role="banner" aria-hidden="true">
        <Image
          src="/svgs/footer.svg"
          alt=""
          width={1439}
          height={214}
          className="auth-layout__image--footer"
          aria-hidden="true"
          loading="lazy"
          sizes="100vw"
        />
      </div>
      <main className="auth-layout__main" id="main-content" role="main" aria-labelledby="auth-layout-title">
        <h1 id="auth-layout-title" className="sr-only">
          Authentication
        </h1>
        {memoizedChildren}
      </main>
    </div>
  );
};

export default memo(AuthLayout);