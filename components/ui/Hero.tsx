import Link from 'next/link';
import { Clock, Award, Users, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-brand-blue to-brand-blue-light overflow-hidden">
      {/* Sfondo decorativo con pattern (opzionale, per dare texture) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonna Testo */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight font-serif drop-shadow-lg">
                Pesce <span className="text-brand-yellow relative inline-block">
                  Fresco
                  {/* Sottolineatura decorativa gialla */}
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-yellow/60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.5C36.5 0.5 163.5 0.5 198 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                </span>
                <br />
                Ogni Giorno
              </h1>
              <p className="mt-6 text-xl text-blue-100 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
                Da Vincenzo Tutino, la tradizione e la qualità del pescato migliore, 
                selezionato con cura ogni mattina per la tua tavola.
              </p>
            </div>

            {/* Box Orari */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border-l-4 border-brand-yellow text-white inline-flex items-center space-x-4 mx-auto lg:mx-0">
              <div className="bg-brand-yellow/20 p-3 rounded-full">
                 <Clock className="h-8 w-8 text-brand-yellow" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-brand-yellow">Orari di Apertura</h3>
                <p className="text-blue-50 text-lg">Martedì - Sabato: <span className="font-bold">7:00 - 14:00</span></p>
              </div>
            </div>

            {/* Bottoni CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="group bg-brand-yellow text-brand-blue px-8 py-4 rounded-full font-bold hover:bg-white hover:text-brand-blue transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center flex items-center justify-center gap-2 text-lg"
              >
                Vedi i Prodotti <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </Link>
              <Link
                href="/cart"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-brand-blue transition-all text-center text-lg"
              >
                Vai al Carrello
              </Link>
            </div>
          </div>

          {/* Colonna Immagine */}
          <div className="relative lg:mt-0 mt-12">
            <div className="aspect-square rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,_0,_0,_0.3)] border-8 border-white/30 relative z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero-fish-market-display.png"
                alt="Banco del pesce fresco"
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000 ease-out"
              />
            </div>

            {/* BADGE Aggiornato: Giallo, niente bordo bianco, testo blu */}
            <div className="absolute -top-6 -right-6 lg:-right-10 bg-brand-yellow text-brand-blue px-8 py-4 rounded-full font-bold shadow-2xl transform rotate-12 z-20 text-xl flex items-center gap-2 animate-pulse">
              <Award className="h-6 w-6" /> Fresco del Giorno!
            </div>

            {/* Elementi decorativi di sfondo dietro l'immagine */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-blue-dark/30 rounded-full blur-3xl -z-10"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}