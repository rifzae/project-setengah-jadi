import React, { useState, useEffect } from 'react';
import { Product, Sale, View } from './types';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Reports from './pages/Reports';
import Login from './pages/Login'; // Import halaman Login
import Sidebar from './components/Sidebar';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Minyak Goreng 1L', sku: 'MG001', category: 'Sembako', costPrice: 14000, sellingPrice: 18000, stock: 50, minStock: 10 },
  { id: '2', name: 'Beras Pandan Wangi 5kg', sku: 'BR002', category: 'Sembako', costPrice: 65000, sellingPrice: 75000, stock: 20, minStock: 5 },
  { id: '3', name: 'Gula Pasir 1kg', sku: 'GL003', category: 'Sembako', costPrice: 12500, sellingPrice: 16000, stock: 100, minStock: 20 },
  { id: '4', name: 'Susu UHT 1L', sku: 'SS004', category: 'Minuman', costPrice: 15000, sellingPrice: 21000, stock: 15, minStock: 5 },
];

const App: React.FC = () => {
  // --- STATE LOGIN ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Cek apakah user pernah login sebelumnya (disimpan di localStorage)
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('retail_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('retail_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  useEffect(() => {
    localStorage.setItem('retail_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('retail_sales', JSON.stringify(sales));
  }, [sales]);

  const addSale = (newSale: Sale) => {
    setSales(prev => [newSale, ...prev]);
    setProducts(prev => prev.map(p => {
      const item = newSale.items.find(si => si.productId === p.id);
      if (item) {
        return { ...p, stock: p.stock - item.quantity };
      }
      return p;
    }));
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const addProduct = (newP: Product) => {
    setProducts(prev => [...prev, newP]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Hapus sesi
    setIsAuthenticated(false);
  };

  // --- LOGIC TAMPILAN ---
  
  // Jika belum login, tampilkan halaman Login
  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  // Jika sudah login, tampilkan App Utama
  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard products={products} sales={sales} />;
      case View.INVENTORY:
        return (
          <Inventory 
            products={products} 
            onUpdate={updateProduct} 
            onAdd={addProduct} 
            onDelete={deleteProduct} 
          />
        );
      case View.POS:
        return <POS products={products} onCheckout={addSale} />;
      case View.REPORTS:
        return <Reports sales={sales} />;
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">
            {currentView === View.DASHBOARD && "Ringkasan Bisnis"}
            {currentView === View.INVENTORY && "Manajemen Stok"}
            {currentView === View.POS && "Kasir (POS)"}
            {currentView === View.REPORTS && "Laporan Keuangan"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Admin
            </div>
            {/* Tombol Logout Baru */}
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
