import { Award, Heart, Users, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Chi Siamo</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La storia di una passione che si tramanda nel tempo, 
            per portare sulle vostre tavole solo il meglio del mare.
          </p>
        </div>

        {/* Vincenzo's Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-200">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/vincenzo-fishmonger-portrait.jpg"
                alt="Vincenzo Tutino"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Vincenzo Tutino</h2>
            <p className="text-lg text-gray-600 italic">
              "La freschezza non è negoziabile. Ogni mattina, quando scelgo il pesce al mercato, 
              penso alle famiglie che si siederanno a tavola quella sera."
            </p>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Vincenzo Tutino non è solo un pescivendolo, è un <strong>maestro selezionatore</strong> 
                che ha fatto della qualità e della freschezza la sua missione di vita.
              </p>
              <p>
                Ogni mattina, alle prime luci dell'alba, Vincenzo si reca personalmente al mercato 
                ittico per selezionare solo i prodotti che rispettano i suoi rigorosi standard di qualità.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 font-serif">I Nostri Valori</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Freschezza Garantita</h3>
              <p className="text-gray-600">Il nome "Fresco&Fresco" è una dichiarazione d'intenti che rispettiamo ogni giorno.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Competenza</h3>
              <p className="text-gray-600">Vincenzo è un esperto in grado di consigliarvi sulla scelta e preparazione.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Passione</h3>
              <p className="text-gray-600">Selezioniamo prodotti ittici di alta qualità con cura e passione.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Servizio Clienti</h3>
              <p className="text-gray-600">Ogni cliente è parte della nostra famiglia.</p>
            </div>
          </div>
        </div>

        {/* Commitment */}
        <div className="bg-blue-600 rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6 font-serif">Il Nostro Impegno</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Ogni giorno rinnoviamo il nostro impegno verso la qualità, la freschezza e la soddisfazione dei nostri clienti.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-blue-200">Anni di Esperienza</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-200">Freschezza</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-blue-200">Clienti Felici</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}