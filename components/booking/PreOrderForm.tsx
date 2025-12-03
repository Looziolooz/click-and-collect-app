"use client";

import { useState } from 'react';
import { Calendar, Clock, User, FileText } from 'lucide-react';
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

type FormErrors = {
  [K in keyof FormData]?: string;
};

export function PreOrderForm() {
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
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Nome richiesto';
    if (!formData.lastName.trim()) newErrors.lastName = 'Cognome richiesto';
    if (!formData.phone.trim()) newErrors.phone = 'Telefono richiesto';
    if (!formData.orderDetails.trim()) newErrors.orderDetails = 'Dettagli ordine richiesti';
    if (!formData.pickupDate) newErrors.pickupDate = 'Data di ritiro richiesta';
    if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Accettazione privacy richiesta';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Simulazione chiamata API
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/booking/success');
    } catch (error) {
      console.error(error);
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Compila la tua richiesta</h3>
      
      {/* Dati Personali */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center border-b pb-2">
          <User className="h-5 w-5 mr-2 text-blue-600" /> Dati Personali
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
            <input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
            <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opzionale)</label>
            <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Dettagli Ordine */}
      <div className="space-y-4 pt-6">
        <h4 className="font-semibold text-gray-900 flex items-center border-b pb-2">
          <FileText className="h-5 w-5 mr-2 text-blue-600" /> Il Tuo Ordine
        </h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cosa desideri ordinare? *</label>
          <textarea rows={4} value={formData.orderDetails} onChange={(e) => handleInputChange('orderDetails', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.orderDetails ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Es: 1kg di orate, 500g di gamberi rossi..." />
          {errors.orderDetails && <p className="text-red-500 text-xs mt-1">{errors.orderDetails}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note Speciali</label>
          <input type="text" value={formData.specialNotes} onChange={(e) => handleInputChange('specialNotes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" placeholder="Es: Già pulito, sottovuoto..." />
        </div>
      </div>

      {/* Data Ritiro */}
      <div className="space-y-4 pt-6">
        <h4 className="font-semibold text-gray-900 flex items-center border-b pb-2">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" /> Ritiro
        </h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona data *</label>
          <select value={formData.pickupDate} onChange={(e) => handleInputChange('pickupDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.pickupDate ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">-- Seleziona --</option>
            {availableDates.map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
          </select>
          {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
        </div>
        <div className="bg-blue-50 p-3 rounded-md flex items-center text-blue-800 text-sm">
          <Clock className="h-4 w-4 mr-2" />
          Orario di ritiro standard: 07:00 - 14:00
        </div>
      </div>

      {/* Privacy */}
      <div className="flex items-start space-x-3 pt-6 pb-6">
        <input type="checkbox" id="privacy" checked={formData.privacyAccepted} onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <label htmlFor="privacy" className="text-sm text-gray-600">
          Acconsento al trattamento dei dati personali. <span className={`text-red-500 ${errors.privacyAccepted ? 'inline' : 'hidden'}`}>*</span>
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70 text-lg">
        {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta Preordine'}
      </button>
    </form>
  );
}