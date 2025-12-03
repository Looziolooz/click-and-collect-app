"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Printer, Check, Clock, User, Phone, AlertCircle } from 'lucide-react';

// Nota: params ora contiene 'orderId' invece di 'id'
export default function ManageOrderPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usiamo params.orderId nell'URL dell'API
    fetch(`/api/admin/orders/${params.orderId}`)
      .then(res => {
        if (!res.ok) throw new Error("Ordine non trovato");
        return res.json();
      })
      .then(data => {
        setOrder(data);
        // Se c'è già un prezzo finale salvato, usalo. Altrimenti usa quello stimato.
        setFinalPrice(data.finalTotal || data.estimatedTotal);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Impossibile trovare l'ordine specificato.");
        router.push('/admin/dashboard');
      });
  }, [params.orderId, router]);

  const handleUpdateOrder = async (newStatus: string) => {
    setSaving(true);
    try {
      // Usiamo params.orderId per la PUT
      const res = await fetch(`/api/admin/orders/${params.orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          finalTotal: parseFloat(finalPrice)
        })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        alert("✅ Ordine aggiornato con successo!");
      } else {
        throw new Error("Errore salvataggio");
      }
    } catch (e) {
      alert("❌ Errore durante l'aggiornamento. Riprova.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-brand-blue font-bold animate-pulse">
      Caricamento scheda ordine...
    </div>
  );

  if (!order) return null;

  return (
    <div className="min-h-screen bg-brand-offwhite p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Pulsante Indietro */}
        <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-brand-blue mb-6 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Torna alla Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          
          {/* Header Ordine */}
          <div className="bg-brand-blue p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold font-serif">Ordine #{order.orderNumber}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'COMPLETED' ? 'bg-green-500 text-white' : 
                  order.status === 'READY' ? 'bg-blue-400 text-white' : 
                  'bg-brand-yellow text-brand-blue'
                }`}>
                  {order.status === 'PENDING' ? 'DA PESARE' : order.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6 text-blue-100 text-sm mt-3">
                <span className="flex items-center gap-2"><User size={16} className="text-brand-yellow"/> {order.customerName}</span>
                <span className="flex items-center gap-2"><Phone size={16} className="text-brand-yellow"/> {order.customerPhone}</span>
                <span className="flex items-center gap-2"><Clock size={16} className="text-brand-yellow"/> Ritiro: {new Date(order.pickupTime).toLocaleString('it-IT')}</span>
              </div>
            </div>
            
            <div className="text-right bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="text-xs text-blue-200 uppercase tracking-wide mb-1">Totale Stimato</div>
              <div className="text-2xl font-bold font-serif text-brand-yellow">€ {Number(order.estimatedTotal).toFixed(2)}</div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLONNA SX: Lista Prodotti */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-brand-blue w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Lista da Preparare
              </h2>
              
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Pallino quantità */}
                      <div className="h-10 w-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {item.quantity}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{item.product?.name || "Prodotto rimosso"}</div>
                        <div className="text-sm text-gray-500 font-medium">{item.unit} x € {Number(item.price).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-gray-700 text-lg">
                        € {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note Cliente */}
              {order.specialNotes && (
                <div className="bg-yellow-50 p-6 rounded-xl border border-brand-yellow/30 text-yellow-900 mt-6 flex items-start gap-3">
                  <AlertCircle className="text-brand-yellow mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-blue-dark mb-1">Nota del Cliente:</strong> 
                    {order.specialNotes}
                  </div>
                </div>
              )}
            </div>

            {/* COLONNA DX: Azioni (La Bilancia) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-inner">
                <h2 className="text-xl font-bold text-gray-800 border-b border-blue-200 pb-4 flex items-center gap-2 mb-4">
                  <span className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Cassa & Peso
                </h2>

                <label className="block text-sm font-bold text-brand-blue mb-2 uppercase tracking-wide">
                  Totale Reale (€)
                </label>
                <div className="flex items-center bg-white rounded-xl border-2 border-brand-blue overflow-hidden shadow-sm focus-within:ring-4 ring-blue-100 transition-all">
                  <span className="pl-4 text-2xl text-gray-400 font-serif">€</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    className="w-full text-3xl font-bold text-gray-900 p-3 outline-none font-serif"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-tight">
                  Pesa la merce e inserisci qui il prezzo finale che il cliente dovrà pagare.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => handleUpdateOrder('READY')}
                  disabled={saving}
                  className="w-full bg-brand-blue hover:bg-brand-blue-light text-white py-4 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2 transition-all hover:-translate-y-1"
                >
                  <Save size={20} />
                  {saving ? 'Salvataggio...' : 'Conferma e Notifica'}
                </button>

                <button 
                  onClick={() => handleUpdateOrder('COMPLETED')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 transition-colors"
                >
                  <Check size={20} /> Segna come Pagato/Ritirato
                </button>

                <button 
                  onClick={() => window.print()}
                  className="w-full bg-white border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue transition-all flex justify-center items-center gap-2"
                >
                  <Printer size={20} /> Stampa Comanda
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}