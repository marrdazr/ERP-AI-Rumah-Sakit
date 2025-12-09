import React from 'react';
import { Users, Activity, AlertCircle, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { name: 'Sen', admitted: 40, discharged: 24, er: 65 },
  { name: 'Sel', admitted: 30, discharged: 13, er: 50 },
  { name: 'Rab', admitted: 20, discharged: 38, er: 80 },
  { name: 'Kam', admitted: 27, discharged: 39, er: 40 },
  { name: 'Jum', admitted: 18, discharged: 48, er: 70 },
  { name: 'Sab', admitted: 23, discharged: 38, er: 90 },
  { name: 'Min', admitted: 34, discharged: 43, er: 60 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="h-full p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      <div className="mb-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Ringkasan Rumah Sakit</h1>
        <p className="text-slate-400 mt-2 text-lg">Selamat datang kembali, Dr. Administrator. Status sistem optimal.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: 'Total Pasien', value: '1,284', sub: '+12% minggu ini', icon: Users, color: 'text-nexus-400', bg: 'bg-nexus-500/10 border-nexus-500/20' },
            { label: 'Okupansi Bed (BOR)', value: '87%', sub: 'Level Kritis > 90%', icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            { label: 'Pendapatan (Bulan Ini)', value: 'Rp 2.4M', sub: '+5% vs Target', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Klaim Tertunda', value: '42', sub: 'Butuh Tindakan', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((kpi, i) => (
            <div key={i} className={`p-6 rounded-2xl border backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 ${kpi.bg}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{kpi.label}</p>
                        <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">{kpi.value}</h3>
                        <p className="text-xs text-slate-400 mt-2 font-medium">{kpi.sub}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-black/20 backdrop-blur-sm`}>
                        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="flex-1 bg-nexus-900/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl min-h-[350px] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-500 via-teal-400 to-nexus-500 opacity-50"></div>
        <div className="mb-6 flex justify-between items-center">
            <h3 className="font-semibold text-xl text-white tracking-tight">Analitik Alur Pasien</h3>
            <div className="flex gap-4">
                <span className="flex items-center gap-2 text-sm text-slate-400 font-medium"><div className="w-3 h-3 rounded-full bg-nexus-400 shadow-[0_0_10px_#0ea5e9]"></div> Kunjungan UGD</span>
                <span className="flex items-center gap-2 text-sm text-slate-400 font-medium"><div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"></div> Pasien Pulang</span>
            </div>
        </div>
        <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA}>
                    <defs>
                        <linearGradient id="colorEr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 500}} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 500}} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
                    />
                    <Area type="monotone" dataKey="er" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorEr)" />
                    <Area type="monotone" dataKey="discharged" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDis)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};