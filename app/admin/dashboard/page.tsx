"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Tipi (semplificati per il frontend)
interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  pickupTime: string;
  estimatedTotal: number;
  finalTotal?: number;
  items: any[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">DA PESARE</span>;
      case 'READY': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">PRONTO</span>;
      case 'COMPLETED': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">RITIRATO</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">UNKNOWN</span>;
    }
  };

  if (loading) return <div className="p-10 text-center">Caricamento ordini...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ordini</h1>
          <div className="bg-white px-4 py-2 rounded shadow text-sm">
            Ordini Totali: <strong>{orders.length}</strong>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N. Ordine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ritiro Previsto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totale (Stimato)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.items.length} prodotti</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.pickupTime).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
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
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-2 rounded-md flex items-center justify-end gap-2 ml-auto w-fit"
                    >
                      <Eye size={16} /> Gestisci
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}