"use client";

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Package, Trash2, Image as ImageIcon, Save, RefreshCw, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  unit: string;
  category: string;
  isAvailable: boolean;
  image: string | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editingPrice, setEditingPrice] = useState<{ id: string, value: string } | null>(null);

  // Caricamento Iniziale
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Gestione Rapida Disponibilità (Toggle)
  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    // 1. Aggiornamento Ottimistico (Feedback immediato UI)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !currentStatus } : p));

    // 2. Chiamata API Background
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });
    } catch (error) {
      alert("Errore aggiornamento disponibilità");
      fetchProducts(); // Revert in caso di errore
    }
  };

  // Gestione Salvataggio Prezzo
  const savePrice = async (id: string, newPrice: string) => {
    const numericPrice = parseFloat(newPrice);
    if (isNaN(numericPrice)) return;

    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricePerKg: numericPrice })
      });
      
      // Aggiorna lo stato locale pulito
      setProducts(prev => prev.map(p => p.id === id ? { ...p, pricePerKg: numericPrice } : p));
      setEditingPrice(null);
    } catch (error) {
      alert("Errore salvataggio prezzo");
    }
  };

  // Funzione per eliminare prodotto
  const deleteProduct = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert("Errore eliminazione"); }
  };

  // Prodotti filtrati per la ricerca
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500 font-mono">Sincronizzazione listino...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-dark font-serif">Listino Giornaliero</h1>
          <p className="text-gray-500 text-sm mt-1">Gestisci disponibilità e prezzi del pescato di oggi.</p>
        </div>
        <button onClick={() => alert("Funzionalità 'Nuovo Prodotto' da implementare nel modale")} className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-blue-light transition-colors flex items-center gap-2 shadow-md">
          <Plus size={20} /> Nuovo Prodotto
        </button>
      </div>

      {/* Toolbar Ricerca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Cerca per nome (es. Orata)..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none shadow-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Grid Prodotti */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Disp.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prodotto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prezzo (€/Kg)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`group transition-colors ${!product.isAvailable ? 'bg-gray-50 opacity-75' : 'hover:bg-blue-50/30'}`}>
                  
                  {/* Toggle Disponibilità */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleAvailability(product.id, product.isAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>

                  {/* Info Prodotto */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center text-gray-400">
                        {product.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        ) : <ImageIcon size={20} />}
                      </div>
                      <div className="ml-4">
                        <div className={`font-bold ${product.isAvailable ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>

                  {/* Editing Prezzo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="relative group/price">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif">€</span>
                      <input 
                        type="number"
                        step="0.50"
                        disabled={!product.isAvailable}
                        className={`w-28 pl-7 pr-2 py-2 rounded-lg border font-mono font-bold text-right outline-none transition-all 
                          ${editingPrice?.id === product.id ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-white' : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50'}
                          ${!product.isAvailable && 'text-gray-400 cursor-not-allowed'}
                        `}
                        // CORREZIONE QUI SOTTO: Aggiunto Number()
                        value={editingPrice?.id === product.id ? editingPrice.value : Number(product.pricePerKg || 0).toFixed(2)}
                        onFocus={(e) => setEditingPrice({ id: product.id, value: e.target.value })}
                        onChange={(e) => setEditingPrice({ id: product.id, value: e.target.value })}
                        onBlur={(e) => savePrice(product.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            savePrice(product.id, (e.currentTarget as HTMLInputElement).value);
                            (e.currentTarget as HTMLInputElement).blur();
                          }
                        }}
                      />
                      <span className="text-xs text-gray-400 ml-1">/{product.unit}</span>
                    </div>
                  </div>
                </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                      title="Elimina prodotto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-gray-400">Nessun prodotto trovato.</div>
        )}
      </div>
    </div>
  );
}