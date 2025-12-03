"use client";

import { useState } from 'react';
import { Calendar, Clock, User, FileText } from 'lucide-react'; // Rimosso Phone, Mail
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  orderDetails: string;
  specialNotes: string;
  pickupDate: string;
  privacyAccepted: boolean;
}

// CORREZIONE TYPE: Definiamo che gli errori sono sempre stringhe
type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function PreOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    orderDetails: '',
    specialNotes: '',
    pickupDate: '',
    privacyAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // CORREZIONE: Usiamo il nuovo tipo FormErrors
  const [errors, setErrors] = useState<FormErrors>({});

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek >= 2 && dayOfWeek <= 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };
  const availableDates = getAvailableDates();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}; // Usa il tipo corretto
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Nome richiesto';
    if (!formData.lastName.trim()) newErrors.lastName = 'Cognome richiesto';
    if (!formData.phone.trim()) newErrors.phone = 'Telefono richiesto';
    if (!formData.orderDetails.trim()) newErrors.orderDetails = 'Dettagli ordine richiesti';
    if (!formData.pickupDate) newErrors.pickupDate = 'Data di ritiro richiesta';
    
    // CORREZIONE: Ora possiamo assegnare una stringa perché FormErrors accetta stringhe
    if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Accettazione privacy richiesta';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simuliamo chiamata API e attesa
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      // Successo -> Redirect
      router.push('/booking/success');

    } catch (error) {
      // CORREZIONE: Usiamo la variabile error per il debug
      console.error("Errore invio form:", error);
      alert("Errore durante l'invio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const formatDate = (dateString: string) => {
    if(!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-charcoal mb-4 font-serif">Preordina il Tuo Pesce</h1>
        <p className="text-charcoal-light max-w-2xl mx-auto">
          Compila il modulo sottostante per prenotare il pescato del giorno. 
          Ti invieremo un SMS di conferma con il prezzo esatto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        {/* Dati Personali */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-charcoal flex items-center border-b pb-2">
            <User className="h-5 w-5 mr-2 text-sage" /> Dati Personali
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sage outline-none ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
              <input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sage outline-none ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
              <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sage outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opzionale)</label>
              <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage outline-none" />
            </div>
          </div>
        </div>

        {/* Dettagli Ordine */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold text-charcoal flex items-center border-b pb-2">
            <FileText className="h-5 w-5 mr-2 text-sage" /> Il Tuo Ordine
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cosa desideri ordinare? *</label>
            <textarea rows={4} value={formData.orderDetails} onChange={(e) => handleInputChange('orderDetails', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sage outline-none ${errors.orderDetails ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Es: 1kg di orate, 500g di gamberi rossi..." />
            {errors.orderDetails && <p className="text-red-500 text-xs mt-1">{errors.orderDetails}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note Speciali</label>
            <input type="text" value={formData.specialNotes} onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage outline-none" placeholder="Es: Già pulito, sottovuoto..." />
          </div>
        </div>

        {/* Data Ritiro */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold text-charcoal flex items-center border-b pb-2">
            <Calendar className="h-5 w-5 mr-2 text-sage" /> Ritiro
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona data *</label>
            <select value={formData.pickupDate} onChange={(e) => handleInputChange('pickupDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sage outline-none ${errors.pickupDate ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">-- Seleziona --</option>
              {availableDates.map(date => (
                <option key={date} value={date}>{formatDate(date)}</option>
              ))}
            </select>
            {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
          </div>
          <div className="bg-sage/10 p-3 rounded-md flex items-center text-sage-dark text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Orario di ritiro standard: 07:00 - 14:00
          </div>
        </div>

        {/* Privacy */}
        <div className="flex items-start space-x-3 pt-4">
          <input type="checkbox" id="privacy" checked={formData.privacyAccepted} onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
            className="mt-1 h-4 w-4 text-sage border-gray-300 rounded focus:ring-sage" />
          <label htmlFor="privacy" className="text-sm text-gray-600">
            Acconsento al trattamento dei dati personali. <span className={`text-red-500 ${errors.privacyAccepted ? 'inline' : 'hidden'}`}>*</span>
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-charcoal text-white py-3 rounded-lg font-bold hover:bg-sage-dark transition-colors shadow-lg disabled:opacity-70">
          {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta Preordine'}
        </button>
      </form>
    </div>
  );
}