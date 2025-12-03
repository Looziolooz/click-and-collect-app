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

  useEffect(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        days.push(date);
      }
    }
    setAvailableDays(days);
  }, []);

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

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name': if (value.trim().length < 3) return "Inserisci un nome valido"; break;
      case 'phone': 
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber.length < 9) return "Numero non valido"; 
        break;
      case 'email': 
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email non valida"; 
        break;
      case 'slotId': if (!value) return "Seleziona un orario"; break;
    }
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) { newErrors[key] = error; isValid = false; }
    });
    if (!selectedDate) { newErrors.date = "Seleziona una data"; isValid = false; }
    setErrors(newErrors);
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, storeId: 'auto_select', items: cart.items, estimatedTotal: cart.totalEstimated() })
      });
      if (!response.ok) throw new Error("Errore");
      cart.clearCart();
      router.push('/booking/success');
    } catch (error) {
      alert("Errore tecnico. Controlla che il DB sia popolato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 bg-brand-offwhite">
        <ShoppingCart size={64} className="mb-4 text-brand-blue opacity-20" />
        <h2 className="text-2xl font-bold font-serif mb-2 text-brand-blue">Il carrello è vuoto</h2>
        <button onClick={() => router.push('/products')} className="mt-4 bg-brand-blue text-white px-6 py-2 rounded-full font-bold hover:bg-brand-blue-dark transition-colors">
          Torna al catalogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-brand-offwhite min-h-screen">
      <div className="lg:col-span-4 order-2 lg:order-1">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-blue-100 sticky top-24">
          <div className="bg-brand-blue p-4 text-white">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingCart size={20} className="text-brand-yellow" /> Riepilogo Ordine
            </h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto bg-white">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-100">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">€{item.pricePerKg.toFixed(2)} / {item.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono bg-blue-50 text-brand-blue px-2 py-0.5 rounded text-xs font-bold">{item.quantity} {item.unit}</span>
                  <span className="font-bold text-brand-blue text-sm">€{(item.pricePerKg * item.quantity).toFixed(2)}</span>
                  <button onClick={() => cart.removeItem(item.id)} className="text-gray-400 hover:text-brand-red"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-brand-blue-dark text-white border-t border-blue-900">
            <div className="flex justify-between items-center mb-1">
              <span className="text-blue-200 text-sm">Totale Stimato:</span>
              <span className="text-2xl font-bold text-brand-yellow font-serif">€ {cart.totalEstimated().toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-blue-300 text-right">* Il prezzo finale sarà al peso reale.</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 order-1 lg:order-2">
        <form onSubmit={handleCheckout} className="bg-white p-8 shadow-xl rounded-xl border border-gray-100 space-y-8">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-3xl font-bold text-brand-blue font-serif">Conferma Ritiro</h1>
            <p className="text-gray-500 text-sm">Completa i dati per prenotare il tuo pescato.</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span> I Tuoi Dati
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nome e Cognome *" className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-brand-blue focus:ring-blue-100'}`} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
              <input type="tel" placeholder="Telefono *" className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-brand-blue focus:ring-blue-100'}`} value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
              <input type="email" placeholder="Email *" className={`w-full p-3 border rounded-lg focus:ring-2 outline-none md:col-span-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-brand-blue focus:ring-blue-100'}`} value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span> Giorno di Ritiro
            </h3>
            {errors.date && <p className="text-brand-red text-sm font-bold">{errors.date}</p>}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {availableDays.map((date) => {
                const dateString = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateString;
                return (
                  <button key={dateString} type="button" onClick={() => setSelectedDate(dateString)} className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-md scale-105' : 'border-gray-200 bg-white text-gray-500 hover:border-brand-blue/50'}`}>
                    <span className="text-xs uppercase font-bold">{date.toLocaleDateString('it-IT', { weekday: 'short' })}</span>
                    <span className="text-2xl font-bold font-serif">{date.getDate()}</span>
                    <span className="text-xs">{date.toLocaleDateString('it-IT', { month: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedDate && (
            <section className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span> Orario
              </h3>
              {loadingSlots ? <div className="text-brand-blue font-medium animate-pulse">Caricamento orari...</div> : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {slots.map((slot) => {
                    const timeString = new Date(slot.startTime).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
                    return (
                      <button key={slot.id} type="button" onClick={() => handleInputChange('slotId', slot.id)} className={`py-2 px-1 rounded-lg text-sm font-bold border transition-all ${formData.slotId === slot.id ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue'}`}>
                        {timeString}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all ${isSubmitting ? 'bg-gray-300 text-gray-500' : 'bg-brand-yellow text-brand-blue-dark hover:bg-yellow-400 hover:scale-[1.01]'}`}>
              {isSubmitting ? "Elaborazione..." : <><CheckCircle /> CONFERMA (Paga al Ritiro)</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}