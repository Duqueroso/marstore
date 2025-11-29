'use client';

import React, { useState } from 'react';
import LoginButton from './LoginButton';
import LanguageSwitcher from './LanguageSwitcher';
import CartButton from './CartButton';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  brandName: string;
  links: NavLink[];
  showAuth?: boolean;
}

export default function Navbar({ brandName, links, showAuth = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-quaternary/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center py-2">
              <Image 
                src="/marstore-logo.png" 
                alt={brandName}
                width={200}
                height={55}
                className="h-12 w-auto object-contain"
                priority
                style={{ mixBlendMode: 'multiply' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="relative text-gray-700 hover:text-primary transition-colors font-medium group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <LanguageSwitcher />
            <CartButton />
            {showAuth && (
              <LoginButton variant="primary" showUserInfo={true} />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
              <div className="pt-2">
                <CartButton />
              </div>
              {showAuth && (
                <div className="pt-2">
                  <LoginButton variant="primary" showUserInfo={false} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
