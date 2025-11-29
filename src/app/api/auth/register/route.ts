import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';
import Users from '@/database/models/users';
import { hashPassword, validateEmail, validateDocumento, validatePassword } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, documento, password } = body;

    // Validaciones
    if (!name || !email || !documento || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (!validateDocumento(documento)) {
      return NextResponse.json(
        { error: 'El documento debe contener solo números y tener entre 6 y 15 caracteres' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Contraseña inválida', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await dbConnection();

    // Verificar si el email ya existe
    const existingEmail = await Users.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    // Verificar si el documento ya existe
    const existingDocumento = await Users.findOne({ documento });
    if (existingDocumento) {
      return NextResponse.json(
        { error: 'El documento ya está registrado' },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const newUser = await Users.create({
      name,
      email,
      documento,
      password: hashedPassword,
      provider: 'credentials',
      rol: 'user',
    });

    // Devolver respuesta sin la contraseña
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          documento: newUser.documento,
          rol: newUser.rol,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario', details: error.message },
      { status: 500 }
    );
  }
}
