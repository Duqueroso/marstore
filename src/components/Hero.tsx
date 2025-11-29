import React from 'react';
import { Link } from '@/i18n/routing';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

export default function Hero({ 
  title, 
  subtitle, 
  ctaText, 
  ctaLink,
}: HeroProps) {
  return (
    <section 
      className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden gradient-full animate-gradient"
    >
      {/* Formas decorativas animadas */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-quaternary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-tertiary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 py-20 text-center z-10 relative">
        <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up drop-shadow-lg">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-95 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>
        <Link
          href={ctaLink}
          className="inline-block bg-white text-primary px-10 py-5 rounded-full text-lg font-bold hover:bg-quaternary hover:scale-110 hover-glow transition-all duration-300 shadow-2xl animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {ctaText} →
        </Link>
      </div>
      
      {/* Wave decorativo */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
