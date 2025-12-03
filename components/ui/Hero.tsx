import Link from 'next/link';
import { Clock, Star, Fish } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight font-serif">
                Pesce <span className="text-blue-600">Fresco</span>
                <br />
                Ogni Giorno
              </h1>
              <p className="mt-4 text-xl text-gray-600 font-sans">
                Da Vincenzo Tutino, la tradizione e la qualità del pesce fresco 
                selezionato con cura per la tua tavola.
              </p>
            </div>

            {/* Opening Hours Highlight */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Orari di Apertura</h3>
                  <p className="text-gray-600">Martedì - Sabato: 7:00 - 14:00</p>
                  <p className="text-sm text-red-600 font-medium">Chiuso Domenica e Lunedì</p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Freschezza Garantita</span>
              </div>
              <div className="flex items-center space-x-2">
                <Fish className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Selezione Accurata</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Servizio Professionale</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center shadow-lg"
              >
                Vedi i Prodotti
              </Link>
              <Link
                href="/pre-order"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors text-center"
              >
                Preordina Ora
              </Link>
            </div>
          </div>

         {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero-fish-market-display.jpg"
                alt="Banco del pesce fresco della Pescheria Fresco&Fresco"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg transform rotate-12 border border-yellow-300">
              Fresco del Giorno!
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}