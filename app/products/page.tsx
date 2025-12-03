import { prisma } from "@/lib/prisma";
import { ProductCard } from '@/components/ui/ProductCard';
// Importiamo il tipo Product generato (funzionerà dopo npx prisma generate)
import { Product } from "@prisma/client";

// Questa riga forza la pagina a essere dinamica (non statica)
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  
  // Recupera i prodotti dal DB
  const products = await prisma.product.findMany({
    where: { isAvailable: true }
  });

  // Mappa i dati per il frontend e converti i Decimali
  const formattedProducts = products.map((p: Product) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.image || "/assets/placeholder.jpg",
    pricePerKg: Number(p.pricePerKg), // Conversione fondamentale: Decimal -> Number
    unit: p.unit,
    category: p.category,
    availability: 'available' as const
  }));

  // Categorie statiche per i filtri (lato client)
  const categories = [
    { id: 'all', name: 'Tutti i Prodotti' },
    { id: 'daily', name: 'Pesce del Giorno' },
    { id: 'blue', name: 'Pesce Azzurro' },
    { id: 'premium', name: 'Pesce Pregiato' },
    { id: 'shellfish', name: 'Crostacei e Molluschi' }
  ];

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">I Nostri Prodotti</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri la nostra selezione quotidiana di pesce fresco, scelto con cura 
            per garantire sempre la massima qualità.
          </p>
        </div>

        {/* Prodotti Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formattedProducts.length > 0 ? (
            formattedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">Nessun prodotto disponibile al momento.</p>
              <p className="text-sm text-gray-400">Torna a trovarci domani mattina!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}