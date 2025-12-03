import { Hero } from '@/components/ui/Hero';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link'; // NEXT.JS usa questo, non react-router-dom
import { ArrowRight, Award, Users, Clock } from 'lucide-react';

export default function Home() {
  const featuredProducts = [
    {
      name: "Orata Fresca",
      description: "Orata del Mediterraneo, pescata del giorno. Ideale per cotture al forno o alla griglia.",
      image: "/assets/fresh-sea-bass-bream.jpg",
      category: "Pesce Pregiato",
      availability: "available" as const
    },
    {
      name: "Pesce Azzurro",
      description: "Selezione di sardine, alici e sgombri freschi. Ricchi di omega-3 e dal sapore autentico.",
      image: "/assets/blue-fish-selection.jpg",
      category: "Pesce Azzurro",
      availability: "available" as const
    },
    {
      name: "Frutti di Mare",
      description: "Cozze, vongole, polpi e seppie fresche. Perfetti per zuppe e primi piatti.",
      image: "/assets/seafood-shellfish-display.jpg",
      category: "Molluschi",
      availability: "limited" as const
    }
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
              I Nostri Prodotti del Giorno
            </h2>
            <p className="text-lg text-charcoal-light max-w-2xl mx-auto font-sans">
              Selezione quotidiana del pesce più fresco, direttamente dal mercato ittico alle vostre tavole.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          
          <div className="text-center">
            {/* Nota: Ho messo un link fittizio verso i prodotti, potremo crearlo dopo */}
            <Link
              href="/booking/milano-centro"
              className="inline-flex items-center space-x-2 text-sage-dark font-bold hover:text-charcoal transition-colors border-b-2 border-sage-dark hover:border-charcoal pb-1"
            >
              <span>Prenota il tuo pesce oggi</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Perché Scegliere Fresco&Fresco</h2>
            <p className="text-lg text-charcoal-light">
              La nostra passione per la qualità e la freschezza ci distingue nel territorio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-sage" />
              </div>
              <h3 className="text-xl font-serif font-bold text-charcoal mb-3">Qualità Garantita</h3>
              <p className="text-charcoal-light leading-relaxed">
                Selezioniamo solo il pesce più fresco, controllando personalmente ogni prodotto.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-sage" />
              </div>
              <h3 className="text-xl font-serif font-bold text-charcoal mb-3">Esperienza Professionale</h3>
              <p className="text-charcoal-light leading-relaxed">
                Vincenzo Tutino, con anni di esperienza, vi consiglierà sempre il meglio.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-sage" />
              </div>
              <h3 className="text-xl font-serif font-bold text-charcoal mb-3">Servizio Preordine</h3>
              <p className="text-charcoal-light leading-relaxed">
                Prenota il tuo pesce online e ritiralo quando preferisci, senza code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Prenota il Fresco, Evita la Fila!
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-sans">
            Con il nostro servizio di preordine puoi assicurarti il pesce migliore della giornata 
            comodamente da casa tua.
          </p>
          <Link
            href="/booking/milano-centro"
            className="inline-block bg-charcoal text-white px-10 py-4 rounded-lg font-bold hover:bg-white hover:text-charcoal transition-all shadow-xl"
          >
            Inizia il Preordine
          </Link>
        </div>
      </section>
    </main>
  );
}