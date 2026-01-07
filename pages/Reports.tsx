
import React from 'react';
import { Sale } from '../types';
import * as XLSX from 'xlsx';

interface ReportsProps {
  sales: Sale[];
}

const Reports: React.FC<ReportsProps> = ({ sales }) => {
  const currencyFormat = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const exportToExcel = () => {
    const reportData = sales.map(s => ({
      'ID Transaksi': s.id,
      'Tanggal': new Date(s.timestamp).toLocaleDateString('id-ID'),
      'Waktu': new Date(s.timestamp).toLocaleTimeString('id-ID'),
      'Daftar Barang': s.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
      'Total Penjualan (Rp)': s.totalAmount,
      'Total HPP/Modal (Rp)': s.totalCost,
      'Laba Kotor (Rp)': s.totalProfit
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    // Calculate Summary
    const totalRev = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalCost = sales.reduce((acc, s) => acc + s.totalCost, 0);
    const totalProfit = totalRev - totalCost;

    const summaryData = [
      [''],
      ['RINGKASAN LAPORAN'],
      ['Total Pendapatan', totalRev],
      ['Total HPP', totalCost],
      ['Total Laba', totalProfit],
    ];

    XLSX.utils.sheet_add_aoa(worksheet, summaryData, { origin: -1 });

    // Save File
    const fileName = `Laporan_Keuangan_Toko_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCost = sales.reduce((acc, s) => acc + s.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm gap-6">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <div>
            <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Akumulasi Penjualan</p>
            <p className="text-3xl font-black text-slate-800">{currencyFormat(totalRevenue)}</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-slate-200 self-center"></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Total HPP</p>
            <p className="text-3xl font-black text-red-500">{currencyFormat(totalCost)}</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-slate-200 self-center"></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Margin Laba</p>
            <p className="text-3xl font-black text-green-600">{currencyFormat(totalProfit)}</p>
          </div>
        </div>
        <button 
          onClick={exportToExcel}
          className="w-full xl:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100"
        >
          <i className="fa-solid fa-file-excel text-xl"></i> Export ke Excel (.xlsx)
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">Waktu Transaksi</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">Rincian Barang</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Penjualan</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-right">HPP (Modal)</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-800">{new Date(s.timestamp).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{new Date(s.timestamp).toLocaleTimeString('id-ID')}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {s.items.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-black border border-blue-100">
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-800">{currencyFormat(s.totalAmount)}</td>
                  <td className="px-8 py-5 text-right text-sm text-slate-400 font-medium">{currencyFormat(s.totalCost)}</td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-black text-green-600">+{currencyFormat(s.totalProfit)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sales.length === 0 && (
          <div className="p-20 text-center text-slate-300">
             <i className="fa-solid fa-receipt text-6xl mb-6 opacity-10"></i>
             <p className="text-lg font-bold">Belum ada data transaksi</p>
             <p className="text-sm">Lakukan penjualan di menu Kasir untuk melihat laporan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
