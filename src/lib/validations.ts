import * as yup from 'yup';

// Función para crear schema de registro con mensajes traducidos
export const getRegisterSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    name: yup
      .string()
      .required(t('nameRequired'))
      .min(3, t('nameMin'))
      .max(100, t('nameMax'))
      .trim(),
    
    email: yup
      .string()
      .required(t('emailRequired'))
      .email(t('emailInvalid'))
      .lowercase()
      .trim(),
    
    documento: yup
      .string()
      .required(t('documentoRequired'))
      .matches(/^[0-9]{6,15}$/, t('documentoInvalid'))
      .trim(),
    
    password: yup
      .string()
      .required(t('passwordRequired'))
      .min(8, t('passwordMin'))
      .matches(/[A-Z]/, t('passwordUppercase'))
      .matches(/[a-z]/, t('passwordLowercase'))
      .matches(/[0-9]/, t('passwordNumber')),
    
    confirmPassword: yup
      .string()
      .required(t('confirmPasswordRequired'))
      .oneOf([yup.ref('password')], t('passwordsMatch'))
  });
};

// Función para crear schema de login con mensajes traducidos
export const getLoginSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    documento: yup
      .string()
      .required(t('documentoRequired'))
      .matches(/^[0-9]{6,15}$/, t('documentoInvalid'))
      .trim(),
    
    password: yup
      .string()
      .required(t('passwordRequired'))
      .min(8, t('passwordMin'))
  });
};

// Schema de validación para registro (versión legacy con textos en español)
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido')
    .lowercase()
    .trim(),
  
  documento: yup
    .string()
    .required('El documento es requerido')
    .matches(/^[0-9]{6,15}$/, 'El documento debe contener solo números (6-15 caracteres)')
    .trim(),
  
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número'),
  
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
});

// Schema de validación para login (versión legacy con textos en español)
export const loginSchema = yup.object().shape({
  documento: yup
    .string()
    .required('El documento es requerido')
    .matches(/^[0-9]{6,15}$/, 'El documento debe contener solo números (6-15 caracteres)')
    .trim(),
  
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
});

// Tipos inferidos de los schemas
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
