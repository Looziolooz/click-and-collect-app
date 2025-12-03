// app/admin/history/page.tsx
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, CheckCircle } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        // Filtra solo quelli completati
        const completed = data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'REJECTED');
        setOrders(completed);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Caricamento storico...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 font-serif mb-8">Storico Ordini</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">N. Ordine</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Totale Pagato</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Dettagli</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-mono font-bold">#{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4 font-bold text-green-600">€ {Number(order.finalTotal).toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline flex items-center justify-end gap-1">
                    <Eye size={16}/> Vedi
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}