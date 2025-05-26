/*
 * Forgot Password page for the LinkUp application
 * - Renders the forgot password form within the auth layout
 * - Includes an illustration for visual appeal
 */

import ForgotPasswordForm from '@/forms/auth/ForgotPasswordForm';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your LinkUp password to regain access to your account.',
  openGraph: {
    title: 'LinkUp | Forgot Password',
    description: 'Reset your LinkUp password to regain access to your account.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUp | Forgot Password',
    description: 'Reset your LinkUp password to regain access to your account.',
  },
};

const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__form">
          <ForgotPasswordForm />
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

export default ForgotPasswordPage;