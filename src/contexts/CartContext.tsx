'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IProduct } from '@/database/models/products';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  isInCart: (productId: string) => boolean;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Cargar carrito desde la base de datos cuando el usuario inicia sesión
  useEffect(() => {
    const loadCart = async () => {
      if (status === 'loading') {
        return;
      }

      if (session?.user?.id) {
        // Usuario autenticado - cargar desde DB
        try {
          setLoading(true);
          const response = await fetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            setItems(data.cart || []);
            
            // Limpiar localStorage al cargar desde DB
            if (typeof window !== 'undefined') {
              localStorage.removeItem('marstore_cart');
            }
          }
        } catch (error) {
          console.error('❌ Error al cargar carrito:', error);
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      } else {
        // Usuario no autenticado - cargar desde localStorage
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem('marstore_cart');
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart));
            } catch (error) {
              console.error('Error al cargar el carrito:', error);
            }
          }
        }
        setLoading(false);
        setInitialized(true);
      }
    };

    loadCart();
  }, [session?.user?.id, status]);

  // Guardar en localStorage si no está autenticado
  useEffect(() => {
    if (!initialized) return;
    
    if (!session?.user?.id && typeof window !== 'undefined') {
      localStorage.setItem('marstore_cart', JSON.stringify(items));
    }
  }, [items, session?.user?.id, initialized]);

  // Sincronizar carrito de localStorage a DB cuando inicia sesión
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (!initialized || !session?.user?.id) return;

      const localCart = typeof window !== 'undefined' 
        ? localStorage.getItem('marstore_cart') 
        : null;

      if (localCart) {
        try {
          const localItems: CartItem[] = JSON.parse(localCart);
          
          // Agregar items de localStorage a la DB
          for (const item of localItems) {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: item.product._id,
                quantity: item.quantity
              })
            });
          }

          // Recargar carrito desde DB
          const response = await fetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            setItems(data.cart || []);
          }

          // Limpiar localStorage
          localStorage.removeItem('marstore_cart');
        } catch (error) {
          console.error('❌ Error al sincronizar carrito:', error);
        }
      }
    };

    syncCartOnLogin();
  }, [session?.user?.id, initialized]);

  const addToCart = async (product: IProduct, quantity: number = 1) => {
    if (session?.user?.id) {
      // Usuario autenticado - guardar en DB
      try {
        console.log('🛒 Agregando al carrito (DB):', product._id, 'cantidad:', quantity);
        
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product._id,
            quantity
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('❌ Error del servidor:', data);
          throw new Error(data.error || 'Error al agregar al carrito');
        }

        console.log('✅ Carrito actualizado:', data.cart?.length, 'items');
        setItems(data.cart || []);
      } catch (error) {
        console.error('❌ Error al agregar al carrito:', error);
        // Fallback: agregar localmente si falla la API
        setItems((currentItems) => {
          const existingItem = currentItems.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            return currentItems.map((item) =>
              item.product._id === product._id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, product.stock),
                  }
                : item
            );
          }

          return [...currentItems, { product, quantity: Math.min(quantity, product.stock) }];
        });
      }
    } else {
      // Usuario no autenticado - guardar en localStorage
      console.log('🛒 Agregando al carrito (localStorage):', product._id);
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.product._id === product._id
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + quantity, product.stock),
                }
              : item
          );
        }

        return [...currentItems, { product, quantity: Math.min(quantity, product.stock) }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (session?.user?.id) {
      // Usuario autenticado - eliminar de DB
      try {
        const response = await fetch(`/api/cart?productId=${productId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.cart || []);
        }
      } catch (error) {
        console.error('❌ Error al eliminar del carrito:', error);
      }
    } else {
      // Usuario no autenticado - eliminar de localStorage
      setItems((currentItems) =>
        currentItems.filter((item) => item.product._id !== productId)
      );
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (session?.user?.id) {
      // Usuario autenticado - actualizar en DB
      try {
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            quantity
          })
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.cart || []);
        }
      } catch (error) {
        console.error('❌ Error al actualizar carrito:', error);
      }
    } else {
      // Usuario no autenticado - actualizar en localStorage
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                quantity: Math.min(quantity, item.product.stock),
              }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (session?.user?.id) {
      // Usuario autenticado - vaciar en DB
      try {
        const response = await fetch('/api/cart', {
          method: 'DELETE'
        });

        if (response.ok) {
          setItems([]);
        }
      } catch (error) {
        console.error('❌ Error al vaciar carrito:', error);
      }
    } else {
      // Usuario no autenticado - vaciar localStorage
      setItems([]);
    }
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product._id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotal,
        isInCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
