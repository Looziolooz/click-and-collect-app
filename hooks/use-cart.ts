import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Definiamo la struttura del singolo oggetto nel carrello
export interface CartItem {
  id: string;
  name: string;
  pricePerKg: number;
  quantity: number;
  unit: string;
}

// 2. Definiamo le azioni disponibili (Aggiungi, Rimuovi, Pulisci)
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalEstimated: () => number;
}

// 3. Creiamo lo Store con persistenza (salvataggio automatico)
export const useCart = create<CartStore>()(
  persist(
    // Argomento 1: La logica dello store
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          // Se il prodotto esiste già, aumentiamo solo la quantità
          return {
            items: state.items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        // Altrimenti lo aggiungiamo alla lista
        return { items: [...state.items, item] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => i.id === id ? { ...i, quantity } : i)
      })),

      clearCart: () => set({ items: [] }),

      totalEstimated: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          return acc + (item.pricePerKg * item.quantity);
        }, 0);
      }
    }),
    
    // Argomento 2: Le OPZIONI (Qui era l'errore: questo oggetto è obbligatorio)
    {
      name: 'fish-cart-storage', // Nome univoco nel localStorage
      storage: createJSONStorage(() => localStorage), // Specifica esplicita dello storage
      skipHydration: true, // Aiuta a prevenire errori di idratazione con Next.js
    }
  )
);