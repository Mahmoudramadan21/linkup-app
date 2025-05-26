/*
 * Password Reset Success component
 * - Renders a success message and a continue button after password reset
 * - Supports accessibility
 */

'use client';
import { memo } from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { usePasswordResetSuccess } from '@/hooks/auth/usePasswordResetSuccess';

const PasswordResetSuccess: React.FC = () => {
  const { handleContinue } = usePasswordResetSuccess();

  return (
    <section
      className="auth-form auth-form--password-reset-success"
      role="region"
      aria-labelledby="password-reset-success-title"
      aria-describedby="password-reset-success-subtitle"
    >
      <div className="auth-form__container">
        <Image
          src="/svgs/success-checkmark.svg"
          alt="Success checkmark"
          width={64}
          height={64}
          className="auth-form__image--success"
          loading="lazy"
          sizes="64px"
          aria-hidden="true"
        />
        <h1 id="password-reset-success-title" className="auth-form__title">
          Password Reset Successful
        </h1>
        <p id="password-reset-success-subtitle" className="auth-form__subtitle">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
        <Button
          type="button"
          onClick={handleContinue}
          variant="primary"
          aria-label="Continue to login"
        >
          Continue to Login
        </Button>
      </div>
    </section>
  );
};

export default memo(PasswordResetSuccess);