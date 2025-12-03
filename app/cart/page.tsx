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
  
  // STATI
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', slotId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  
  // CALENDARIO
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  
  // SLOT
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Generazione Giorni (Esclusi Dom/Lun)
  useEffect(() => {
    const days = [];
    const today = new Date();
    // Iniziamo da domani (i=1) per evitare problemi con slot passati di oggi
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 1) { // 0=Dom, 1=Lun
        days.push(date);
      }
    }
    setAvailableDays(days);
  }, []);

  // 2. Caricamento Slot quando cambia la data
  useEffect(() => {
    if (!selectedDate) return;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSlots([]);
      setFormData(prev => ({ ...prev, slotId: '' })); // Reset orario
      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          setSlots(data);
        } else {
          console.error("Errore fetch slots");
        }
      } catch (e) {
        console.error("Eccezione fetch slots", e);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate]);

  // VALIDAZIONE
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name': 
        if (value.trim().length < 3) return "Inserisci nome e cognome validi"; 
        break;
      case 'phone': 
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber.length < 9) return "Numero non valido (min 9 cifre)"; 
        break;
      case 'email': 
        // Regex email semplice ma efficace
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email non valida"; 
        break;
      case 'slotId': 
        if (!value) return "Devi selezionare un orario"; 
        break;
    }
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  // CHECKOUT
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione Finale
    const newErrors: FormErrors = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) { newErrors[key] = error; isValid = false; }
    });
    
    if (!selectedDate) { newErrors.date = "Seleziona una data di ritiro"; isValid = false; }
    if (!formData.slotId) { newErrors.slotId = "Seleziona un orario"; isValid = false; }

    setErrors(newErrors);
    
    if (!isValid) {
      alert("Per favore correggi gli errori evidenziati in rosso.");
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

      const data = await response.json();

      if (!response.ok) {
        // Gestione errore "Carrello Vecchio"
        if (data.error && data.error.includes("prodotti non più esistenti")) {
            alert("⚠️ Il tuo carrello contiene prodotti scaduti o non validi. Il carrello verrà svuotato per sicurezza.");
            cart.clearCart();
            router.push('/products');
            return;
        }
        throw new Error(data.error || "Errore sconosciuto dal server");
      }

      // Successo!
      cart.clearCart();
      router.push('/booking/success');

    } catch (error: any) {
      console.error("ERRORE CHECKOUT:", error);
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
        <button onClick={() => router.push('/products')} className="mt-4 bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-blue-dark transition-colors shadow-lg">
          Torna al catalogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-brand-offwhite min-h-screen">
      
      {/* RIEPILOGO A SINISTRA (Sticky) */}
      <div className="lg:col-span-4 order-2 lg:order-1">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 sticky top-28">
          <div className="bg-brand-blue p-5 text-white">
            <h2 className="font-bold text-xl flex items-center gap-3 font-serif">
              <ShoppingCart size={24} className="text-brand-yellow" /> Riepilogo Ordine
            </h2>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto p-2 bg-white">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors rounded-lg">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500">€{item.pricePerKg.toFixed(2)} / {item.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block font-bold bg-blue-100 text-brand-blue px-2 py-0.5 rounded text-xs">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="block font-bold text-brand-blue text-sm mt-1">
                      €{(item.pricePerKg * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button onClick={() => cart.removeItem(item.id)} className="text-gray-400 hover:text-brand-red p-2 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-brand-blue-dark text-white">
            <div className="flex justify-between items-center mb-1">
              <span className="text-blue-200 text-lg">Totale Stimato:</span>
              <span className="text-3xl font-bold text-brand-yellow font-serif">€ {cart.totalEstimated().toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-blue-300 opacity-80 text-right leading-tight">
              * Il prezzo finale sarà calcolato al peso esatto in negozio.
            </p>
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

          {/* SEZIONE 1: DATI */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif">
              <span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">1</span> 
              I Tuoi Dati
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nome e Cognome *</label>
                <input 
                  type="text" placeholder="Mario Rossi" 
                  className={`w-full p-3.5 border rounded-xl focus:ring-2 outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-brand-blue focus:ring-brand-blue/20'}`}
                  value={formData.name} onChange={e => handleInputChange('name', e.target.value)} 
                />
                {errors.name && <p className="text-brand-red text-xs font-bold mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Telefono Cellulare *</label>
                <input 
                  type="tel" placeholder="333 1234567" 
                  className={`w-full p-3.5 border rounded-xl focus:ring-2 outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-brand-blue focus:ring-brand-blue/20'}`}
                  value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} 
                />
                {errors.phone && <p className="text-brand-red text-xs font-bold mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.phone}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Email *</label>
                <input 
                  type="email" placeholder="mario@esempio.com" 
                  className={`w-full p-3.5 border rounded-xl focus:ring-2 outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-brand-blue focus:ring-brand-blue/20'}`}
                  value={formData.email} onChange={e => handleInputChange('email', e.target.value)} 
                />
                {errors.email && <p className="text-brand-red text-xs font-bold mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.email}</p>}
              </div>
            </div>
          </section>

          {/* SEZIONE 2: SCELTA DATA */}
          <section className="space-y-6 pt-6 border-t border-gray-100">
            <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif">
              <span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">2</span> 
              Scegli il Giorno
            </h3>
            
            {errors.date && <p className="text-brand-red bg-red-50 p-3 rounded-lg font-bold flex items-center"><AlertCircle className="mr-2"/>{errors.date}</p>}

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {availableDays.map((date) => {
                const dateString = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateString;
                return (
                  <button
                    key={dateString} type="button" onClick={() => setSelectedDate(dateString)}
                    className={`
                      flex-shrink-0 snap-start w-28 h-28 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 group
                      ${isSelected 
                        ? 'border-brand-blue bg-brand-blue text-white shadow-lg scale-105 ring-4 ring-brand-blue/20' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/50 hover:bg-blue-50'}
                    `}
                  >
                    <span className={`text-xs uppercase font-bold tracking-wider ${isSelected ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-brand-blue'}`}>
                      {date.toLocaleDateString('it-IT', { weekday: 'short' })}
                    </span>
                    <span className="text-3xl font-bold font-serif my-1">{date.getDate()}</span>
                    <span className="text-sm font-medium">{date.toLocaleDateString('it-IT', { month: 'short' })}</span>
                    {isSelected && <CheckCircle size={18} className="mt-1 text-brand-yellow animate-in zoom-in" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SEZIONE 3: ORARIO */}
          <section className="space-y-6 pt-6 border-t border-gray-100 min-h-[100px]">
             <h3 className="text-xl font-bold text-brand-blue flex items-center gap-3 font-serif">
              <span className="bg-brand-blue text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">3</span> 
              Scegli l'Orario
            </h3>

            {!selectedDate && <p className="text-gray-400 italic ml-11 flex items-center"><Clock size={16} className="mr-2"/> Seleziona prima un giorno dal calendario...</p>}

            {selectedDate && (
              <div className="ml-0 md:ml-11 animate-in fade-in slide-in-from-top-2">
                {loadingSlots ? (
                  <div className="flex items-center space-x-3 text-brand-blue py-4 font-medium">
                    <Clock className="animate-spin" /> <span>Verifica disponibilità orari...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl flex items-center gap-3 border border-yellow-100">
                    <AlertCircle className="text-yellow-600" size={24} />
                    <div><p className="font-bold text-lg">Nessun orario disponibile.</p><p className="text-sm opacity-80">Prova un altro giorno o chiamaci.</p></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {slots.map((slot) => {
                        const timeString = new Date(slot.startTime).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
                        const isSelected = formData.slotId === slot.id;
                        return (
                          <button
                            key={slot.id} type="button" onClick={() => handleInputChange('slotId', slot.id)}
                            className={`
                              py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all duration-200 shadow-sm
                              ${isSelected 
                                ? 'bg-brand-blue-dark text-brand-yellow border-brand-blue-dark shadow-md transform scale-105 ring-2 ring-brand-yellow' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-brand-blue hover:text-brand-blue hover:shadow'}
                            `}
                          >
                            {timeString}
                          </button>
                        );
                      })}
                    </div>
                    {errors.slotId && <p className="text-brand-red text-sm mt-3 font-bold flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.slotId}</p>}
                  </>
                )}
              </div>
            )}
          </section>

          {/* BOTTONE FINALE */}
          <div className="pt-8 mt-8 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`
                w-full py-4.5 rounded-xl font-bold text-xl shadow-lg flex justify-center items-center gap-3 transition-all duration-300 font-serif tracking-wide
                ${isSubmitting 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-brand-yellow text-brand-blue-dark hover:bg-[#ffd700] hover:shadow-xl hover:-translate-y-1 ring-4 ring-transparent hover:ring-brand-yellow/30'}
              `}
            >
              {isSubmitting ? <><Clock className="animate-spin"/> Elaborazione...</> : <><CheckCircle strokeWidth={2.5} /> CONFERMA ORDINE (Paga al ritiro)</>}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Cliccando confermi di aver letto la Privacy Policy. Il pagamento avverrà esclusivamente in negozio.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}