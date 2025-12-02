import Link from "next/link"; // <--- Importiamo il componente per i link

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream p-8">
      
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl overflow-hidden border border-sage-light/30">
        
        {/* Header Section */}
        <div className="bg-sage p-6 text-center">
          <h1 className="text-3xl font-serif font-bold text-white">
            Click & Collect
          </h1>
          <p className="text-white/90 text-sm mt-2 font-sans">
            Store Pickup System
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 text-center">
          <h2 className="text-xl font-serif text-charcoal mb-4">
            Benvenuto
          </h2>
          <p className="text-charcoal-light font-sans mb-8 leading-relaxed">
            Il sistema è configurato e il database è attivo. 
            Clicca qui sotto per simulare la prenotazione di un cliente nel negozio di test.
          </p>

          {/* Action Button - Ora collegato! */}
          <Link 
            href="/booking/milano-centro" 
            className="block w-full bg-charcoal text-white font-sans font-medium py-3 px-4 rounded-lg hover:bg-charcoal-light transition-colors duration-200"
          >
            Prenota un Ritiro
          </Link>
          
        </div>
        
      </div>
    </main>
  );
}