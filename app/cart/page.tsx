"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Trash2, ShoppingCart, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Tipi per i dati e gli errori
interface FormData {
  name: string;
  email: string;
  phone: string;
  slotId: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  slotId?: string;
  date?: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
}

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  
  // --- STATI ---
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', slotId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Gestione Calendario
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  
  // Gestione Slot
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. All'avvio: Genera i giorni disponibili (Escludi Dom/Lun)
  useEffect(() => {
    const days = [];
    const today = new Date();
    
    // Genera i prossimi 14 giorni
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay(); // 0 = Dom, 1 = Lun
      
      // SALTA Domenica (0) e Lunedì (1)
      if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        days.push(date);
      }
    }
    setAvailableDays(days);
  }, []);

  // 2. Quando cambia la data selezionata: Carica gli orari
  useEffect(() => {
    if (!selectedDate) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSlots([]); // Reset slot precedenti
      setFormData(prev => ({ ...prev, slotId: '' })); // Reset selezione orario

      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          setSlots(data);
        }
      } catch (e) {
        console.error("Errore fetch slot", e);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate]);

  // --- VALIDAZIONE FERREA ---
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (value.trim().length < 3) return "Inserisci nome e cognome validi";
        break;
      case 'phone':
        // Regex per cellulari italiani (accetta spazi, +, 3xx)
        const phoneRegex = /^(\+39|0039)?\s?3\d{2}\s?\d{6,7}$/;
        // Accettiamo anche numeri fissi per sicurezza, basta che siano almeno 9 cifre numeriche
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber.length < 9 || cleanNumber.length > 15) return "Numero di telefono non valido";
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Inserisci un'email valida";
        break;
      case 'slotId':
        if (!value) return "Devi selezionare un orario";
        break;
    }
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Valida in tempo reale mentre scrivi
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione Finale su tutto il form
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    if (!selectedDate) {
      newErrors.date = "Seleziona una data di ritiro";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      alert("Per favore correggi gli errori in rosso prima di procedere.");
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

      if (!response.ok) throw new Error("Errore ordine");

      cart.clearCart();
      router.push('/booking/success');

   } catch (error) {
      console.error(error);
      // Feedback più specifico
      alert("Errore durante l'invio dell'ordine. Controlla la console per dettagli o riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funzioni di utilità per formattazione
  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getIsoDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-charcoal-light bg-gray-50">
        <ShoppingCart size={64} className="mb-4 text-sage opacity-50" />
        <h2 className="text-2xl font-bold font-serif mb-2 text-charcoal">Il tuo carrello è vuoto</h2>
        <p className="mb-6">Aggiungi del pesce fresco per procedere.</p>
        <button onClick={() => router.push('/products')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          Torna al catalogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-gray-50 min-h-screen">
      
      {/* COLONNA SX: Riepilogo Ordine (4 colonne su 12) */}
      <div className="lg:col-span-4 order-2 lg:order-1">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 sticky top-24">
          <div className="bg-charcoal p-4 text-white">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingCart size={20} /> Riepilogo Ordine
            </h2>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">€{item.pricePerKg.toFixed(2)} / {item.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="block font-bold text-blue-600 text-sm mt-1">
                      €{(item.pricePerKg * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button onClick={() => cart.removeItem(item.id)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-blue-50 border-t border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-800 font-medium text-sm">Totale Stimato:</span>
              <span className="text-2xl font-bold text-blue-700 font-serif">€ {cart.totalEstimated().toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-blue-600/80 leading-tight">
              * Il prezzo finale viene calcolato al momento della pesatura in negozio e potrebbe variare leggermente.
            </p>
          </div>
        </div>
      </div>

      {/* COLONNA DX: Modulo Dati (8 colonne su 12) */}
      <div className="lg:col-span-8 order-1 lg:order-2">
        <form onSubmit={handleCheckout} className="bg-white p-8 shadow-xl rounded-xl border border-gray-100 space-y-8 relative">
          
          <div className="border-b pb-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Conferma Ritiro</h1>
            <p className="text-gray-500 mt-1">Compila i dati per prenotare il tuo pescato.</p>
          </div>

          {/* SEZIONE 1: DATI CLIENTE */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
              <span className="bg-sage text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              I Tuoi Dati
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Nome e Cognome *</label>
                <input 
                  type="text" 
                  placeholder="Mario Rossi" 
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-sage focus:ring-sage/30'}`}
                  value={formData.name} 
                  onChange={e => handleInputChange('name', e.target.value)} 
                />
                {errors.name && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> {errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Telefono Cellulare *</label>
                <input 
                  type="tel" 
                  placeholder="333 1234567" 
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-sage focus:ring-sage/30'}`}
                  value={formData.phone} 
                  onChange={e => handleInputChange('phone', e.target.value)} 
                />
                {errors.phone && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> {errors.phone}</p>}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Email *</label>
                <input 
                  type="email" 
                  placeholder="mario@esempio.com" 
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-sage focus:ring-sage/30'}`}
                  value={formData.email} 
                  onChange={e => handleInputChange('email', e.target.value)} 
                />
                {errors.email && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> {errors.email}</p>}
              </div>
            </div>
          </section>

          {/* SEZIONE 2: SCELTA DATA */}
          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
              <span className="bg-sage text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              Scegli il Giorno di Ritiro
            </h3>
            
            {errors.date && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded">{errors.date}</p>}

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {availableDays.map((date) => {
                const dateString = getIsoDate(date);
                const isSelected = selectedDate === dateString;
                return (
                  <button
                    key={dateString}
                    type="button"
                    onClick={() => setSelectedDate(dateString)}
                    className={`
                      flex-shrink-0 w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200
                      ${isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-105' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gray-50'}
                    `}
                  >
                    <span className="text-xs uppercase font-bold">{date.toLocaleDateString('it-IT', { weekday: 'short' })}</span>
                    <span className="text-2xl font-bold font-serif">{date.getDate()}</span>
                    <span className="text-xs">{date.toLocaleDateString('it-IT', { month: 'short' })}</span>
                    {isSelected && <CheckCircle size={16} className="mt-1 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SEZIONE 3: SCELTA ORARIO (Mostra solo se data scelta) */}
          {selectedDate && (
            <section className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
                <span className="bg-sage text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Scegli l'Orario
              </h3>

              {loadingSlots ? (
                <div className="flex items-center space-x-2 text-gray-500 py-4">
                  <span className="animate-spin">⏳</span>
                  <span>Verifica disponibilità orari...</span>
                </div>
              ) : slots.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-center gap-3">
                  <AlertCircle />
                  <div>
                    <p className="font-bold">Nessun orario disponibile per questa data.</p>
                    <p className="text-sm">Prova a selezionare un altro giorno o chiamaci.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {slots.map((slot) => {
                      const timeString = new Date(slot.startTime).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
                      const isSelected = formData.slotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleInputChange('slotId', slot.id)}
                          className={`
                            py-3 px-2 rounded-lg text-sm font-bold border transition-all duration-200
                            ${isSelected 
                              ? 'bg-sage text-white border-sage shadow-lg transform scale-105' 
                              : 'bg-white text-gray-700 border-gray-200 hover:border-sage hover:text-sage-dark'}
                          `}
                        >
                          {timeString}
                        </button>
                      );
                    })}
                  </div>
                  {errors.slotId && <p className="text-red-500 text-sm mt-2 font-medium">{errors.slotId}</p>}
                </>
              )}
            </section>
          )}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all
                ${isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-charcoal text-white hover:bg-black hover:scale-[1.01]'}
              `}
            >
              {isSubmitting ? (
                <>Wait...</>
              ) : (
                <>
                  <CheckCircle /> Conferma Prenotazione (Paga al Ritiro)
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Cliccando confermi di aver letto la Privacy Policy. Il pagamento avverrà esclusivamente in negozio.
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}