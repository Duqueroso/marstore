import bcrypt from 'bcrypt';

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, 12);
    console.log('🔐 Contraseña hasheada exitosamente');
    return hash;
  } catch (error) {
    console.error('❌ Error al hashear contraseña:', error);
    throw error;
  }
}

/**
 * Verifica una contraseña contra su hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('🔐 Verificación de contraseña:', isValid ? '✅ Válida' : '❌ Inválida');
    return isValid;
  } catch (error) {
    console.error('❌ Error en bcrypt.compare:', error);
    return false;
  }
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que el documento solo contenga números y tenga entre 6 y 15 caracteres
 */
export function validateDocumento(documento: string): boolean {
  const documentoRegex = /^[0-9]{6,15}$/;
  return documentoRegex.test(documento);
}

/**
 * Valida que la contraseña cumpla con los requisitos de seguridad
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
