'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

interface LoginButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  showUserInfo?: boolean;
}

export default function LoginButton({ variant = 'primary', showUserInfo = true }: LoginButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');

  const buttonStyles = {
    primary: 'bg-primary text-white hover:bg-secondary',
    secondary: 'bg-secondary text-white hover:bg-primary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        {showUserInfo && (
          <div className="hidden md:flex items-center gap-3">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'Usuario'}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${buttonStyles[variant]}`}
        >
          {t('signOut')}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push(`/${locale}/login`)}
      className={`px-6 py-2 rounded-full font-medium transition-colors ${buttonStyles[variant]}`}
    >
      {t('signIn')}
    </button>
  );
}
