import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto"> {/* mt-auto per spingerlo giù */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Business Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pescheria Fresco&Fresco</h3>
            <p className="text-gray-300 mb-4">
              Da Vincenzo Tutino - Il tuo punto di riferimento per il pesce fresco a Lamezia Terme
            </p>
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>Lamezia Terme (CZ), Calabria</span>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Orari di Apertura</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Martedì - Sabato: 7:00 - 14:00</span>
              </div>
              <div className="text-red-400 font-medium">
                Chiuso Domenica e Lunedì
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contatti</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+39 333 1234567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@frescofresco.it</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pescheria Fresco&Fresco. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}