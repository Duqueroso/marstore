'use client';

import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/routing';

export default function AboutPage() {
  const t = useTranslations();
  const tAbout = useTranslations('about');

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

  const values = [
    {
      icon: '⭐',
      title: tAbout('values.quality.title'),
      description: tAbout('values.quality.description'),
    },
    {
      icon: '💡',
      title: tAbout('values.innovation.title'),
      description: tAbout('values.innovation.description'),
    },
    {
      icon: '🌱',
      title: tAbout('values.sustainability.title'),
      description: tAbout('values.sustainability.description'),
    },
    {
      icon: '❤️',
      title: tAbout('values.customer.title'),
      description: tAbout('values.customer.description'),
    },
  ];

  const stats = [
    { number: '10,000+', label: tAbout('stats.customers') },
    { number: '500+', label: tAbout('stats.products') },
    { number: '5+', label: tAbout('stats.years') },
    { number: '98%', label: tAbout('stats.satisfaction') },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-quaternary/20 via-white to-white">
      <Navbar 
        brandName={t('common.brandName')}
        links={navLinks}
        showAuth={true}
      />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-full py-20 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-quaternary/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="hero-title text-6xl md:text-7xl font-bold mb-6 text-white animate-fade-in-up">{tAbout('title')}</h1>
              <p className="text-2xl text-white/90 animate-fade-in-up" style={{animationDelay: '0.2s'}}>{tAbout('subtitle')}</p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-left">
                <h2 className="section-title text-5xl mb-6">
                  {tAbout('hero.title')}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {tAbout('hero.description')}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Hoy, somos orgullosos de servir a miles de clientes en toda Colombia, 
                  ofreciendo una amplia selección de ropa, accesorios y calzado que combina 
                  las últimas tendencias con la comodidad y durabilidad que mereces.
                </p>
              </div>
              <div className="relative animate-fade-in-right">
                <div className="gradient-soft rounded-2xl p-8 backdrop-blur-sm hover-lift transition-all duration-300">
                  <div className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <span className="text-8xl animate-float">👗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="gradient-soft p-8 rounded-2xl hover-lift transition-all duration-300 border border-quaternary/20 animate-fade-in-up">
                <div className="text-5xl mb-4 animate-float">🎯</div>
                <h3 className="text-3xl font-bold text-primary mb-4">
                  {tAbout('mission.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {tAbout('mission.description')}
                </p>
              </div>
              <div className="gradient-primary p-8 rounded-2xl hover-lift transition-all duration-300 text-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="text-5xl mb-4 animate-float" style={{animationDelay: '0.5s'}}>🚀</div>
                <h3 className="text-3xl font-bold mb-4">
                  {tAbout('vision.title')}
                </h3>
                <p className="leading-relaxed opacity-90">
                  {tAbout('vision.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 gradient-full relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-quaternary/20 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="text-5xl md:text-6xl font-bold mb-2 text-white">
                    {stat.number}
                  </div>
                  <div className="text-lg text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-5xl text-center mb-16 animate-fade-in-up">
              {tAbout('values.title')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover-lift hover-glow border border-quaternary/20 transition-all duration-300 animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="text-6xl mb-4 animate-float" style={{animationDelay: `${index * 0.2}s`}}>{value.icon}</div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="section-title text-5xl mb-6 animate-fade-in-up">
                {tAbout('team.title')}
              </h2>
              <p className="text-lg text-gray-700 mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {tAbout('team.description')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { emoji: '👨‍💼', role: 'CEO' },
                  { emoji: '👩‍🎨', role: 'Diseño' },
                  { emoji: '👨‍💻', role: 'Tech' },
                  { emoji: '👩‍💼', role: 'Ventas' },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="gradient-soft p-6 rounded-2xl hover-lift transition-all duration-300 border border-quaternary/20 animate-scale-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="text-7xl mb-3 animate-float" style={{animationDelay: `${index * 0.2}s`}}>{member.emoji}</div>
                    <div className="font-bold text-primary">
                      {member.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-full relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-20 w-64 h-64 bg-quaternary/30 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-10 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="hero-title text-5xl md:text-6xl font-bold mb-6 text-white animate-fade-in-up">{tAbout('cta.title')}</h2>
            <p className="text-2xl mb-10 text-white/90 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {tAbout('cta.description')}
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover-lift hover-glow transition-all duration-300 shadow-2xl animate-scale-in"
              style={{animationDelay: '0.4s'}}
            >
              {tAbout('cta.button')}
            </Link>
          </div>
        </section>
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
