import Link from 'next/link';
import { Package, Clock, Settings, LogOut } from 'lucide-react';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      {/* NAVBAR ADMIN - Blu Scuro con accenti Gialli */}
      <nav className="bg-brand-blue-dark text-white shadow-lg border-b-4 border-brand-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo e Link Sinistra */}
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-serif font-bold text-xl text-brand-yellow">Admin Panel</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/admin/dashboard" className="border-transparent text-gray-300 hover:text-white hover:border-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Package className="mr-2 h-4 w-4" /> Ordini Attivi
                </Link>
                <Link href="/admin/history" className="border-transparent text-gray-300 hover:text-white hover:border-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Clock className="mr-2 h-4 w-4" /> Storico Processati
                </Link>
                {/* Link alla gestione prodotti */}
                <Link href="/admin/products" className="border-transparent text-gray-300 hover:text-white hover:border-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Settings className="mr-2 h-4 w-4" /> Gestisci Prodotti
                </Link>
              </div>
            </div>
            
            {/* Link Destra (Esci) */}
            <div className="flex items-center">
               <Link href="/" className="text-gray-300 hover:text-white flex items-center text-sm font-bold transition-colors">
                 <LogOut className="mr-2 h-4 w-4"/> Esci
               </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENUTO PRINCIPALE */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}