
import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onUpdate: (p: Product) => void;
  onAdd: (p: Product) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onUpdate, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const initialForm = {
    name: '',
    sku: '',
    category: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 5
  };

  const [formData, setFormData] = useState(initialForm);

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData({ ...p });
    } else {
      setEditingProduct(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate({ ...formData, id: editingProduct.id } as Product);
    } else {
      onAdd({ ...formData, id: Math.random().toString(36).substr(2, 9) } as Product);
    }
    setIsModalOpen(false);
  };

  const currencyFormat = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
           <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
           <input 
            type="text" 
            placeholder="Cari barang berdasarkan nama atau SKU..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
           />
        </div>
        <button 
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
        >
          <i className="fa-solid fa-plus"></i> Tambah Barang Baru
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">Produk</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">SKU / Kategori</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-right">HPP (Modal)</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Harga Jual</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Stok</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{p.name}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-600 font-mono bg-slate-100 inline-block px-2 py-0.5 rounded-md mb-1">{p.sku}</p>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{p.category}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-sm font-medium text-slate-500">{currencyFormat(p.costPrice)}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-sm font-black text-slate-900">{currencyFormat(p.sellingPrice)}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                      p.stock <= p.minStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {p.stock} Unit
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => openModal(p)} title="Edit" className="w-9 h-9 flex items-center justify-center hover:bg-blue-100 text-blue-600 rounded-xl transition-all">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button onClick={() => onDelete(p.id)} title="Hapus" className="w-9 h-9 flex items-center justify-center hover:bg-red-100 text-red-600 rounded-xl transition-all">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-scaleIn">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  {editingProduct ? 'Edit Informasi Barang' : 'Tambah Barang Baru'}
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Lengkapi detail barang di bawah ini.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form id="inventory-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nama Barang</label>
                    <input 
                      type="text" required
                      placeholder="Masukkan nama lengkap barang..."
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">SKU / Kode Barang</label>
                    <input 
                      type="text" required
                      placeholder="Contoh: BRG-001"
                      value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Kategori</label>
                    <input 
                      type="text" required
                      placeholder="Contoh: Sembako"
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium"
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-100 md:col-span-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Harga & Stok</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">HPP (Harga Beli/Modal)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                      <input 
                        type="number" required
                        placeholder="0"
                        value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Harga Jual</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 font-black">Rp</span>
                      <input 
                        type="number" required
                        placeholder="0"
                        value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: Number(e.target.value)})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-blue-700 font-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Stok Saat Ini</label>
                    <input 
                      type="number" required
                      placeholder="0"
                      value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Batas Stok Minimum</label>
                    <input 
                      type="number" required
                      placeholder="5"
                      value={formData.minStock} onChange={e => setFormData({...formData, minStock: Number(e.target.value)})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 pt-4 border-t border-slate-100 flex gap-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-[1.25rem] transition-all"
              >
                Batal
              </button>
              <button 
                form="inventory-form"
                type="submit"
                className="flex-[2] px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[1.25rem] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                {editingProduct ? (
                  <><i className="fa-solid fa-save"></i> Simpan Perubahan</>
                ) : (
                  <><i className="fa-solid fa-plus-circle"></i> Tambahkan ke Inventaris</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
