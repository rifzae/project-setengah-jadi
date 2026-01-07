
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Beranda', icon: 'fa-chart-pie' },
    { id: View.INVENTORY, label: 'Inventaris', icon: 'fa-boxes-stacked' },
    { id: View.POS, label: 'Kasir', icon: 'fa-cash-register' },
    { id: View.REPORTS, label: 'Laporan', icon: 'fa-file-invoice-dollar' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
          <i className="fa-solid fa-store text-xl"></i>
        </div>
        <div>
          <h2 className="text-white font-bold leading-tight">Smart Retail</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">Pro Management</p>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center text-lg ${
              currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
            }`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">PENGGUNA</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <i className="fa-solid fa-user text-xs"></i>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">Administrator</p>
              <p className="text-[10px] text-slate-500">Manager Toko</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
