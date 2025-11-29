'use client';

import { IProduct } from '@/database/models/products';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: IProduct;
  onEdit?: (product: IProduct) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { data: session } = useSession();
  const t = useTranslations('products');
  const tCart = useTranslations('cart');
  const { addToCart, isInCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const isAdmin = session?.user?.rol === 'admin';
  const isUser = session?.user?.rol === 'user';
  const inCart = isInCart(product._id || '');

  const handleAddToCart = () => {
    addToCart(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift hover-glow transition-all duration-300 relative border border-quaternary/20">
      {/* Notificación de agregado al carrito */}
      {showNotification && (
        <div className="absolute top-4 right-4 bg-gradient-primary text-white px-4 py-2 rounded-full shadow-xl z-10 animate-fade-in">
          ✓ {tCart('itemAdded')}
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative h-64 bg-gradient-soft overflow-hidden group">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-6xl animate-float">📦</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-xl">{t('outOfStock')}</span>
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-3 left-3 bg-tertiary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            ¡Solo {product.stock}!
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Precio</p>
            <span className="text-3xl font-bold text-primary">
              ${product.price.toLocaleString('es-CO')}
            </span>
          </div>
          <span className="text-sm text-gray-600 bg-quaternary/30 px-3 py-1 rounded-full font-medium">
            {t('stock')}: {product.stock}
          </span>
        </div>

        {/* Botones según el rol */}
        <div className="space-y-2">
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit && onEdit(product)}
                className="flex-1 gradient-secondary text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {t('edit')}
              </button>
              <button
                onClick={() => onDelete && product._id && onDelete(product._id)}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {t('delete')}
              </button>
            </div>
          )}

          {isUser && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                inCart
                  ? 'bg-gradient-soft text-primary border-2 border-tertiary'
                  : 'gradient-primary text-white'
              }`}
            >
              {inCart ? '✓ ' : '🛒 '}{t('addToCart')}
            </button>
          )}

          {!session && (
            <div className="text-center">
              <p className="text-sm text-gray-500">{t('loginToBuy')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
