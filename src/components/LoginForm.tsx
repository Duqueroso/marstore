'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getLoginSchema, LoginFormData } from '@/lib/validations';
import { ValidationError } from 'yup';
import { useTranslations, useLocale } from 'next-intl';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('forms');
  const tValidation = useTranslations('validation');
  const tErrors = useTranslations('errors');
  const [formData, setFormData] = useState<LoginFormData>({
    documento: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    // Limpiar error específico del campo
    if (fieldErrors[name]) {
      const newFieldErrors = { ...fieldErrors };
      delete newFieldErrors[name];
      setFieldErrors(newFieldErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    // Validación con Yup usando schema traducido
    const loginSchema = getLoginSchema(tValidation);
    try {
      await loginSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      if (err instanceof ValidationError) {
        const newFieldErrors: Record<string, string> = {};
        
        err.inner.forEach((error) => {
          if (error.path) {
            newFieldErrors[error.path] = error.message;
          }
        });
        
        setFieldErrors(newFieldErrors);
        setError(tErrors('fixErrors'));
      }
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        documento: formData.documento,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(tErrors('invalidCredentials'));
        setLoading(false);
        return;
      }

      // Éxito
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch {
      setError(tErrors('serverError'));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
          {t('documento')}
        </label>
        <input
          type="text"
          id="documento"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 font-medium placeholder:text-gray-400 ${
            fieldErrors.documento ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          placeholder="12345678"
        />
        {fieldErrors.documento && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.documento}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t('password')}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 font-medium placeholder:text-gray-400 ${
            fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          placeholder="••••••••"
        />
        {fieldErrors.password && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary text-white py-4 rounded-xl font-bold text-lg hover-lift hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? t('signingIn') : t('signIn')}
      </button>
    </form>
  );
}
