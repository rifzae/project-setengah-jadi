
import React, { useState, useEffect } from 'react';
import { Product, Sale } from '../types';
import { getBusinessInsights } from '../services/geminiService';

interface AIInsightsProps {
  products: Product[];
  sales: Sale[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ products, sales }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getBusinessInsights(products, sales);
    setInsights(result || 'Terjadi kesalahan saat mengambil insight.');
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <i className="fa-solid fa-robot text-9xl"></i>
        </div>
        <h2 className="text-3xl font-black mb-4">Smart Retail Insights</h2>
        <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
          Gunakan kecerdasan buatan Gemini untuk menganalisis stok barang dan tren penjualan toko Anda secara otomatis.
        </p>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="mt-8 bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 rounded-2xl font-black shadow-lg transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          )}
          Refresh Analisis
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          Analisis AI Untuk Anda
        </h3>
        
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <div className="text-slate-600 leading-loose whitespace-pre-line text-lg">
              {insights || "Klik tombol 'Refresh Analisis' untuk melihat rekomendasi bisnis Anda."}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
           <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
             <i className="fa-solid fa-triangle-exclamation"></i>
             Perlu Perhatian Segera
           </h4>
           <p className="text-sm text-amber-700">
             Beberapa barang Anda berada di bawah stok minimum. AI menyarankan untuk segera melakukan restock guna menjaga kepuasan pelanggan.
           </p>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-3xl">
           <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
             <i className="fa-solid fa-star"></i>
             Peluang Profit
           </h4>
           <p className="text-sm text-green-700">
             Cek menu Laporan untuk melihat barang dengan margin tertinggi (Selisih Harga Jual dan HPP). Pertimbangkan untuk mempromosikan produk tersebut.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
