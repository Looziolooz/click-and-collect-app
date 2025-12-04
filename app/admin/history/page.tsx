"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Eye, Search, Download, CalendarRange, XCircle, CheckCircle2, Filter } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unit: string;
  product?: { name: string };
  price: number; // Prezzo al kg/pezzo storico
}

interface HistoryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: string;
  pickupTime: string;
  finalTotal: number;
  estimatedTotal: number;
  items: OrderItem[];
  createdAt: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stati per i filtri
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'REJECTED'>('ALL');

  useEffect(() => {
    fetch('/api/admin/orders', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtriamo solo ciò che è "Storico" (Completato o Rifiutato)
          const history = data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'REJECTED');
          // Ordiniamo dal più recente
          history.sort((a, b) => new Date(b.pickupTime).getTime() - new Date(a.pickupTime).getTime());
          setOrders(history);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Logica di filtraggio efficiente (useMemo per evitare ricalcoli inutili)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Calcolo Totali (KPI)
  const totalRevenue = filteredOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (Number(curr.finalTotal) || 0), 0);

  // Funzione Export CSV (Quick & Dirty ma efficace per piccole moli di dati)
  const downloadCSV = () => {
    const headers = ["Data", "Ordine", "Cliente", "Stato", "Totale", "Articoli"];
    const rows = filteredOrders.map(o => [
      new Date(o.pickupTime).toLocaleDateString(),
      o.orderNumber,
      o.customerName,
      o.status,
      (o.finalTotal || o.estimatedTotal || 0).toFixed(2),
      o.items.map(i => `${i.quantity}${i.unit} ${i.product?.name}`).join(' | ')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `storico_ordini_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-400">
      <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full mb-4"></div>
      <p>Caricamento archivio...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header e KPI */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif flex items-center gap-3">
            <CalendarRange className="text-brand-blue" /> Storico Ordini
          </h1>
          <p className="text-gray-500 mt-2">Archivio completo delle transazioni concluse.</p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm text-right">
          <p className="text-xs text-gray-400 uppercase font-bold mb-1">Fatturato Periodo (Visualizzato)</p>
          <p className="text-2xl font-mono font-bold text-brand-blue-dark">€ {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Toolbar Strumenti */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Ricerca */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Cerca cliente o n. ordine..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtri e Azioni */}
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">Tutti gli stati</option>
            <option value="COMPLETED">✅ Completati</option>
            <option value="REJECTED">❌ Annullati</option>
          </select>

          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-brand-yellow/10 text-brand-blue-dark border border-brand-yellow hover:bg-brand-yellow hover:text-brand-blue px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ml-auto md:ml-0"
          >
            <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabella Dati */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data Ritiro</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Riferimento</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Importo Finale</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                    Nessun ordine trovato con i filtri attuali.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.pickupTime).toLocaleDateString('it-IT')}
                      <span className="block text-xs text-gray-400">{new Date(order.pickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.customerName}
                      <span className="block text-xs font-normal text-gray-500 truncate w-32" title={order.items.map(i => i.product?.name).join(', ')}>
                        {order.items.length} articoli...
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {order.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 size={12} className="mr-1" /> Completato
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle size={12} className="mr-1" /> Annullato
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {order.finalTotal ? (
                        <span className="text-gray-900 font-bold">€ {Number(order.finalTotal).toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400 italic line-through text-xs mr-2">€ {Number(order.estimatedTotal).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-brand-blue hover:text-brand-blue-light transition-colors">
                        <Eye size={18} />
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