'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getRegisterSchema, RegisterFormData } from '@/lib/validations';
import { ValidationError } from 'yup';
import { useTranslations, useLocale } from 'next-intl';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('forms');
  const tValidation = useTranslations('validation');
  const tErrors = useTranslations('errors');
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    documento: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors([]);
    // Limpiar error específico del campo
    if (fieldErrors[name]) {
      const newFieldErrors = { ...fieldErrors };
      delete newFieldErrors[name];
      setFieldErrors(newFieldErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setFieldErrors({});
    setLoading(true);

    // Validación con Yup usando schema traducido
    const registerSchema = getRegisterSchema(tValidation);
    try {
      await registerSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      if (err instanceof ValidationError) {
        const newErrors: string[] = [];
        const newFieldErrors: Record<string, string> = {};
        
        err.inner.forEach((error) => {
          if (error.path) {
            newFieldErrors[error.path] = error.message;
          }
          newErrors.push(error.message);
        });
        
        setErrors(newErrors);
        setFieldErrors(newFieldErrors);
      }
      setLoading(false);
      return;
    }

    try {
      // Registrar usuario
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          documento: formData.documento,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([data.error || tErrors('registrationFailed')]);
        if (data.details && Array.isArray(data.details)) {
          setErrors(prev => [...prev, ...data.details]);
        }
        setLoading(false);
        return;
      }

      // Auto login después del registro
      const result = await signIn('credentials', {
        documento: formData.documento,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors([tErrors('registeredButLoginFailed')]);
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
      setErrors([tErrors('serverError')]);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('fullName')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent ${
            fieldErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          placeholder={t('fullNamePlaceholder')}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent ${
            fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          placeholder={t('emailPlaceholder')}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
        )}
      </div>

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
          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent ${
            fieldErrors.documento ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          placeholder="12345678"
        />
        {fieldErrors.documento ? (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.documento}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">{t('documentoHint')}</p>
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
          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent ${
            fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          placeholder="••••••••"
        />
        {fieldErrors.password ? (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            {t('passwordHint')}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t('confirmPassword')}
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent ${
            fieldErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          placeholder="••••••••"
        />
        {fieldErrors.confirmPassword && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary text-white py-4 rounded-xl font-bold text-lg hover-lift hover-glow shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('registering') : t('createAccount')}
      </button>
    </form>
  );
}
