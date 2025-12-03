"use client";

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBasket, Check } from 'lucide-react'; // Importiamo icona Check

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePerKg: number;
  unit: string;
  category: string;
  availability: string;
}

export function ProductCard({ id, name, description, image, pricePerKg, unit, category }: ProductCardProps) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false); // Stato per feedback visivo

  const handleAddToCart = () => {
    cart.addItem({ id, name, pricePerKg, quantity: qty, unit });
    
    // Feedback visivo invece dell'alert
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Torna normale dopo 2 secondi
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-300">
      <div className="aspect-video relative bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm text-charcoal">
          € {pricePerKg?.toFixed(2) || 'N/A'} / {unit || 'pz'}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">{category}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{description}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-3">
            
            {/* Selettore Quantità */}
            <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
              <button 
                onClick={() => setQty(Math.max(0.5, qty - 0.5))} 
                className="px-3 py-1 hover:bg-gray-200 text-gray-600 transition-colors"
              >-</button>
              <span className="w-14 text-center text-sm font-medium">{qty} {unit}</span>
              <button 
                onClick={() => setQty(qty + 0.5)} 
                className="px-3 py-1 hover:bg-gray-200 text-gray-600 transition-colors"
              >+</button>
            </div>

            {/* Bottone Aggiungi con Feedback */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-1 p-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isAdded 
                  ? 'bg-green-600 text-white cursor-default' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={18} /> Aggiunto
                </>
              ) : (
                <>
                  <ShoppingBasket size={18} /> Aggiungi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}