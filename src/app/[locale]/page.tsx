import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import {useTranslations} from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations();
  
  // Configuración del Navbar
  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.products'), href: '/products' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  // Configuración de Features/Categorías
  const features = [
    {
      title: t('features.fashion.title'),
      description: t('features.fashion.description'),
      icon: '👗',
    },
    {
      title: t('features.accessories.title'),
      description: t('features.accessories.description'),
      icon: '💍',
    },
    {
      title: t('features.footwear.title'),
      description: t('features.footwear.description'),
      icon: '👠',
    },
    {
      title: t('features.shipping.title'),
      description: t('features.shipping.description'),
      icon: '🚚',
    },
    {
      title: t('features.returns.title'),
      description: t('features.returns.description'),
      icon: '↩️',
    },
    {
      title: t('features.support.title'),
      description: t('features.support.description'),
      icon: '💬',
    },
  ];

  // Configuración del Footer
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

  return (
    <main>
      <Navbar 
        brandName={t('common.brandName')}
        links={navLinks}
        showAuth={true}
      />
      
      <div id="inicio" className="pt-16">
        <Hero
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
          ctaText={t('hero.cta')}
          ctaLink="/products"
        />
      </div>

      <div id="categorias">
        <Features
          title={t('features.title')}
          features={features}
        />
      </div>

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
    </main>
  );
}
