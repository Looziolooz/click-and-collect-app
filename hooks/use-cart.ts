import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product ID
  name: string;
  pricePerKg: number;
  quantity: number; // Quantità scelta dall'utente
  unit: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalEstimated: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          // Se esiste già, aggiorniamo solo la quantità
          return {
            items: state.items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
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
          // Logica semplificata: assumiamo che quantity sia sempre in unità di prezzo
          return acc + (item.pricePerKg * item.quantity);
        }, 0);
      }
    }),
    { name: 'fish-cart-storage' } // Salva nel localStorage così non si perde al refresh
  )
);