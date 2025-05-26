/*
 * Verify Code page for the LinkUp application
 * - Renders the verification code form within the auth layout
 * - Includes an illustration for visual appeal
 */

import VerificationCodeForm from '@/forms/auth/VerificationCodeForm';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Code',
  description: 'Enter the verification code sent to your email to reset your LinkUp account password.',
  openGraph: {
    title: 'LinkUp | Verify Code',
    description: 'Enter the verification code sent to your email to reset your LinkUp account password.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUp | Verify Code',
    description: 'Enter the verification code sent to your email to reset your LinkUp account password.',
  },
};

const VerifyCodePage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__form">
          <VerificationCodeForm />
        </div>
        <div className="auth-page__illustration" aria-hidden="true">
          <Image
            src="/illustrations/auth-security-illustration.svg"
            alt="Illustration of a person verifying a code securely"
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

export default VerifyCodePage;