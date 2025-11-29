'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/database/models/products';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  const { data: session } = useSession();
  const t = useTranslations();
  const tProducts = useTranslations('products');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const isAdmin = session?.user?.rol === 'admin';

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
        { label: t('footer.aboutUs'), href: '#nosotros' },
        { label: t('footer.contact'), href: '#contacto' },
        { label: t('footer.careers'), href: '#empleo' },
        { label: t('footer.sustainability'), href: '#sostenibilidad' },
      ],
    },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const url = selectedCategory
          ? `/api/products?category=${selectedCategory}`
          : '/api/products';
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/products?category=${selectedCategory}`
        : '/api/products';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: Partial<IProduct>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || tProducts('errorCreating'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(tProducts('errorCreating'));
    }
  };

  const handleUpdateProduct = async (data: Partial<IProduct>) => {
    if (!editingProduct?._id) return;

    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || tProducts('errorUpdating'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(tProducts('errorUpdating'));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(tProducts('confirmDelete'))) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || tProducts('errorDeleting'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(tProducts('errorDeleting'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        brandName={t('common.brandName')}
        links={navLinks}
        showAuth={true}
      />

      <main className="pt-20 pb-12 bg-linear-to-b from-quaternary/20 via-white to-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="hero-title text-6xl md:text-7xl font-bold text-primary mb-4 animate-fade-in-up">
              {tProducts('title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="gradient-primary text-white px-8 py-4 rounded-full font-bold hover:scale-110 hover-glow transition-all duration-300 shadow-lg animate-fade-in-up"
              >
                ✨ {tProducts('createProduct')}
              </button>
            )}
          </div>

          {/* Filtros de categoría */}
          <div className="flex gap-3 flex-wrap justify-center mb-8">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                selectedCategory === ''
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-quaternary/50 border border-quaternary/30'
              }`}
            >
              {tProducts('allCategories')}
            </button>
            <button
              onClick={() => setSelectedCategory('mujer')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                selectedCategory === 'mujer'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-quaternary/50 border border-quaternary/30'
              }`}
            >
              👗 {tProducts('categories.women')}
            </button>
            <button
              onClick={() => setSelectedCategory('hombre')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                selectedCategory === 'hombre'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-quaternary/50 border border-quaternary/30'
              }`}
            >
              👔 {tProducts('categories.men')}
            </button>
            <button
              onClick={() => setSelectedCategory('accesorios')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                selectedCategory === 'accesorios'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-quaternary/50 border border-quaternary/30'
              }`}
            >
              💍 {tProducts('categories.accessories')}
            </button>
            <button
              onClick={() => setSelectedCategory('calzado')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                selectedCategory === 'calzado'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-quaternary/50 border border-quaternary/30'
              }`}
            >
              👠 {tProducts('categories.footwear')}
            </button>
          </div>

          {/* Lista de productos */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="inline-block gradient-soft p-8 rounded-full mb-6">
                <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-700">{tProducts('noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteProduct}
                />
              ))}
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

      {/* Formulario de producto */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
