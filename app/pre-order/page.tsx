import { PreOrderForm } from '@/components/booking/PreOrderForm';
import { AlertCircle, Phone } from 'lucide-react';

export default function PreOrderPage() {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            Prenota il Fresco, Evita la Fila!
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Con il nostro servizio di <strong>Preordine Senza Impegno</strong> puoi assicurarti 
            il pesce migliore della giornata comodamente da casa tua. Scegli cosa desideri, 
            indica quando vuoi ritirarlo e noi ti confermeremo la disponibilità e il prezzo esatto via SMS.
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center font-serif">Come Funziona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, title: "Compila il Modulo", text: "Inserisci i tuoi dati e il tuo ordine. Indicaci il giorno preferito per il ritiro." },
              { id: 2, title: "Noi Verifichiamo", text: "La mattina stessa, controlliamo la disponibilità al mercato ittico e la freschezza ottimale." },
              { id: 3, title: "Ricevi la Conferma", text: "Ti invieremo un SMS con il totale esatto e l'orario di ritiro. Solo allora l'ordine sarà confermato." },
              { id: 4, title: "Ritira e Paga", text: "Vieni in pescheria all'ora stabilita, paghi e porti via il tuo pesce fresco, già pronto." }
            ].map((step) => (
              <div key={step.id} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{step.id}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
             <PreOrderForm />
        </div>

        {/* Important Notes & FAQ */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
            Note Importanti & FAQ
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">⚠️ Attenzione</h4>
              <p className="text-gray-700 text-sm mb-4">
                L'invio del modulo è una <strong>richiesta di preordine</strong>, non una conferma d'acquisto. 
                La disponibilità dipende dall'approvvigionamento giornaliero al mercato.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">📱 Quando riceverò l'SMS?</h4>
              <p className="text-gray-700 text-sm mb-4">
                Generalmente entro le <strong>10:30</strong> del mattino del giorno del ritiro.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔄 Posso modificare l'ordine?</h4>
              <p className="text-gray-700 text-sm mb-4">
                Sì, puoi contattarci telefonicamente prima di aver ricevuto l'SMS di conferma.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">💳 Metodi di pagamento</h4>
              <p className="text-gray-700 text-sm mb-4">
                Contanti, Carta di Credito/Debito, Bancomat.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-yellow-300">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Il mio ordine non è disponibile?</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Ti contatteremo telefonicamente per proporti un'alternativa di pari qualità e valore.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}