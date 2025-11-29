'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import { Link } from '@/i18n/routing';

export default function CartPage() {
  const t = useTranslations();
  const tCart = useTranslations('cart');
  const { items, clearCart, getTotal } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.products'), href: '/products' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const footerSections = [
    {
      title: t('footer.shop'),
      links: [
        { label: t('footer.women'), href: '#mujer' },
        { label: t('footer.men'), href: '#hombre' },
        { label: t('footer.accessories'), href: '#accesorios' },
        { label: t('footer.offers'), href: '#ofertas' },
      ],
    },
    {
      title: t('footer.help'),
      links: [
        { label: t('footer.faq'), href: '#faq' },
        { label: t('footer.shipping'), href: '#envios' },
        { label: t('footer.returns'), href: '#devoluciones' },
        { label: t('footer.sizes'), href: '#tallas' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.aboutUs'), href: '/about' },
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.careers'), href: '#empleo' },
        { label: t('footer.sustainability'), href: '#sostenibilidad' },
      ],
    },
  ];

  const handleClearCart = () => {
    if (confirm(tCart('confirmClear'))) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    // TODO: Implementar lógica de checkout
    alert('Funcionalidad de pago en desarrollo');
  };

  const subtotal = getTotal();
  const tax = Math.round(subtotal * 0.19); // IVA 19%
  const shipping = subtotal > 150000 ? 0 : 10000;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-linear-to-b from-quaternary/20 via-white to-white">
      <Navbar 
        brandName={t('common.brandName')}
        links={navLinks}
        showAuth={true}
      />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="hero-title text-6xl md:text-7xl font-bold text-primary mb-4 animate-fade-in-up">
              {tCart('title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-4 rounded-full"></div>
            {items.length > 0 && (
              <p className="text-xl text-gray-600 font-medium animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {items.length} {items.length === 1 ? tCart('item') : tCart('items')}
              </p>
            )}
          </div>

          {/* Carrito vacío */}
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-quaternary/20 animate-fade-in-up">
              <div className="mb-8">
                <div className="inline-block gradient-soft p-8 rounded-full animate-scale-in">
                  <svg
                    className="w-24 h-24 text-primary"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {tCart('empty')}
              </h2>
              <p className="text-lg text-gray-600 mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                {tCart('emptyDescription')}
              </p>
              <Link
                href="/products"
                className="inline-block gradient-primary text-white px-10 py-4 rounded-full font-bold hover-lift hover-glow transition-all duration-300 shadow-lg animate-scale-in"
                style={{animationDelay: '0.4s'}}
              >
                {tCart('continueShopping')}
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Lista de productos */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <div key={item.product._id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <CartItem item={item} />
                  </div>
                ))}

                {/* Botón vaciar carrito */}
                <div className="flex justify-between items-center pt-4">
                  <Link
                    href="/products"
                    className="gradient-text font-bold hover:underline transition-all"
                  >
                    ← {tCart('continueShopping')}
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 font-bold transition-colors hover:scale-105 duration-300"
                  >
                    {tCart('clearCart')}
                  </button>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 border border-quaternary/20 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <h2 className="section-title text-3xl mb-6">
                    {tCart('summary')}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700 text-lg">
                      <span className="font-medium">{tCart('subtotal')}</span>
                      <span className="font-bold">${subtotal.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-lg">
                      <span className="font-medium">{tCart('tax')}</span>
                      <span className="font-bold">${tax.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-lg">
                      <span className="font-medium">{tCart('shipping')}</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-tertiary font-bold animate-pulse-glow">
                            {tCart('freeShipping')}
                          </span>
                        ) : (
                          <span className="font-bold">${shipping.toLocaleString('es-CO')}</span>
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-sm text-gray-500 bg-quaternary/20 p-3 rounded-xl">
                        Envío gratis en compras superiores a $150,000
                      </p>
                    )}
                  </div>

                  <div className="border-t border-quaternary/30 pt-6 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-800">
                        {tCart('total')}
                      </span>
                      <span className="text-3xl font-bold gradient-text">
                        ${total.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full gradient-primary text-white py-5 rounded-full font-bold text-lg hover-lift hover-glow transition-all duration-300 shadow-lg"
                  >
                    ✨ {tCart('checkout')}
                  </button>

                  {!session && (
                    <p className="text-sm text-gray-600 text-center mt-4 font-medium">
                      Inicia sesión para continuar con tu compra
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer
        brandName={t('common.brandName')}
        brandDescription={t('footer.description')}
        sections={footerSections}
        socialLinks={{
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          twitter: 'https://twitter.com',
        }}
      />
    </div>
  );
}
