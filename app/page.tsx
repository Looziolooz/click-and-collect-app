import { Hero } from '@/components/ui/Hero';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link'; 
import { ArrowRight, Award, Users, Clock } from 'lucide-react';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Prendi i primi 3 prodotti disponibili per la vetrina
  const products = await prisma.product.findMany({ 
    where: { isAvailable: true },
    take: 3,
    orderBy: { category: 'asc' }
  });

  return (
    <main className="min-h-screen bg-brand-offwhite">
      <Hero />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-blue-dark mb-4">
              I Nostri Prodotti del Giorno
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
              Selezione quotidiana del pesce più fresco, direttamente dal mercato ittico.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {products.map((p) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                description={p.description}
                image={p.image}
                pricePerKg={Number(p.pricePerKg)} // Conversione Decimal -> Number
                unit={p.unit}
                category={p.category}
                isAvailable={true}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products" className="inline-flex items-center space-x-2 text-brand-blue font-bold hover:text-brand-blue-light border-b-2 border-brand-blue pb-1 transition-colors">
              <span>Vedi tutto il catalogo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-brand-yellow">Perché Scegliere Fresco&Fresco</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            <div className="flex flex-col items-center group">
              <div className="bg-white/10 p-4 rounded-full mb-4 group-hover:bg-brand-yellow group-hover:text-brand-blue transition-colors"><Award className="h-8 w-8 text-brand-yellow group-hover:text-brand-blue"/></div>
              <h3 className="font-bold text-xl mb-2">Qualità Garantita</h3>
              <p className="text-blue-100 text-sm">Solo il pescato migliore, selezionato ogni mattina.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-white/10 p-4 rounded-full mb-4 group-hover:bg-brand-yellow group-hover:text-brand-blue transition-colors"><Users className="h-8 w-8 text-brand-yellow group-hover:text-brand-blue"/></div>
              <h3 className="font-bold text-xl mb-2">Esperienza</h3>
              <p className="text-blue-100 text-sm">Oltre 20 anni di esperienza nel settore ittico.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-white/10 p-4 rounded-full mb-4 group-hover:bg-brand-yellow group-hover:text-brand-blue transition-colors"><Clock className="h-8 w-8 text-brand-yellow group-hover:text-brand-blue"/></div>
              <h3 className="font-bold text-xl mb-2">Click & Collect</h3>
              <p className="text-blue-100 text-sm">Prenota online, salta la fila e paga al ritiro.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}