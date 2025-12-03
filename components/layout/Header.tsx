"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fish, Menu, X, ShoppingCart } from 'lucide-react'; // Aggiunto ShoppingCart
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/hooks/use-cart'; // Importiamo il carrello

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  // Collegamento al Carrello
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  // Evita errori di idratazione (Next.js server vs client)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Chiudi menu se si passa a desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  // Calcola numero oggetti nel carrello
  const cartItemCount = mounted ? cart.items.length : 0;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Prodotti', href: '/products' },
    // Ho rimosso "Preordina" perché ora si usa il Carrello
    { name: 'Chi Siamo', href: '/about' },
    { name: 'Contatti', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Fish className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900 leading-tight">Fresco&Fresco</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Da Vincenzo Tutino</span>
            </div>
          </Link>

          {/* Desktop Navigation + CART */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    pathname === item.href
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* ICONA CARRELLO (Desktop) */}
            <Link 
              href="/cart" 
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Vai al carrello"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Buttons (Menu + Cart) */}
          <div className="flex items-center md:hidden gap-4">
            {/* Icona Carrello Mobile */}
            <Link href="/cart" className="relative text-gray-700 hover:text-blue-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Link carrello anche nel menu a tendina per comodità */}
              <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" /> Il tuo Carrello ({cartItemCount})
                </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}