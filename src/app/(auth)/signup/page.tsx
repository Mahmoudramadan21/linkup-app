/*
 * Signup page for the LinkUp application
 * - Renders the signup form within the auth layout
 * - Includes an illustration for visual appeal
 */

import SignupForm from '@/forms/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up for LinkUp to connect with friends and share your moments.',
  openGraph: {
    title: 'LinkUp | Sign Up',
    description: 'Sign up for LinkUp to connect with friends and share your moments.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUp | Sign Up',
    description: 'Sign up for LinkUp to connect with friends and share your moments.',
  },
};

const SignupPage = () => {
  return (
    <div className="auth-page auth-page--signup">
      <div className="auth-page__container">
        <div className="auth-page__form auth-page__form--signup">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;