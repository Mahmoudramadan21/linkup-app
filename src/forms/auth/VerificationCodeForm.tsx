/*
 * Verification Code form component
 * - Renders a form for verifying the code sent to the user's email
 * - Includes code input, validation, and submission logic
 * - Supports accessibility and error handling
 */

'use client';
import { memo, useEffect, useRef } from 'react';
import CodeInput from '@/components/ui/CodeInput';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useVerifyCode } from '@/hooks/auth/useVerifyCode';

const VerificationCodeForm: React.FC = () => {
  const {
    formData,
    errors,
    serverError,
    serverSuccess,
    isLoading,
    timer,
    canResend,
    handleCodeChange,
    handleResend,
    handleSubmit,
    formatTimer,
  } = useVerifyCode();
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serverError && errorRef.current) {
      errorRef.current.focus();
    }
  }, [serverError]);

  return (
    <section
      className="auth-form auth-form--verify-code"
      role="form"
      aria-labelledby="verify-code-form-title"
      aria-describedby="verify-code-form-subtitle"
      itemScope
      itemType="http://schema.org/Person"
    >
      <div className="auth-form__container">
        <h1 id="verify-code-form-title" className="auth-form__title">
          Verification
        </h1>
        <p id="verify-code-form-subtitle" className="auth-form__subtitle">
          Enter the 4-digit code sent to your email.
        </p>
        <form onSubmit={handleSubmit} className="auth-form__form" aria-label="Verification code form" noValidate>
          <CodeInput length={4} onChange={handleCodeChange} error={errors.code} />
          <div className="auth-form__timer" aria-live="polite">
            {formatTimer(timer)}
          </div>
          {serverSuccess && (
            <div className="auth-form__success" role="alert" aria-live="polite">
              {serverSuccess}
            </div>
          )}
          {serverError && (
            <div
              className="auth-form__error"
              role="alert"
              aria-live="assertive"
              ref={errorRef}
              tabIndex={-1}
            >
              {serverError}
            </div>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || formData.code.length !== 4}
            aria-label="Verify code"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
          <p className="auth-form__resend">
            Didn’t receive a code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className="auth-form__resend-link"
              aria-label="Resend verification code"
            >
              Resend
            </button>
          </p>
          <p className="auth-form__signup">
            <Link href="/forgot-password" className="auth-form__link" prefetch={false}>
              Back to Forgot Password
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default memo(VerificationCodeForm);