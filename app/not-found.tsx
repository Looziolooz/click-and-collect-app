import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-3">
          <h1 className="text-8xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Pagina Non Trovata</h2>
          <p className="text-gray-500">La pagina che cerchi non esiste o è stata spostata.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}