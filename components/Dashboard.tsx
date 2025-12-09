import React from 'react';
import { Users, Activity, AlertCircle, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { name: 'Mon', admitted: 40, discharged: 24, er: 65 },
  { name: 'Tue', admitted: 30, discharged: 13, er: 50 },
  { name: 'Wed', admitted: 20, discharged: 38, er: 80 },
  { name: 'Thu', admitted: 27, discharged: 39, er: 40 },
  { name: 'Fri', admitted: 18, discharged: 48, er: 70 },
  { name: 'Sat', admitted: 23, discharged: 38, er: 90 },
  { name: 'Sun', admitted: 34, discharged: 43, er: 60 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-white">Hospital Overview</h1>
        <p className="text-slate-400">Welcome back, Dr. Administrator. System status is optimal.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
            { label: 'Total Patients', value: '1,284', sub: '+12% this week', icon: Users, color: 'text-nexus-400', bg: 'bg-nexus-500/10' },
            { label: 'Bed Occupancy', value: '87%', sub: 'Critical Level > 90%', icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Revenue (MTD)', value: '$2.4M', sub: '+5% vs Target', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Pending Claims', value: '42', sub: 'Action Required', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((kpi, i) => (
            <div key={i} className="bg-nexus-800 p-5 rounded-xl border border-nexus-700 shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">{kpi.label}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
                        <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${kpi.bg}`}>
                        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="flex-1 bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg min-h-[300px] flex flex-col">
        <div className="mb-4 flex justify-between items-center">
            <h3 className="font-semibold text-white">Patient Flow Analytics</h3>
            <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-nexus-400"></div> ER Visits</span>
                <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Discharges</span>
            </div>
        </div>
        <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA}>
                    <defs>
                        <linearGradient id="colorEr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="er" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorEr)" />
                    <Area type="monotone" dataKey="discharged" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDis)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};