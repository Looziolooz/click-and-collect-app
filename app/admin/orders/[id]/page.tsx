"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Printer, Check } from 'lucide-react';

export default function ManageOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        // Se c'è già un prezzo finale, usalo, altrimenti usa quello stimato come base
        setFinalPrice(data.finalTotal || data.estimatedTotal);
      });
  }, [params.id]);

  const handleUpdateOrder = async (newStatus: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          finalTotal: parseFloat(finalPrice)
        })
      });
      
      if (res.ok) {
        alert("Ordine aggiornato con successo!");
        // Ricarica i dati
        const updated = await res.json();
        setOrder(updated);
      }
    } catch (e) {
      alert("Errore aggiornamento");
    } finally {
      setSaving(false);
    }
  };

  if (!order) return <div className="p-10">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigazione */}
        <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} className="mr-2" /> Torna alla lista
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Intestazione Ordine */}
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Ordine #{order.orderNumber}</h1>
              <p className="opacity-90">{order.customerName} - {order.customerPhone}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Stato Attuale</div>
              <div className="text-xl font-bold">{order.status}</div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Lista Prodotti */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Lista da Preparare</h2>
              
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                       {/* Placeholder img */}
                       <div className="w-full h-full bg-gray-300"></div> 
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.product.name}</div>
                      <div className="text-sm text-gray-500">Richiesti: {item.quantity} {item.unit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-gray-600">€ {item.price}/kg</div>
                  </div>
                </div>
              ))}

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                <strong>Nota Cliente:</strong> {order.specialNotes || "Nessuna nota specifica"}
              </div>
            </div>

            {/* Pannello Azioni (La Bilancia) */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-gray-100 p-6 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  TOTALE REALE (€)
                </label>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">€</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    className="w-full text-3xl font-bold bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Inserisci qui il prezzo finale dopo aver pesato la merce.
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleUpdateOrder('READY')}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold shadow-md flex justify-center items-center gap-2"
                >
                  <Save size={20} />
                  {saving ? 'Salvataggio...' : 'Conferma e Notifica Cliente'}
                </button>

                <button 
                  onClick={() => handleUpdateOrder('COMPLETED')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md flex justify-center items-center gap-2"
                >
                  <Check size={20} /> Segna come Ritirato (Pagato)
                </button>

                <button 
                  onClick={() => window.print()}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 flex justify-center items-center gap-2"
                >
                  <Printer size={20} /> Stampa Ordine
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}