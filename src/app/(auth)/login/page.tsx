/*
 * Login page for the LinkUp application
 * - Renders the login form within the auth layout
 * - Includes an illustration for visual appeal
 */

import LoginForm from '@/forms/auth/LoginForm';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to LinkUp to connect with friends and share your moments.',
  openGraph: {
    title: 'LinkUp | Login',
    description: 'Log in to LinkUp to connect with friends and share your moments.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUp | Login',
    description: 'Log in to LinkUp to connect with friends and share your moments.',
  },
};

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__form">
          <LoginForm />
        </div>
        <div className="auth-page__illustration" aria-hidden="true">
          <Image
            src="/illustrations/login-illustration.svg"
            alt="People connecting on LinkUp"
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

export default LoginPage;