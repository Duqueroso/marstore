import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';
import Users from '@/database/models/users';
import { verifyPassword } from '@/lib/auth-utils';

/**
 * Endpoint de prueba para verificar autenticación
 * IMPORTANTE: Eliminar en producción por razones de seguridad
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documento, password } = body;

    if (!documento || !password) {
      return NextResponse.json(
        { error: 'Documento y contraseña son requeridos' },
        { status: 400 }
      );
    }

    await dbConnection();

    const user = await Users.findOne({ documento });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no encontrado',
        documento,
      });
    }

    if (!user.password) {
      return NextResponse.json({
        success: false,
        message: 'Usuario sin contraseña (probablemente registrado con Google)',
        email: user.email,
        provider: user.provider,
      });
    }

    const isValid = await verifyPassword(password, user.password);

    return NextResponse.json({
      success: isValid,
      message: isValid ? 'Contraseña correcta' : 'Contraseña incorrecta',
      user: {
        email: user.email,
        name: user.name,
        documento: user.documento,
        provider: user.provider,
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error en test-password:', error);
    return NextResponse.json(
      { error: 'Error al verificar contraseña', details: error.message },
      { status: 500 }
    );
  }
}
