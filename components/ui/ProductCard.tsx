"use client";

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBasket, Check, Info } from 'lucide-react';

// DEFINTIZIONE MANUALE DELLE PROPS
// Disaccoppiamo il componente dal tipo Prisma per evitare conflitti Decimal/number
interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  pricePerKg: number; // Qui imponiamo che sia un numero semplice!
  unit: string;
  category: string;
  isAvailable: boolean;
}

export function ProductCard({ id, name, description, image, pricePerKg, unit, category, isAvailable }: ProductCardProps) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    // pricePerKg è già un numero ora, non serve castarlo
    cart.addItem({ id, name, pricePerKg, quantity: qty, unit });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Safe check per il rendering
  const formattedPrice = (typeof pricePerKg === 'number') ? pricePerKg.toFixed(2) : '0.00';

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border ${isAvailable ? 'border-blue-50' : 'border-gray-200 opacity-75'} flex flex-col h-full group`}>
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={image || "/assets/placeholder.jpg"} 
          alt={name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isAvailable ? 'group-hover:scale-110' : 'grayscale'}`} 
        />
        
        {isAvailable && (
          <div className="absolute top-3 right-3 bg-brand-yellow text-brand-blue px-3 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center border border-brand-blue/10">
            € {formattedPrice} <span className="text-xs font-normal ml-1">/{unit}</span>
          </div>
        )}

        {!isAvailable && (
           <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
             <span className="bg-brand-red text-white px-4 py-2 rounded-md font-bold uppercase text-sm tracking-wider">Non disponibile</span>
           </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          {category && <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">{category}</span>}
          <h3 className="font-bold text-gray-900 text-xl mt-2 group-hover:text-brand-blue transition-colors font-serif">{name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{description}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          {isAvailable ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center border border-blue-200 rounded-lg bg-blue-50/30 overflow-hidden">
                <button onClick={() => setQty(Math.max(0.5, qty - 0.5))} className="px-3 py-2 hover:bg-blue-100 text-brand-blue transition-colors font-bold text-lg">-</button>
                <span className="w-14 text-center text-sm font-bold text-gray-800">{qty} <span className="text-xs font-normal">{unit}</span></span>
                <button onClick={() => setQty(qty + 0.5)} className="px-3 py-2 hover:bg-blue-100 text-brand-blue transition-colors font-bold text-lg">+</button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
                  isAdded 
                    ? 'bg-brand-yellow text-brand-blue cursor-default shadow-none' 
                    : 'bg-brand-blue text-white hover:bg-brand-blue-dark hover:shadow-md'
                }`}
              >
                {isAdded ? <><Check size={18} /> Aggiunto!</> : <><ShoppingBasket size={18} /> Aggiungi</>}
              </button>
            </div>
          ) : (
             <div className="text-center text-gray-400 italic text-sm flex items-center justify-center gap-2 py-2">
                <Info size={16} /> Prodotto terminato
             </div>
          )}
          
          {isAvailable && (
             <p className="text-xs text-center text-gray-500 mt-3 font-medium">
               Totale stimato: <span className="text-brand-blue font-bold">€ {(pricePerKg * qty).toFixed(2)}</span>
             </p>
          )}
        </div>
      </div>
    </div>
  );
}