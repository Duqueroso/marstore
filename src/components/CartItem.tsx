'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const t = useTranslations('cart');
  const tProducts = useTranslations('products');
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (!product._id) return;
    if (newQuantity > product.stock) {
      alert(t('maxQuantity'));
      return;
    }
    if (newQuantity <= 0) {
      handleRemove();
      return;
    }
    updateQuantity(product._id, newQuantity);
  };

  const handleRemove = () => {
    if (!product._id) return;
    if (confirm(`${t('remove')} ${product.name}?`)) {
      removeFromCart(product._id);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 items-center">
      {/* Imagen del producto */}
      <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {tProducts(`categories.${product.category === 'mujer' ? 'women' : product.category === 'hombre' ? 'men' : product.category === 'accesorios' ? 'accessories' : 'footwear'}`)}
        </p>
        <p className="text-primary font-bold">
          ${product.price.toLocaleString('es-CO')}
        </p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border-2 border-quaternary/40 rounded-xl overflow-hidden">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="px-4 py-2 bg-quaternary/20 hover:bg-quaternary/40 transition-colors font-bold text-gray-800 text-lg"
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="px-6 py-2 bg-white border-x-2 border-quaternary/40 min-w-16 text-center font-bold text-gray-900 text-lg">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="px-4 py-2 bg-quaternary/20 hover:bg-quaternary/40 transition-colors font-bold text-gray-800 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Aumentar cantidad"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[100px]">
          <p className="text-sm text-gray-600">{t('subtotal')}</p>
          <p className="font-bold text-lg text-gray-800">
            ${subtotal.toLocaleString('es-CO')}
          </p>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 p-2 transition-colors"
          aria-label="Eliminar del carrito"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
