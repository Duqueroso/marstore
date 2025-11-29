import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnection from '@/lib/dbConnection';
import Products from '@/database/models/products';

// GET - Obtener todos los productos
export async function GET(request: Request) {
  try {
    await dbConnection();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const filter: Record<string, string | { $search: string }> = { isActive: 'true' };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Products.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto (solo admin)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    await dbConnection();

    const body = await request.json();
    const { name, description, price, category, images, stock } = body;

    // Validaciones
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const product = await Products.create({
      name,
      description,
      price,
      category,
      images: images || [],
      stock: stock || 0,
      isActive: true,
    });

    return NextResponse.json(
      { message: 'Producto creado exitosamente', product },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error al crear producto:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error al crear producto', details: message },
      { status: 500 }
    );
  }
}
