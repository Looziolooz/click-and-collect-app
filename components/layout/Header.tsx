"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fish, Menu, X, ShoppingCart, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/hooks/use-cart';

export function Header() {
  // 1. Hook sempre all'inizio
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (!isMobile) setIsMenuOpen(false); }, [isMobile]);

  // 2. Controllo condizionale solo DOPO gli hook
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return null;
  }

  // 3. Render
  const cartItemCount = mounted ? cart.items.length : 0;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Prodotti', href: '/products' },
    { name: 'Chi Siamo', href: '/about' },
    { name: 'Contatti', href: '/contact' },
  ];

  return (
    <header className="bg-brand-blue shadow-lg sticky top-0 z-50 text-white border-b-4 border-brand-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-1.5 rounded-full border-2 border-brand-yellow">
               <Fish className="h-7 w-7 text-brand-blue" /> 
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-none text-white group-hover:text-brand-yellow transition-colors">Fresco&Fresco</span>
              <span className="text-[10px] uppercase tracking-widest text-brand-yellow font-bold">Da Vincenzo Tutino</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    pathname === item.href ? 'text-brand-yellow border-brand-yellow' : 'text-white/90 border-transparent hover:text-brand-yellow hover:border-brand-yellow/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <Link href="/cart" className="relative p-2 text-white hover:text-brand-yellow transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-brand-blue bg-brand-yellow rounded-full border border-brand-blue transform translate-x-1/4 -translate-y-1/4">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link href="/login" className="p-2 text-white/50 hover:text-brand-yellow transition-colors" title="Area Riservata">
                    <Lock className="h-5 w-5" />
                </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden gap-4">
            <Link href="/cart" className="relative text-white hover:text-brand-yellow">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-brand-yellow text-brand-blue rounded-full text-xs flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-white hover:text-brand-yellow hover:bg-brand-blue-dark">
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-brand-blue-light bg-brand-blue shadow-xl">
            <nav className="flex flex-col space-y-2 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    pathname === item.href ? 'bg-brand-blue-dark text-brand-yellow' : 'text-white hover:bg-brand-blue-light hover:text-brand-yellow'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-4 mt-2 border-t border-brand-blue-light">
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-base font-medium rounded-lg text-white hover:bg-brand-blue-light hover:text-brand-yellow flex items-center justify-center gap-2 bg-brand-blue-dark/50">
                    <ShoppingCart className="h-5 w-5" /> Carrello ({cartItemCount})
                  </Link>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-base font-medium rounded-lg text-white hover:bg-brand-blue-light hover:text-brand-yellow flex items-center justify-center gap-2 bg-brand-blue-dark/50">
                    <Lock className="h-5 w-5" /> Admin
                  </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}