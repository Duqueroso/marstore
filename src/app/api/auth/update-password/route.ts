import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';
import Users from '@/database/models/users';
import { hashPassword } from '@/lib/auth-utils';

/**
 * Endpoint para actualizar contraseña de un usuario
 * Útil para resetear contraseñas si hay problemas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documento, newPassword } = body;

    if (!documento || !newPassword) {
      return NextResponse.json(
        { error: 'Documento y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    await dbConnection();

    const user = await Users.findOne({ documento });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Hashear la nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar la contraseña
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Contraseña actualizada para:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
      user: {
        email: user.email,
        name: user.name,
        documento: user.documento,
      },
    });
  } catch (error) {
    console.error('❌ Error al actualizar contraseña:', error);
    return NextResponse.json(
      { error: 'Error al actualizar contraseña' },
      { status: 500 }
    );
  }
}
