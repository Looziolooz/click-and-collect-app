"use client";

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Image as ImageIcon, X, Save, Loader2, Link as LinkIcon } from 'lucide-react';

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

  // Stati per il Modale Nuovo Prodotto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    pricePerKg: "",
    unit: "kg",
    category: "general",
    image: "" // Campo Immagine aggiunto
  });

  // --- LOGICA DI CARICAMENTO ---
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

  // --- LOGICA CREAZIONE PRODOTTO ---
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          pricePerKg: parseFloat(newProduct.pricePerKg.replace(',', '.')), // Gestione virgola/punto
          image: newProduct.image.trim() === "" ? null : newProduct.image // Gestione stringa vuota
        })
      });

      if (!res.ok) throw new Error("Errore creazione");

      const createdProduct = await res.json();
      
      // Aggiorna la lista e chiudi modale
      setProducts(prev => [...prev, createdProduct]);
      setIsModalOpen(false);
      // Reset form
      setNewProduct({ name: "", description: "", pricePerKg: "", unit: "kg", category: "general", image: "" }); 
      
    } catch (error) {
      alert("Errore durante la creazione del prodotto.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- ALTRE FUNZIONI ESISTENTI (Toggle, SavePrice, Delete) ---
  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !currentStatus } : p));
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });
    } catch (error) { fetchProducts(); }
  };

  const savePrice = async (id: string, newPrice: string) => {
    const numericPrice = parseFloat(newPrice);
    if (isNaN(numericPrice)) return;
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricePerKg: numericPrice })
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, pricePerKg: numericPrice } : p));
      setEditingPrice(null);
    } catch (error) { alert("Errore salvataggio prezzo"); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert("Errore eliminazione"); }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500 font-mono">Sincronizzazione listino...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-dark font-serif">Listino Giornaliero</h1>
          <p className="text-gray-500 text-sm mt-1">Gestisci disponibilità e prezzi del pescato di oggi.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-blue-light transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus size={20} /> Nuovo Prodotto
        </button>
      </div>

      {/* Toolbar Ricerca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Cerca per nome (es. Orata, Pasta)..." 
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
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-20">Disp.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Prodotto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Prezzo (€)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Azioni</th>
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
                          // eslint-disable-next-line @next/next/no-img-element
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

                  {/* Prezzo Editabile */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group/price w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif">€</span>
                      <input 
                        type="number" step="0.01" disabled={!product.isAvailable}
                        className={`w-full pl-7 pr-8 py-2 rounded-lg border font-mono font-bold text-right outline-none transition-all 
                          ${editingPrice?.id === product.id ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-white' : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50'}
                          ${!product.isAvailable && 'text-gray-400 cursor-not-allowed'}
                        `}
                        value={editingPrice?.id === product.id ? editingPrice.value : Number(product.pricePerKg || 0).toFixed(2)}
                        onFocus={(e) => setEditingPrice({ id: product.id, value: e.target.value })}
                        onChange={(e) => setEditingPrice({ id: product.id, value: e.target.value })}
                        onBlur={(e) => savePrice(product.id, e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { savePrice(product.id, (e.currentTarget as HTMLInputElement).value); (e.currentTarget as HTMLInputElement).blur(); } }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 uppercase">{product.unit}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALE NUOVO PRODOTTO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-serif">Aggiungi Prodotto</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Prodotto</label>
                <input 
                  required autoFocus
                  type="text" 
                  placeholder="Es. Pasta Rummo, Pomodori Pelati"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>

              {/* URL Immagine */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                  <LinkIcon size={14}/> Immagine (URL)
                </label>
                <input 
                  type="url" 
                  placeholder="https://esempio.com/foto-prodotto.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm font-mono text-gray-600"
                  value={newProduct.image}
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Incolla qui il link di un'immagine trovata su internet o dal sito del fornitore.
                </p>
                {/* Preview piccola se c'è un URL valido */}
                {newProduct.image && (
                  <div className="mt-2 h-20 w-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Prezzo (€)</label>
                  <input 
                    required
                    type="number" step="0.01" 
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                    value={newProduct.pricePerKg}
                    onChange={e => setNewProduct({...newProduct, pricePerKg: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Unità</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-white cursor-pointer"
                    value={newProduct.unit}
                    onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    <optgroup label="Peso">
                      <option value="kg">Al Kg</option>
                      <option value="hg">All'Etto</option>
                      <option value="g">Grammi</option>
                    </optgroup>
                    <optgroup label="Confezioni">
                      <option value="pz">Al Pezzo</option>
                      <option value="conf">Confezione</option>
                      <option value="scat">Scatola</option>
                      <option value="bt">Bottiglia</option>
                      <option value="bar">Barattolo</option>
                    </optgroup>
                    <optgroup label="Volume">
                      <option value="l">Litro</option>
                      <option value="ml">Millilitro</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-white cursor-pointer"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="general">Generale / Pescato</option>
                  <option value="premium">Premium / Pregiato</option>
                  <option value="blue">Pesce Azzurro</option>
                  <option value="shellfish">Crostacei / Molluschi</option>
                  <option value="pantry">Dispensa (Pasta, Conserve)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrizione (Opzionale)</label>
                <textarea 
                  rows={2}
                  placeholder="Dettagli aggiuntivi per il cliente..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-blue-dark transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Salva Prodotto</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}