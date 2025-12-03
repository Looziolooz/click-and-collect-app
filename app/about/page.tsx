import { Award, Heart, Users, Clock } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-brand-blue font-serif mb-4">Chi Siamo</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La storia di una passione che si tramanda nel tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-100">
            <Image src="/assets/vincenzo-fishmonger-portrait.png" className="w-full h-full object-cover" alt="Vincenzo Tutino, a master fishmonger, stands confidently in his market setting surrounded by fresh seafood displays. His expression conveys passion and dedication to his craft. The warm, professional portrait captures the pride and expertise he brings to selecting premium quality fish daily." width={500} height={500} />
            <Image src="/assets/vincenzo-fishmonger-portrait.png" className="w-full h-full object-cover" alt="Vincenzo Tutino, a master fishmonger, stands confidently in his market setting surrounded by fresh seafood displays. His expression conveys passion and dedication to his craft. The warm, professional portrait captures the pride and expertise he brings to selecting premium quality fish daily." />
            </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Vincenzo Tutino</h2>
            <p className="text-lg text-gray-600 italic border-l-4 border-brand-yellow pl-4">
              "La freschezza non è negoziabile. Ogni mattina, quando scelgo il pesce al mercato, penso alle famiglie che si siederanno a tavola."
            </p>
            <p className="text-gray-700">
              Vincenzo Tutino non è solo un pescivendolo, è un <strong>maestro selezionatore</strong> che ha fatto della qualità la sua missione.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}