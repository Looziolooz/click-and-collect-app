"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', pricePerKg: '', category: 'premium' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const handleCreate = async () => {
    await fetch('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(newProduct)
    });
    setIsCreating(false);
    setNewProduct({ name: '', description: '', pricePerKg: '', category: 'premium' });
    loadProducts();
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editForm)
    });
    setEditingId(null);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    loadProducts();
  };

  const toggleAvailability = async (product: any) => {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isAvailable: !product.isAvailable })
    });
    loadProducts();
  };

  const startEditing = (product: any) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif text-gray-900">Gestione Prodotti</h1>
        <button onClick={() => setIsCreating(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
          <Plus size={20} /> Nuovo Prodotto
        </button>
      </div>

      {/* Form Creazione */}
      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200 mb-8 animate-in fade-in">
          <h3 className="font-bold text-lg mb-4">Nuovo Pesce</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input placeholder="Nome (es. Orata)" className="border p-2 rounded" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input placeholder="Prezzo al Kg" type="number" className="border p-2 rounded" value={newProduct.pricePerKg} onChange={e => setNewProduct({...newProduct, pricePerKg: e.target.value})} />
            <select className="border p-2 rounded" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
              <option value="premium">Premium (Orate, Spigole...)</option>
              <option value="blue">Pesce Azzurro</option>
              <option value="shellfish">Crostacei/Molluschi</option>
            </select>
            <input placeholder="Descrizione breve" className="border p-2 rounded" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Annulla</button>
            <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded font-bold">Salva Prodotto</button>
          </div>
        </div>
      )}

      {/* Lista Prodotti */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((p) => (
          <div key={p.id} className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row items-center gap-4 ${!p.isAvailable ? 'opacity-60 bg-gray-50' : ''}`}>
            
            {/* Immagine Placeholder */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>

            {editingId === p.id ? (
              // Modalità Modifica
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <input className="border p-2 rounded" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                <input className="border p-2 rounded" type="number" value={editForm.pricePerKg} onChange={e => setEditForm({...editForm, pricePerKg: e.target.value})} />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(p.id)} className="bg-blue-600 text-white p-2 rounded flex-1 flex justify-center"><Save size={18}/></button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 p-2 rounded flex-1 flex justify-center"><X size={18}/></button>
                </div>
              </div>
            ) : (
              // Modalità Visualizzazione
              <>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-gray-500 text-sm">€ {Number(p.pricePerKg).toFixed(2)} / {p.unit}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleAvailability(p)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${p.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {p.isAvailable ? 'DISPONIBILE' : 'ESAURITO'}
                  </button>
                  
                  <button onClick={() => startEditing(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18}/></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}