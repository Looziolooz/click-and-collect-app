import { prisma } from "@/lib/prisma";
import { ProductCard } from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { category: 'asc' }
  });

  return (
    <div className="py-16 bg-brand-offwhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-blue-dark mb-4 font-serif">I Nostri Prodotti</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri la nostra selezione quotidiana di pesce fresco, scelto con cura 
            per garantire sempre la massima qualità.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                description={p.description}
                image={p.image}
                pricePerKg={Number(p.pricePerKg)} // Conversione Decimal -> Number
                unit={p.unit}
                category={p.category}
                isAvailable={p.isAvailable}
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