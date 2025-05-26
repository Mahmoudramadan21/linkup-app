/*
 * Reset Password page for the LinkUp application
 * - Renders the reset password form within the auth layout
 * - Includes an illustration for visual appeal
 */

import ResetPasswordForm from '@/forms/auth/ResetPasswordForm';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your LinkUp account to regain access.',
  openGraph: {
    title: 'LinkUp | Reset Password',
    description: 'Set a new password for your LinkUp account to regain access.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUp | Reset Password',
    description: 'Set a new password for your LinkUp account to regain access.',
  },
};

const ResetPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__form">
          <ResetPasswordForm />
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

export default ResetPasswordPage;