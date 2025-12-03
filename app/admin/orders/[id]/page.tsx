"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Printer, Check, Calculator } from 'lucide-react';

export default function ManageOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]); // Stato locale per gli items modificabili
  const [finalPrice, setFinalPrice] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setOrderItems(data.items); // Inizializza gli items modificabili
        setFinalPrice(data.finalTotal ? String(data.finalTotal) : String(data.estimatedTotal));
      })
      .catch((err) => console.error(err));
  }, [params.id]);

  // Funzione per cambiare il prezzo totale di una riga (es. il pesce pesato costa X)
  const handleItemPriceChange = (itemId: string, newTotalRowPrice: string) => {
    const updatedItems = orderItems.map(item => {
      if (item.id === itemId) {
        // Calcoliamo il "prezzo unitario" al contrario se necessario, 
        // ma per semplicità qui salviamo il prezzo totale della riga nel campo 'price' 
        // (o modifichiamo la logica per salvare quantità reale e prezzo al kg).
        // PER SEMPLICITÀ: Immaginiamo che tu inserisca il prezzo FINALE di quel pezzo di pesce.
        return { ...item, price: parseFloat(newTotalRowPrice) || 0, quantity: 1, unit: 'pz' }; 
        // Nota: Questo sovrascrive la logica peso x prezzo per diventare "Prezzo a corpo" per quel pezzo pesato.
      }
      return item;
    });
    
    setOrderItems(updatedItems);
    
    // Ricalcola il totale generale automaticamente
    const newTotal = updatedItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    setFinalPrice(newTotal.toFixed(2));
  };

  const handleUpdateOrder = async (newStatus: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          finalTotal: parseFloat(finalPrice),
          items: orderItems // Inviamo gli items modificati
        })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        setOrderItems(updated.items);
        alert("✅ Ordine e prezzi aggiornati!");
      }
    } catch (e) {
      alert("Errore salvataggio");
    } finally {
      setSaving(false);
    }
  };

  if (!order) return <div className="p-8">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-brand-offwhite p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Intestazione */}
        <div className="flex items-center justify-between mb-6">
           <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-brand-blue">
            <ArrowLeft size={20} className="mr-2" /> Torna indietro
          </button>
          <h1 className="text-2xl font-bold font-serif text-brand-blue-dark">Gestione Ordine #{order.orderNumber}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lista Prodotti Modificabile */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator size={20} className="text-brand-blue"/> Pesatura e Prezzi
            </h2>
            
            <div className="space-y-4">
              {orderItems.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50/50 p-4 rounded-lg border border-blue-100 gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{item.product?.name || "Prodotto"}</div>
                    <div className="text-xs text-gray-500">
                      Stimato: {item.quantity} {item.unit} a €{item.price}/kg
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase text-gray-500">Prezzo Reale:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-serif">€</span>
                      {/* Qui l'admin inserisce il prezzo finale del pezzo pesato */}
                      <input 
                        type="number" 
                        step="0.01"
                        defaultValue={(item.price * item.quantity).toFixed(2)} // Valore iniziale
                        onBlur={(e) => handleItemPriceChange(item.id, e.target.value)} // Aggiorna al cambio focus
                        className="w-32 p-2 pl-7 rounded-md border border-gray-300 font-bold text-right text-gray-900 focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totale e Azioni */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-brand-blue text-white p-6 rounded-xl shadow-lg">
              <div className="text-sm text-blue-200 uppercase mb-1">Totale da Pagare</div>
              <div className="text-4xl font-bold font-serif mb-6">€ {finalPrice}</div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleUpdateOrder('READY')}
                  disabled={saving}
                  className="w-full bg-brand-yellow text-brand-blue hover:bg-white py-3 rounded-lg font-bold shadow transition-all flex justify-center gap-2"
                >
                  <Save size={18} /> {saving ? 'Salvataggio...' : 'Salva e Conferma'}
                </button>
                <button 
                  onClick={() => handleUpdateOrder('COMPLETED')}
                  className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold shadow transition-all flex justify-center gap-2"
                >
                  <Check size={18} /> Ordine Ritirato
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium text-sm flex justify-center gap-2"
                >
                  <Printer size={16} /> Stampa
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}