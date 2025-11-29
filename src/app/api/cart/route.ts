import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnection from '@/lib/dbConnection';
import Users from '@/database/models/users';
import Products from '@/database/models/products';

/**
 * GET - Obtener el carrito del usuario autenticado
 */
export async function GET() {
  try {
    const session = await auth();
    
    console.log('📦 GET /api/cart - Session:', session?.user?.id ? 'Autenticado' : 'No autenticado');
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    await dbConnection();

    const user = await Users.findById(session.user.id).populate('cart.productId');
    
    if (!user) {
      console.log('❌ Usuario no encontrado:', session.user.id);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Inicializar cart si no existe
    if (!user.cart) {
      user.cart = [];
      await user.save();
      console.log('🔧 Cart inicializado para usuario:', user.email);
    }

    // Filtrar productos que ya no existen
    const validCart = user.cart?.filter(item => item.productId) || [];

    console.log('✅ Carrito obtenido:', validCart.length, 'items para', user.email);

    return NextResponse.json({
      cart: validCart.map(item => ({
        product: item.productId,
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    return NextResponse.json(
      { error: 'Error al obtener el carrito' },
      { status: 500 }
    );
  }
}

/**
 * POST - Agregar producto al carrito
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    console.log('📦 POST /api/cart - Session:', session?.user?.id ? 'Autenticado' : 'No autenticado');
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    console.log('📦 Datos recibidos:', { productId, quantity });

    if (!productId) {
      return NextResponse.json(
        { error: 'ProductId es requerido' },
        { status: 400 }
      );
    }

    await dbConnection();

    // Verificar que el producto existe
    const product = await Products.findById(productId);
    if (!product) {
      console.log('❌ Producto no encontrado:', productId);
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Producto encontrado:', product.name, 'Stock:', product.stock);

    // Verificar stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      );
    }

    const user = await Users.findById(session.user.id);
    
    if (!user) {
      console.log('❌ Usuario no encontrado:', session.user.id);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Usuario encontrado:', user.email, 'Items en carrito:', user.cart?.length || 0);

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = user.cart?.findIndex(
      item => item.productId.toString() === productId
    ) ?? -1;

    if (existingItemIndex >= 0 && user.cart) {
      // Actualizar cantidad
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: 'Stock insuficiente' },
          { status: 400 }
        );
      }
      
      user.cart[existingItemIndex].quantity = newQuantity;
      console.log('🔄 Cantidad actualizada:', newQuantity);
    } else {
      // Agregar nuevo item
      if (!user.cart) {
        user.cart = [];
      }
      user.cart.push({ productId, quantity });
      console.log('➕ Nuevo item agregado');
    }

    await user.save();
    console.log('💾 Carrito guardado en BD');

    // Retornar el carrito actualizado
    await user.populate('cart.productId');

    const cartResponse = user.cart.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    console.log('✅ Carrito retornado:', cartResponse.length, 'items');

    return NextResponse.json({
      message: 'Producto agregado al carrito',
      cart: cartResponse
    });
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    return NextResponse.json(
      { error: 'Error al agregar al carrito', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Actualizar cantidad de un producto en el carrito
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'ProductId y quantity son requeridos' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'La cantidad debe ser al menos 1' },
        { status: 400 }
      );
    }

    await dbConnection();

    // Verificar stock
    const product = await Products.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      );
    }

    const user = await Users.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const itemIndex = user.cart?.findIndex(
      item => item.productId.toString() === productId
    ) ?? -1;

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Producto no encontrado en el carrito' },
        { status: 404 }
      );
    }

    if (user.cart) {
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();
    await user.populate('cart.productId');

    return NextResponse.json({
      message: 'Cantidad actualizada',
      cart: user.cart?.map(item => ({
        product: item.productId,
        quantity: item.quantity
      })) || []
    });
  } catch (error) {
    console.error('❌ Error al actualizar carrito:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el carrito' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Eliminar producto del carrito o vaciar carrito
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    await dbConnection();

    const user = await Users.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (!productId) {
      // Vaciar carrito completo
      user.cart = [];
    } else {
      // Eliminar producto específico
      user.cart = user.cart?.filter(
        item => item.productId.toString() !== productId
      ) || [];
    }

    await user.save();
    await user.populate('cart.productId');

    return NextResponse.json({
      message: productId ? 'Producto eliminado del carrito' : 'Carrito vaciado',
      cart: user.cart.map(item => ({
        product: item.productId,
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error('❌ Error al eliminar del carrito:', error);
    return NextResponse.json(
      { error: 'Error al eliminar del carrito' },
      { status: 500 }
    );
  }
}
