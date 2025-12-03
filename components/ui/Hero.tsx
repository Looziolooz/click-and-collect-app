import Link from 'next/link';
import Image from 'next/image';
import { Clock, Award, ArrowRight, ShoppingBag, FileText } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-brand-blue to-brand-blue-light overflow-hidden">
      {/* Sfondo decorativo con pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Colonna Testo */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              {/* Badge Brand */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 text-sm font-bold mb-6">
                <Award size={16} /> Da Vincenzo Tutino
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight font-serif drop-shadow-lg">
                Il Mare in Tavola, <br />
                <span className="text-brand-yellow relative inline-block">
                  Senza Attese
                  {/* Sottolineatura decorativa gialla */}
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-yellow/60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.5C36.5 0.5 163.5 0.5 198 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                </span>
              </h1>
              
              <p className="mt-6 text-lg lg:text-xl text-blue-100 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
                Prenota online il miglior pescato del giorno e ritira comodamente in negozio saltando la fila. 
                Qualità garantita ogni mattina.
              </p>
            </div>

            {/* Box Orari */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-5 border-l-4 border-brand-yellow text-white inline-flex items-center gap-4 mx-auto lg:mx-0 text-left transition-transform hover:scale-105">
              <div className="bg-brand-yellow/20 p-3 rounded-full shrink-0">
                 <Clock className="h-6 w-6 text-brand-yellow" />
              </div>
              <div>
<h3 className="font-bold text-brand-yellow uppercase tracking-wide text-xs">Orari Ritiro</h3>                <p className="text-blue-50 text-lg font-mono">Mar - Sab: <span className="font-bold">07:00 - 14:00</span></p>
              </div>
            </div>

            {/* Bottoni CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="group bg-brand-yellow text-brand-blue px-8 py-4 rounded-full font-bold hover:bg-white hover:text-brand-blue transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingBag size={20} />
                Ordina dal Catalogo
              </Link>
              
              <Link
                href="/pre-order"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-brand-blue transition-all text-center text-lg flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                Lista Veloce
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
              </Link>
            </div>
            
            <div className="text-sm text-blue-200/80 pt-2">
              Hai già un ordine? <Link href="/cart" className="underline hover:text-brand-yellow text-white">Vai al carrello</Link>
            </div>
          </div>

          {/* Colonna Immagine */}
          <div className="relative lg:mt-0 mt-12 group perspective">
            <div className="aspect-square rounded-full overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-white/20 relative z-10 bg-brand-blue-dark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src="/assets/hero-vincenzo.png"
                alt="Vincenzo Tutino - Pescheria Fresco&Fresco"
                className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-1000 ease-out"
                priority
                width={600}
                height={600}
              />
            </div>

            {/* BADGE */}
            <div className="absolute -top-4 -right-2 lg:-right-8 bg-brand-yellow text-brand-blue px-6 py-3 rounded-2xl font-bold shadow-xl transform rotate-6 z-20 text-lg flex items-center gap-2 border-2 border-brand-blue">
              <Award className="h-5 w-5" /> Arrivi Giornalieri!
            </div>

            {/* Elementi decorativi di sfondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-blue-dark/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}