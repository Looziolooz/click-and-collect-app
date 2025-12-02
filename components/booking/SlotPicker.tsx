"use client"; // Obbligatorio per componenti interattivi

import { useState, useEffect } from "react";

// Definiamo come è fatto uno Slot (TypeScript interface)
interface TimeSlot {
  id: string;
  startTime: string;
  isAvailable: boolean;
  bookedCount: number;
  maxCapacity: number;
}

export default function SlotPicker({ storeId }: { storeId: string }) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Per il test, impostiamo la data a "Domani" (dove abbiamo generato i dati)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  useEffect(() => {
    // Funzione che scarica gli orari dall'API che abbiamo appena creato
    async function fetchSlots() {
      try {
        const response = await fetch(`/api/slots?storeId=${storeId}&date=${dateStr}`);
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Errore caricamento slot:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [storeId, dateStr]);

  // Formattazione orario (es. da "2023-01-01T09:00:00" a "09:00")
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-serif text-charcoal mb-4">
        Disponibilità per Domani ({dateStr})
      </h3>

      {loading ? (
        <div className="text-center py-8 text-sage-dark animate-pulse">
          Caricamento orari...
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8 text-charcoal-light bg-gray-50 rounded-lg">
          Nessun orario disponibile per questa data.
        </div>
      ) : (
        /* GRIGLIA DEGLI ORARI */
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {slots.map((slot) => {
            const isFull = slot.bookedCount >= slot.maxCapacity;
            const isSelected = selectedSlot === slot.id;

            return (
              <button
                key={slot.id}
                disabled={!slot.isAvailable || isFull}
                onClick={() => setSelectedSlot(slot.id)}
                className={`
                  py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 border
                  ${
                    isSelected
                      ? "bg-sage text-white border-sage ring-2 ring-sage/30 ring-offset-1" // Selezionato
                      : isFull
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" // Pieno
                      : "bg-white text-charcoal hover:border-sage hover:text-sage-dark border-gray-200" // Disponibile
                  }
                `}
              >
                {formatTime(slot.startTime)}
                {isFull && <span className="block text-[10px]">Pieno</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Bottone di Conferma che appare solo se selezioni uno slot */}
      {selectedSlot && (
        <div className="mt-8 pt-6 border-t border-gray-100 animate-fade-in">
          <div className="flex justify-between items-center bg-cream p-4 rounded-lg border border-sage/20">
            <div>
              <p className="text-sm text-charcoal-light">Hai selezionato:</p>
              <p className="font-bold text-sage-dark text-lg">
                {slots.find(s => s.id === selectedSlot) 
                  ? formatTime(slots.find(s => s.id === selectedSlot)!.startTime) 
                  : ''}
              </p>
            </div>
            <button className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-sage transition-colors shadow-lg">
              Procedi all Ordine →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}