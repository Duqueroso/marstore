'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Link } from '@/i18n/routing';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary via-secondary to-tertiary flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{tCommon('brandName')}</h1>
          <p className="text-gray-600">
            {isRegistering ? t('createAccount') : t('welcomeBack')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              !isRegistering
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('signIn')}
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isRegistering
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('register')}
          </button>
        </div>

        {/* Forms */}
        <div className="mb-6">
          {isRegistering ? <RegisterForm /> : <LoginForm />}
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">{t('orContinueWith')}</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        {/* Beneficios */}
        {!isRegistering && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {t('signInBenefits')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-tertiary">✓</span>
                {t('benefit1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-tertiary">✓</span>
                {t('benefit2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-tertiary">✓</span>
                {t('benefit3')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-tertiary">✓</span>
                {t('benefit4')}
              </li>
            </ul>
          </div>
        )}

        {/* Volver al inicio */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-secondary hover:text-primary transition-colors font-medium"
          >
            ← {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
