'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChange('es')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          locale === 'es'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Español"
      >
        🇪🇸 ES
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="English"
      >
        🇺🇸 EN
      </button>
    </div>
  );
}
