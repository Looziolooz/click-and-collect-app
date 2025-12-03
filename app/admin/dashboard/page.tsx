"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Clock, ShoppingBag } from 'lucide-react';

// Interfaccia per i dati che arrivano dall'API
interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  pickupTime: string; // Arriva come stringa ISO
  estimatedTotal: number;
  finalTotal?: number;
  items: any[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Chiamata all'API che abbiamo appena creato
    fetch('/api/admin/orders')
      .then(async (res) => {
        if (!res.ok) throw new Error("Errore di connessione al server");
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossibile caricare gli ordini.");
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">DA PESARE</span>;
      case 'READY': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">PRONTO</span>;
      case 'COMPLETED': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">RITIRATO</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">UNKNOWN</span>;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Caricamento ordini...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
      <p>⚠️ {error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Dashboard Ordini</h1>
          <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 text-sm flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-600"/>
            Ordini Totali: <strong className="text-lg">{orders.length}</strong>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">N. Ordine</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ritiro Previsto</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stato</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Totale</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600 font-bold">#{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.items.length} prodotti</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-400"/>
                        {new Date(order.pickupTime).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {order.finalTotal ? (
                        <span className="text-green-600">€ {Number(order.finalTotal).toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400 italic">~ € {Number(order.estimatedTotal).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center justify-end gap-2 ml-auto w-fit transition-colors font-bold"
                      >
                        <Eye size={18} /> Gestisci
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              Nessun ordine presente nel sistema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}