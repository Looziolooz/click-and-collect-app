"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Eye, Clock, ShoppingBag, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Definizione tipi stretta per TypeScript
interface OrderItem {
  id: string;
  quantity: number;
  unit: string;
  product?: {
    name: string;
  };
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: 'PENDING' | 'READY' | 'COMPLETED' | 'REJECTED';
  pickupTime: string;
  estimatedTotal: number;
  finalTotal?: number;
  items: OrderItem[];
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeOrders, setActiveOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Funzione di fetch isolata per poter essere richiamata (refresh)
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!res.ok) throw new Error("Errore server");
      
      const data: AdminOrder[] = await res.json();
      
      // FILTRO CRITICO: Mostriamo solo ordini ATTIVI (Pending o Ready)
      // Escludiamo Completed e Rejected che vanno nello storico
      const active = data.filter(o => o.status === 'PENDING' || o.status === 'READY');
      
      // Ordiniamo per orario di ritiro (i più urgenti prima)
      active.sort((a, b) => new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime());

      setActiveOrders(active);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Errore fetch ordini:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Caricamento iniziale
  useEffect(() => {
    fetchOrders();
    
    // Opzionale: Polling automatico ogni 60 secondi
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Helper per il badge di stato
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': 
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 animate-pulse">
            <AlertTriangle size={12} /> DA LAVORARE
          </span>
        );
      case 'READY': 
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
            <CheckCircle2 size={12} /> PRONTO RITIRO
          </span>
        );
      default: 
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  // Helper per formattare l'orario in modo leggibile
  const formatPickupTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    
    const time = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div className="flex flex-col">
        <span className={`font-bold text-lg ${isToday ? 'text-brand-blue' : 'text-gray-700'}`}>
          {time}
        </span>
        <span className="text-[10px] uppercase font-bold text-gray-400">
          {isToday ? 'OGGI' : date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Ordini in Coda</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestisci la pesatura e la preparazione degli ordini attivi.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Ultimo aggiornamento</p>
            <p className="font-mono text-sm font-bold text-gray-600">
              {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <button 
            onClick={fetchOrders} 
            disabled={loading}
            className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-light text-white px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 shadow-md active:scale-95"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? 'Caricamento...' : 'Aggiorna'}
          </button>
        </div>
      </div>

      {/* KPI Cards Rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Totale Attivi</p>
            <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-brand-blue"><ShoppingBag /></div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-yellow-600 uppercase">Da Pesare</p>
            <p className="text-2xl font-bold text-yellow-800">
              {activeOrders.filter(o => o.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-yellow-200 p-3 rounded-full text-yellow-800"><AlertTriangle /></div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-green-600 uppercase">Pronti al Ritiro</p>
            <p className="text-2xl font-bold text-green-800">
              {activeOrders.filter(o => o.status === 'READY').length}
            </p>
          </div>
          <div className="bg-green-200 p-3 rounded-full text-green-800"><CheckCircle2 /></div>
        </div>
      </div>

      {/* Tabella Ordini */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Orario</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Dettagli</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Azione</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {activeOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag size={48} className="text-gray-200 mb-4"/>
                      <p className="text-lg font-medium">Nessun ordine attivo al momento.</p>
                      <p className="text-sm">Controlla lo storico per gli ordini passati.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatPickupTime(order.pickupTime)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-lg">{order.customerName}</span>
                        <span className="font-mono text-xs text-gray-500">#{order.orderNumber}</span>
                        <a href={`tel:${order.customerPhone}`} className="text-xs text-blue-500 hover:underline mt-1">
                          {order.customerPhone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-bold">{order.items.length} articoli</span>
                        <div className="text-xs text-gray-400 truncate max-w-[200px]">
                          {order.items.map(i => i.product?.name).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className={`
                          inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm
                          ${order.status === 'PENDING' 
                            ? 'bg-brand-blue text-white hover:bg-brand-blue-dark hover:shadow-md' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}
                        `}
                      >
                        {order.status === 'PENDING' ? (
                          <>Gestisci <Eye size={16} /></>
                        ) : (
                          <>Vedi <Eye size={16} /></>
                        )}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}