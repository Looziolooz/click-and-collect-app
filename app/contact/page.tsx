import { MapPin, Phone, Mail, Clock, Car, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Contatti</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vieni a trovarci in pescheria o contattaci per qualsiasi informazione. 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Pescheria Fresco&Fresco</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Indirizzo</h3>
                    <p className="text-gray-600">
                      Via del Progresso, 42<br />
                      88046 Lamezia Terme (CZ)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefono</h3>
                    <p className="text-gray-600">+39 333 1234567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@frescofresco.it</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                Orari di Apertura
              </h3>
              
              <div className="space-y-3 text-sm">
                {['Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'].map(day => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">{day}</span>
                    <span className="text-green-600 font-medium">7:00 - 14:00</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-900">Dom - Lun</span>
                  <span className="text-red-600 font-medium">CHIUSO</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="tel:+393331234567" className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  <Phone className="h-4 w-4" /> <span>Chiama Ora</span>
                </a>
                <Link href="/pre-order" className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="h-4 w-4" /> <span>Preordina</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Map and Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                 {/* Qui potresti mettere un iframe di Google Maps */}
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-medium">Mappa Google Maps</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Come Raggiungerci</h3>
                <div className="space-y-2 text-gray-600 text-sm">
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4" /> <span>Parcheggio disponibile nelle vicinanze</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}