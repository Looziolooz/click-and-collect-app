import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-16 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-blue mb-4 font-serif">Contatti</h1>
          <p className="text-lg text-gray-600">Vieni a trovarci o contattaci.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-brand-blue">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pescheria Fresco&Fresco</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center gap-3"><MapPin className="text-brand-yellow"/> Via del Progresso 42, Lamezia Terme</div>
              <div className="flex items-center gap-3"><Phone className="text-brand-yellow"/> +39 333 1234567</div>
              <div className="flex items-center gap-3"><Mail className="text-brand-yellow"/> info@frescofresco.it</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-brand-yellow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Orari</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2"><span className="font-bold">Martedì - Sabato</span> <span className="text-brand-blue font-bold">07:00 - 14:00</span></div>
              <div className="flex justify-between text-brand-red"><span className="font-bold">Dom - Lun</span> <span>CHIUSO</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}