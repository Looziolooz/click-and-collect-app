"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Clock, Settings, LogOut, Menu, X } from 'lucide-react';

export function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Ordini Attivi', href: '/admin/dashboard', icon: Package },
    { name: 'Storico', href: '/admin/history', icon: Clock },
    { name: 'Prodotti', href: '/admin/products', icon: Settings },
  ];

  // LOGOUT ROBUSTO
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Hard redirect alla home per pulire tutto lo stato
      window.location.href = '/'; 
    } catch (error) {
      console.error("Errore logout", error);
    }
  };

  return (
    <nav className="bg-brand-blue-dark text-white shadow-lg border-b-4 border-brand-yellow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-serif font-bold text-xl text-brand-yellow">Admin Panel</span>
            </div>
            <div className="hidden md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive ? 'border-brand-yellow text-white' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" /> {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={handleLogout}
                className="hidden md:flex text-gray-300 hover:text-white items-center text-sm font-bold transition-colors"
            >
               <LogOut className="mr-2 h-4 w-4"/> Esci
            </button>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-brand-blue-dark border-t border-white/10 animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-3 rounded-md text-base font-medium flex items-center ${
                    isActive ? 'bg-brand-blue text-brand-yellow' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" /> {item.name}
                </Link>
              );
            })}
            <div className="border-t border-white/10 mt-2 pt-2">
              <button
                onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                className="w-full px-3 py-3 rounded-md text-base font-medium text-red-300 hover:text-red-100 hover:bg-white/10 flex items-center text-left"
              >
                <LogOut className="mr-3 h-5 w-5" /> Esci
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}