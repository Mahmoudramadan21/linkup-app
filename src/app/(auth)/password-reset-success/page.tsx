/*
 * Password Reset Success page for the LinkUp application
 * - Renders a success message after password reset
 * - Includes an illustration for visual appeal
 */

import PasswordResetSuccess from '@/forms/auth/PasswordResetSuccess';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Reset Success',
  description: 'Your password has been successfully reset. Log in to your LinkUp account.',
  openGraph: {
    title: 'LinkUp | Password Reset Success',
    description: 'Your password has been successfully reset. Log in to your LinkUp account.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUp | Password Reset Success',
    description: 'Your password has been successfully reset. Log in to your LinkUp account.',
  },
};

const PasswordResetSuccessPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__form">
          <PasswordResetSuccess />
        </div>
        <div className="auth-page__illustration" aria-hidden="true">
          <Image
            src="/illustrations/auth-security-illustration.svg"
            alt="Illustration of a person resetting their password securely"
            width={500}
            height={500}
            className="auth-page__image--illustration"
            loading="lazy"
            sizes="(max-width: 1024px) 50vw, 500px"
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccessPage;