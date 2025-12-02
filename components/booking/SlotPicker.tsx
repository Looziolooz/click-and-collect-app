"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TimeSlot {
  id: string;
  startTime: string;
  isAvailable: boolean;
  bookedCount: number;
  maxCapacity: number;
}

export default function SlotPicker({ storeId }: { storeId: string }) {
  const router = useRouter();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // --- NUOVI STATI PER IL FORM ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    requestDetails: "",
    specialNotes: "",
    privacyAccepted: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logica data: Impostiamo a Domani (o Martedì se oggi è Lunedì/Domenica - logica semplificata per ora)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    async function fetchSlots() {
      try {
        const response = await fetch(`/api/slots?storeId=${storeId}&date=${dateStr}`);
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Errore fetch:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [storeId, dateStr]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          slotId: selectedSlot,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          requestDetails: formData.requestDetails,
          specialNotes: formData.specialNotes,
          privacyAccepted: formData.privacyAccepted
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Errore API");
      }

      router.push("/booking/success");
    } catch (error) {
      console.error(error);
      alert("Errore durante l'invio. Controlla i dati e riprova.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Intestazione Promozionale */}
      <div className="mb-6 p-4 bg-sage/10 border border-sage/20 rounded-lg text-charcoal">
        <h3 className="font-serif font-bold text-lg text-sage-dark mb-1">
          Prenota il fresco, evita la fila!
        </h3>
        <p className="text-sm">
          Seleziona l&apos;orario di ritiro per <strong>Domani ({dateStr})</strong> e compila la tua lista della spesa. 
          Ti invieremo un SMS di conferma con il prezzo esatto.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sage-dark animate-pulse">Caricamento disponibilità...</div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">Nessun orario disponibile per domani.</div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {slots.map((slot) => {
            const isFull = slot.bookedCount >= slot.maxCapacity;
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.isAvailable || isFull || isSubmitting}
                onClick={() => setSelectedSlot(slot.id)}
                className={`
                  py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 border
                  ${isSelected ? "bg-sage text-white border-sage ring-2 ring-sage/30" : 
                    isFull ? "bg-gray-100 text-gray-400 cursor-not-allowed" : 
                    "bg-white text-charcoal hover:border-sage border-gray-200"}
                `}
              >
                {formatTime(slot.startTime)}
                {isFull && <span className="block text-[10px]">Esaurito</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* MODULO AVANZATO */}
      {selectedSlot && (
        <div className="mt-8 pt-6 border-t border-gray-100 animate-fade-in">
          <form onSubmit={handleBooking} className="bg-cream p-6 rounded-xl border border-sage/20 shadow-sm">
            <h4 className="font-serif text-xl mb-6 text-charcoal font-bold">I tuoi dati e Ordine</h4>
            
            {/* Sezione Dati Personali */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-charcoal-light uppercase tracking-wide mb-1">Nome e Cognome *</label>
                <input required type="text" className="w-full p-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-1 focus:ring-sage outline-none" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Mario Rossi" />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-light uppercase tracking-wide mb-1">Cellulare (per SMS) *</label>
                <input required type="tel" className="w-full p-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-1 focus:ring-sage outline-none" 
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="333 1234567" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-charcoal-light uppercase tracking-wide mb-1">Email (Opzionale)</label>
                <input type="email" className="w-full p-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-1 focus:ring-sage outline-none" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="mario@email.com" />
              </div>
            </div>

            {/* Sezione Ordine */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-charcoal-light uppercase tracking-wide mb-1">Cosa desideri ordinare? *</label>
              <textarea required rows={4} className="w-full p-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-1 focus:ring-sage outline-none"
                value={formData.requestDetails} onChange={(e) => setFormData({...formData, requestDetails: e.target.value})} 
                placeholder="Es: 1kg di Cozze, 4 Orate da porzione, 500g di Gamberi..." />
              <p className="text-xs text-gray-500 mt-1">Descrivi quantità e tipologia. Pagherai al peso effettivo in negozio.</p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-charcoal-light uppercase tracking-wide mb-1">Note Speciali</label>
              <input type="text" className="w-full p-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-1 focus:ring-sage outline-none" 
                value={formData.specialNotes} onChange={(e) => setFormData({...formData, specialNotes: e.target.value})} placeholder="Es: Sfilettato, Pulito, Eviscerato..." />
            </div>

            {/* Privacy e Submit */}
            <div className="flex items-start gap-3 mb-6">
              <input required id="privacy" type="checkbox" className="mt-1 w-4 h-4 text-sage border-gray-300 rounded focus:ring-sage" 
                checked={formData.privacyAccepted} onChange={(e) => setFormData({...formData, privacyAccepted: e.target.checked})} />
              <label htmlFor="privacy" className="text-sm text-gray-600">
                Acconsento al trattamento dei dati per la gestione dell&apos;ordine. <br/>
                <span className="text-xs text-sage-dark">Non invieremo spam, solo l&apos;SMS di conferma ordine.</span>
              </label>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-600">
                Ritiro alle: <strong className="text-sage-dark text-lg">{slots.find(s => s.id === selectedSlot)?.startTime ? formatTime(slots.find(s => s.id === selectedSlot)!.startTime) : ''}</strong>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-charcoal text-white px-8 py-3 rounded-lg hover:bg-sage transition-colors shadow-lg disabled:opacity-70 font-medium">
                {isSubmitting ? "Invio richiesta..." : "INVIA RICHIESTA PREORDINE"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}