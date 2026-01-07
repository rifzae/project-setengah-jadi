
import React, { useMemo } from 'react';
import { Product, Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalCost = sales.reduce((acc, s) => acc + s.totalCost, 0);
    const totalProfit = totalRevenue - totalCost;
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    
    return { totalRevenue, totalProfit, lowStockCount, salesCount: sales.length };
  }, [products, sales]);

  const chartData = useMemo(() => {
    // Group sales by day (last 7 days)
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('id-ID', { weekday: 'short' });
      const daySales = sales.filter(s => {
        const d = new Date(s.timestamp);
        return d.toDateString() === date.toDateString();
      });
      result.push({
        name: dayStr,
        sales: daySales.reduce((acc, s) => acc + s.totalAmount, 0),
        profit: daySales.reduce((acc, s) => acc + s.totalProfit, 0),
      });
    }
    return result;
  }, [sales]);

  const currencyFormat = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pendapatan" value={currencyFormat(stats.totalRevenue)} icon="fa-wallet" color="blue" />
        <StatCard title="Total Keuntungan (Gross)" value={currencyFormat(stats.totalProfit)} icon="fa-sack-dollar" color="green" />
        <StatCard title="Total Transaksi" value={stats.salesCount.toString()} icon="fa-receipt" color="purple" />
        <StatCard title="Stok Menipis" value={stats.lowStockCount.toString()} icon="fa-triangle-exclamation" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-blue-500"></i>
            Performa Penjualan 7 Hari Terakhir
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(v: number) => currencyFormat(v)}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-list-ol text-blue-500"></i>
            Barang Terlaris
          </h3>
          <div className="space-y-4">
             {products.slice(0, 5).map(p => (
               <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.sku}</p>
                    </div>
                 </div>
                 <span className="text-xs font-bold text-slate-700">{p.stock} Tersisa</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string, icon: string, color: string}> = ({ title, value, icon, color }) => {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colorClasses[color]}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
