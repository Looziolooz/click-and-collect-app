import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-sage/20">
        <div className="w-16 h-16 bg-sage/20 text-sage rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-serif text-charcoal mb-4">Richiesta Inviata!</h1>
        <p className="text-charcoal-light mb-6 text-sm">
          Grazie. Abbiamo ricevuto la tua lista della spesa.
        </p>

        <div className="bg-sage/10 p-4 rounded-lg mb-8 text-left">
          <h3 className="font-bold text-sage-dark text-sm mb-2">Cosa succede ora?</h3>
          <ol className="list-decimal list-inside text-sm text-charcoal-light space-y-2">
            <li>Controlleremo la disponibilità del pescato.</li>
            <li>Ti invieremo un <strong>SMS</strong> domani mattina con il <strong>prezzo esatto</strong>.</li>
            <li>Vieni a ritirare e pagare in negozio all&apos;orario scelto.</li>
          </ol>
        </div>

        <Link href="/" className="block w-full bg-charcoal text-white font-medium py-3 rounded-lg hover:bg-sage transition-colors">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}