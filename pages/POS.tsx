
import React, { useState, useMemo } from 'react';
import { Product, Sale, SaleItem } from '../types';

interface POSProps {
  products: Product[];
  onCheckout: (sale: Sale) => void;
}

const POS: React.FC<POSProps> = ({ products, onCheckout }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Stok barang habis!");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
            alert("Tidak bisa melebihi stok tersedia!");
            return prev;
        }
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } 
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.sellingPrice,
        cost: product.costPrice,
        subtotal: product.sellingPrice
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const prod = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (prod && newQty > prod.stock) {
           alert("Stok tidak mencukupi");
           return item;
        }
        return { ...item, quantity: newQty, subtotal: newQty * item.price };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const totalCost = cart.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
    
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      items: cart,
      totalAmount,
      totalCost,
      totalProfit: totalAmount - totalCost
    };

    onCheckout(newSale);
    setCart([]);
    alert("Transaksi Berhasil!");
  };

  const currencyFormat = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full max-h-[calc(100vh-160px)]">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col gap-6 min-h-0">
        <div className="relative group">
          <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Ketik nama barang atau scan kode barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-6 flex-1 custom-scrollbar">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <button 
                key={p.id}
                onClick={() => addToCart(p)}
                className={`p-5 bg-white border rounded-[1.5rem] text-left hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden flex flex-col justify-between h-48 ${
                  p.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'border-slate-100'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{p.category}</p>
                    {p.stock <= p.minStock && (
                      <i className="fa-solid fa-circle-exclamation text-amber-500 animate-pulse"></i>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">{p.name}</h4>
                </div>
                
                <div className="mt-auto">
                  <p className="text-xl font-black text-slate-900 group-hover:scale-105 origin-left transition-transform">{currencyFormat(p.sellingPrice)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black ${
                        p.stock <= p.minStock ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                      Stok: {p.stock}
                    </span>
                  </div>
                </div>

                <div className="absolute right-3 bottom-3 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-lg shadow-blue-300">
                  <i className="fa-solid fa-cart-plus text-sm"></i>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <i className="fa-solid fa-box-open text-6xl mb-6 opacity-20"></i>
              <p className="text-lg font-bold">Barang tidak ditemukan</p>
              <p className="text-sm">Coba kata kunci lain atau periksa penulisan SKU.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart / Bill */}
      <div className="w-full lg:w-[400px] bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-slideIn">
        <div className="p-8 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800">Tagihan</h3>
            <p className="text-xs text-slate-500 font-medium">Customer: Guest</p>
          </div>
          <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm">
            {cart.length}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center px-4">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-shopping-basket text-4xl opacity-20"></i>
              </div>
              <p className="text-sm font-bold text-slate-400">Keranjang masih kosong</p>
              <p className="text-xs mt-1">Pilih barang untuk memulai transaksi baru</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex gap-4 group animate-fadeIn">
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{item.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{currencyFormat(item.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 flex items-center justify-center transition-all">-</button>
                    <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 flex items-center justify-center transition-all">+</button>
                  </div>
                  <p className="text-sm font-black text-slate-900">{currencyFormat(item.subtotal)}</p>
                  <button onClick={() => removeFromCart(item.productId)} className="text-[10px] text-red-500 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-all">Hapus Item</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-slate-700">{currencyFormat(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span className="font-medium">Diskon</span>
              <span className="font-bold text-green-600">-Rp 0</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Bayar</span>
              <span className="text-3xl font-black text-blue-600 tabular-nums">{currencyFormat(totalAmount)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full py-5 rounded-[1.5rem] font-black text-white text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${
              cart.length === 0 ? 'bg-slate-300 cursor-not-allowed grayscale' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-300/50 hover:-translate-y-1'
            }`}
          >
            <i className="fa-solid fa-check-circle"></i>
            PROSES PEMBAYARAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
