import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-white mt-auto border-t-4 border-brand-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-brand-yellow">Pescheria Fresco&Fresco</h3>
            <p className="text-blue-100 mb-4 font-sans text-sm leading-relaxed">
              Da Vincenzo Tutino - Il tuo punto di riferimento per il pesce fresco a Lamezia Terme. 
              Qualità e tradizione ogni giorno sulla tua tavola.
            </p>
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <MapPin className="h-4 w-4 text-brand-yellow" />
              <span>Lamezia Terme (CZ), Calabria</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Orari di Apertura</h3>
            <div className="space-y-2 text-blue-100 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-brand-yellow" />
                <span>Martedì - Sabato: 7:00 - 14:00</span>
              </div>
              <div className="text-brand-red font-bold bg-white/10 inline-block px-2 py-1 rounded">
                Chiuso Domenica e Lunedì
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contatti</h3>
            <div className="space-y-3 text-blue-100 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brand-yellow" />
                <span>+39 333 1234567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-yellow" />
                <span>info@frescofresco.it</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-900 mt-8 pt-8 text-center text-blue-300 text-xs">
          <p>&copy; {new Date().getFullYear()} Pescheria Fresco&Fresco. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}