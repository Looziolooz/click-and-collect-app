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

  // 1. Generazione Giorni
  useEffect(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 1) { // Escludi Dom/Lun
        days.push(date);
      }
    }
    setAvailableDays(days);
  }, []);

  // 2. Caricamento Slot
  useEffect(() => {
    if (!selectedDate) return;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSlots([]);
      setFormData(prev => ({ ...prev, slotId: '' }));
      try {
        console.log("Fetching slots for:", selectedDate);
        const res = await fetch(`/api/slots?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          setSlots(data);
        } else {
          console.error("Errore fetch slots:", await res.text());
        }
      } catch (e) {
        console.error("Eccezione fetch slots:", e);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate]);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    if (!value) return "Campo obbligatorio"; // Check base per evitare crash su trim()
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
    console.log("Tentativo invio ordine...");

    // Validazione
    const newErrors: FormErrors = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) { newErrors[key] = error; isValid = false; }
    });
    
    if (!selectedDate) { newErrors.date = "Seleziona una data"; isValid = false; }
    if (!formData.slotId) { newErrors.slotId = "Seleziona un orario"; isValid = false; }

    setErrors(newErrors);
    
    if (!isValid) {
      console.log("Validazione fallita:", newErrors);
      alert("Compila tutti i campi obbligatori (seganti in rosso).");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Invio dati al server...");
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

      console.log("Risposta server:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Errore Server: ${errText}`);
      }

      console.log("Ordine successo!");
      cart.clearCart();
      router.push('/booking/success');

    } catch (error) {
      console.error("Errore CATCH:", error);
      alert("Si è verificato un errore tecnico. Controlla la console (F12) per dettagli.");
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
      
      {/* RIEPILOGO A SINISTRA */}
      <div className="lg:col-span-4 order-2 lg:order-1">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-blue-100 sticky top-28">
          <div className="bg-brand-blue p-4 text-white">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingCart size={20} className="text-brand-yellow" /> Riepilogo Ordine
            </h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto bg-white">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-50">
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
          </div>
        </div>
      </div>

      {/* FORM A DESTRA */}
      <div className="lg:col-span-8 order-1 lg:order-2">
        <form onSubmit={handleCheckout} className="bg-white p-8 md:p-10 shadow-xl rounded-2xl border border-gray-100 space-y-10">
          <div className="border-b border-gray-100 pb-6">
            <h1 className="text-4xl font-bold text-brand-blue-dark font-serif mb-2">Conferma Ritiro</h1>
            <p className="text-gray-600 text-lg">Completa i dati per prenotare il tuo pesce fresco.</p>
          </div>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif">
              <span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">1</span> I Tuoi Dati
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nome e Cognome *</label>
                <input type="text" className={`w-full p-3.5 border rounded-xl outline-none ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                {errors.name && <p className="text-brand-red text-xs font-bold">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Telefono *</label>
                <input type="tel" className={`w-full p-3.5 border rounded-xl outline-none ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                {errors.phone && <p className="text-brand-red text-xs font-bold">{errors.phone}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Email *</label>
                <input type="email" className={`w-full p-3.5 border rounded-xl outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                {errors.email && <p className="text-brand-red text-xs font-bold">{errors.email}</p>}
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-6 border-t border-gray-100">
            <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif">
              <span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">2</span> Scegli Giorno
            </h3>
            {errors.date && <p className="text-brand-red font-bold text-sm bg-red-50 p-2 rounded">{errors.date}</p>}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {availableDays.map((date) => {
                const dateString = date.toISOString().split('T')[0];
                return (
                  <button key={dateString} type="button" onClick={() => setSelectedDate(dateString)} className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedDate === dateString ? 'border-brand-blue bg-brand-blue text-white scale-105' : 'border-gray-200 bg-white text-gray-600'}`}>
                    <span className="text-xs uppercase font-bold">{date.toLocaleDateString('it-IT', { weekday: 'short' })}</span>
                    <span className="text-2xl font-bold font-serif">{date.getDate()}</span>
                    <span className="text-xs">{date.toLocaleDateString('it-IT', { month: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedDate && (
            <section className="space-y-6 pt-6 border-t border-gray-100 animate-in fade-in">
              <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif">
                <span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">3</span> Scegli Orario
              </h3>
              {loadingSlots ? <div className="text-brand-blue animate-pulse">Caricamento orari...</div> : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {slots.length === 0 ? <p className="col-span-full text-gray-500">Nessun orario per questa data.</p> : slots.map((slot) => {
                    const timeString = new Date(slot.startTime).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
                    return (
                      <button key={slot.id} type="button" onClick={() => handleInputChange('slotId', slot.id)} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${formData.slotId === slot.id ? 'bg-brand-yellow text-brand-blue border-brand-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue'}`}>
                        {timeString}
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.slotId && <p className="text-brand-red text-sm font-bold">{errors.slotId}</p>}
            </section>
          )}

          <div className="pt-8 mt-8 border-t border-gray-100">
            <button type="submit" disabled={isSubmitting} className={`w-full py-4.5 rounded-xl font-bold text-xl shadow-lg flex justify-center items-center gap-3 transition-all ${isSubmitting ? 'bg-gray-300' : 'bg-brand-yellow text-brand-blue-dark hover:bg-yellow-400 hover:-translate-y-1'}`}>
              {isSubmitting ? "Elaborazione..." : <><CheckCircle /> CONFERMA ORDINE</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}