// ABBIAMO RIMOSSO TEMPORANEAMENTE "import Image from 'next/image'"
// Lo rimetteremo quando avremo caricato le foto reali.

interface ProductProps {
  name: string;
  description: string;
  image: string; // Lasciamo questo nell'interfaccia così il genitore non dà errori
  category: string;
  availability: "available" | "limited" | "sold-out";
}

// NOTA: Ho rimosso "image" dalla lista delle variabili qui sotto (destructuring)
// così ESLint non si lamenta più.
export function ProductCard({ name, description, category, availability }: ProductProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group h-full flex flex-col">
      
      {/* Placeholder Immagine */}
      <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400 font-medium">
        {/* Usiamo {name} per dare un contesto al placeholder */}
        <span className="text-center px-4">[FOTO: {name}]</span>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-sage-dark uppercase tracking-wider">{category}</span>
          {availability === 'limited' && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">Limitato</span>
          )}
        </div>
        <h3 className="text-xl font-serif font-bold text-charcoal mb-2 group-hover:text-sage-dark transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
}