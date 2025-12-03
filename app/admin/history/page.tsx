"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        // Mostra solo ordini completati o rifiutati
        if (Array.isArray(data)) {
          const completed = data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'REJECTED');
          setOrders(completed);
        }
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Caricamento storico...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 font-serif mb-8">Storico Ordini</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">N. Ordine</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stato</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Totale</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Azioni</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nessun ordine nello storico.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-mono font-bold">#{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4">
                  {order.status === 'COMPLETED' ? 
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><CheckCircle size={12}/> COMPLETATO</span> :
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><XCircle size={12}/> ANNULLATO</span>
                  }
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">€ {Number(order.finalTotal || order.estimatedTotal).toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline text-sm font-bold">
                    Vedi Dettagli
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