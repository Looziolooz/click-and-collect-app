"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Trash2, ShoppingCart, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormData { name: string; email: string; phone: string; slotId: string; }
interface FormErrors { name?: string; email?: string; phone?: string; slotId?: string; date?: string; }
interface TimeSlot { id: string; startTime: string; }

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', slotId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Calendario
  useEffect(() => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 1) days.push(date);
    }
    setAvailableDays(days);
  }, []);

  // 2. Slot
  useEffect(() => {
    if (!selectedDate) return;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSlots([]);
      setFormData(prev => ({ ...prev, slotId: '' }));
      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          setSlots(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate]);

  const validateField = (name: keyof FormData, value: string) => {
    if (!value) return "Campo obbligatorio";
    switch (name) {
      case 'name': if (value.length < 3) return "Nome troppo corto"; break;
      case 'phone': if (value.replace(/\D/g, '').length < 9) return "Numero non valido"; break;
      case 'email': if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email non valida"; break;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione Rapida
    if (!selectedDate || !formData.slotId || !formData.name || !formData.phone) {
      alert("Compila tutti i campi e seleziona una data/orario.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          storeId: 'auto_select', 
          items: cart.items, 
          estimatedTotal: cart.totalEstimated() 
        })
      });

      // --- PROTEZIONE JSON ---
      // Leggiamo la risposta come testo per evitare il crash "Unexpected end of JSON"
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        console.error("Risposta non valida dal server:", textResponse);
        throw new Error("Il server ha risposto in modo anomalo. Riprova più tardi.");
      }

      if (!response.ok) {
        // Gestione errore specifico "Prodotti Vecchi"
        if (data.error && data.error.includes("prodotti obsoleti")) {
            alert("⚠️ Il carrello conteneva prodotti non più disponibili. È stato svuotato. Per favore riprova.");
            cart.clearCart();
            router.push('/products');
            return;
        }
        throw new Error(data.error || "Errore sconosciuto");
      }

      // Successo
      cart.clearCart();
      router.push('/booking/success');

    } catch (error: any) {
      console.error("ERRORE:", error);
      alert(`Si è verificato un errore: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 bg-brand-offwhite">
        <ShoppingCart size={64} className="mb-4 text-brand-blue opacity-20" />
        <h2 className="text-2xl font-bold font-serif mb-2 text-brand-blue-dark">Il carrello è vuoto</h2>
        <button onClick={() => router.push('/products')} className="mt-4 bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-blue-dark transition-colors">
          Torna al catalogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-brand-offwhite min-h-screen">
      <div className="lg:col-span-4 order-2 lg:order-1">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 sticky top-28">
          <div className="bg-brand-blue p-5 text-white">
            <h2 className="font-bold text-xl flex items-center gap-3 font-serif"><ShoppingCart /> Riepilogo</h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2 bg-white">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-50">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500">€{item.pricePerKg.toFixed(2)} / {item.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono bg-blue-50 text-brand-blue px-2 py-0.5 rounded text-xs font-bold">{item.quantity} {item.unit}</span>
                  <span className="font-bold text-brand-blue text-sm">€{(item.pricePerKg * item.quantity).toFixed(2)}</span>
                  <button onClick={() => cart.removeItem(item.id)} className="text-gray-400 hover:text-brand-red"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-brand-blue-dark text-white">
            <div className="flex justify-between items-center"><span className="text-blue-200">Totale:</span><span className="text-2xl font-bold font-serif">€ {cart.totalEstimated().toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 order-1 lg:order-2">
        <form onSubmit={handleCheckout} className="bg-white p-8 md:p-10 shadow-xl rounded-2xl border border-gray-100 space-y-10">
          <div className="border-b border-gray-100 pb-6"><h1 className="text-4xl font-bold text-brand-blue-dark font-serif">Conferma Ritiro</h1></div>
          
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif"><span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span> I Tuoi Dati</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Nome *" className="w-full p-3.5 border rounded-xl" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
              <input type="tel" placeholder="Telefono *" className="w-full p-3.5 border rounded-xl" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
              <input type="email" placeholder="Email *" className="w-full p-3.5 border rounded-xl md:col-span-2" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
            </div>
          </section>

          <section className="space-y-6 pt-6 border-t border-gray-100">
            <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif"><span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span> Giorno</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {availableDays.map((date) => {
                const dStr = date.toISOString().split('T')[0];
                return (
                  <button key={dStr} type="button" onClick={() => setSelectedDate(dStr)} className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedDate === dStr ? 'border-brand-blue bg-brand-blue text-white' : 'border-gray-200'}`}>
                    <span className="text-2xl font-bold font-serif">{date.getDate()}</span>
                    <span className="text-xs uppercase">{date.toLocaleDateString('it-IT', { weekday: 'short' })}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {selectedDate && (
            <section className="space-y-6 pt-6 border-t border-gray-100 animate-in fade-in">
              <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif"><span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span> Orario</h3>
              {loadingSlots ? <div>Caricamento...</div> : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {slots.map((s) => (
                    <button key={s.id} type="button" onClick={() => handleInputChange('slotId', s.id)} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${formData.slotId === s.id ? 'bg-brand-yellow text-brand-blue border-brand-blue' : 'border-gray-200'}`}>
                      {new Date(s.startTime).toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="pt-8 mt-8 border-t border-gray-100">
            <button type="submit" disabled={isSubmitting} className="w-full py-4.5 rounded-xl font-bold text-xl shadow-lg bg-brand-yellow text-brand-blue-dark hover:bg-yellow-400 transition-all flex justify-center items-center gap-2">
              {isSubmitting ? "Attendi..." : <><CheckCircle /> CONFERMA ORDINE</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}