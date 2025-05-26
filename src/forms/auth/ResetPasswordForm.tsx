/*
 * Reset Password form component
 * - Renders a form for resetting the user password
 * - Includes input fields, validation, and submission logic
 * - Supports accessibility and error handling
 */

'use client';
import { memo, useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useResetPassword } from '@/hooks/auth/useResetPassword';

const ResetPasswordForm: React.FC = () => {
  const {
    formData,
    errors,
    serverError,
    serverSuccess,
    isLoading,
    handleChange,
    handleSubmit,
    hasErrors,
  } = useResetPassword();
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serverError && errorRef.current) {
      errorRef.current.focus();
    }
  }, [serverError]);

  return (
    <section
      className="auth-form auth-form--reset-password"
      role="form"
      aria-labelledby="reset-password-form-title"
      aria-describedby="reset-password-form-subtitle"
      itemScope
      itemType="http://schema.org/Person"
    >
      <div className="auth-form__container">
        <h1 id="reset-password-form-title" className="auth-form__title">
          Reset Password
        </h1>
        <p id="reset-password-form-subtitle" className="auth-form__subtitle">
          Set a new password for your account to access all features.
        </p>
        <form onSubmit={handleSubmit} className="auth-form__form" aria-label="Reset password form" noValidate>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            required
            autoComplete="new-password"
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
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
            disabled={isLoading || hasErrors}
            aria-label="Update password"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
          <p className="auth-form__signup">
            <Link href="/login" className="auth-form__link" prefetch={false}>
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default memo(ResetPasswordForm);