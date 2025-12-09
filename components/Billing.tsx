import React from 'react';
import { CreditCard, FileCheck, DollarSign, PieChart } from 'lucide-react';
import { Invoice } from '../types';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', patientName: 'Sarah W.', date: '2023-10-25', amount: 15000000, status: 'Pending', insuranceProvider: 'Prudential' },
  { id: 'INV-2023-002', patientName: 'James B.', date: '2023-10-24', amount: 450000, status: 'Paid' },
  { id: 'INV-2023-003', patientName: 'Diana P.', date: '2023-10-23', amount: 8200000, status: 'Claim Submitted', insuranceProvider: 'BPJS Kesehatan' },
  { id: 'INV-2023-004', patientName: 'Michael R.', date: '2023-10-22', amount: 3100000, status: 'Pending', insuranceProvider: 'Allianz' },
];

const STATUS_COLORS = {
  'Paid': '#10b981', // Emerald
  'Pending': '#f59e0b', // Amber
  'Claim Submitted': '#3b82f6', // Blue
};

const CHART_DATA = [
  { name: 'Paid', value: 1 },
  { name: 'Pending', value: 2 },
  { name: 'Claim Submitted', value: 1 },
];

export const Billing: React.FC = () => {
  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-hidden">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-nexus-400" /> Revenue Cycle Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-nexus-800 p-4 rounded-xl border border-nexus-700 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400">Total Receivables</p>
                    <p className="text-xl font-bold text-white">IDR 26.75M</p>
                </div>
            </div>
        </div>
        <div className="bg-nexus-800 p-4 rounded-xl border border-nexus-700 shadow-lg">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                    <FileCheck className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400">Claims Approved</p>
                    <p className="text-xl font-bold text-white">82%</p>
                </div>
            </div>
        </div>
        {/* Simple Analytics Chart */}
        <div className="md:col-span-2 bg-nexus-800 rounded-xl border border-nexus-700 shadow-lg flex items-center px-4 relative">
             <div className="flex-1">
                 <h4 className="text-sm font-semibold text-slate-300">Invoice Status Distribution</h4>
                 <div className="h-20 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie 
                                data={CHART_DATA} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={25} 
                                outerRadius={35} 
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {CHART_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={Object.values(STATUS_COLORS)[index]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </RePieChart>
                    </ResponsiveContainer>
                 </div>
             </div>
             <div className="text-right">
                 <p className="text-xs text-slate-500">Outstanding</p>
                 <p className="text-lg font-bold text-amber-500">12 Pending</p>
             </div>
        </div>
      </div>

      <div className="bg-nexus-800 rounded-xl border border-nexus-700 shadow-lg flex-1 flex flex-col">
        <div className="p-4 border-b border-nexus-700">
            <h3 className="font-semibold text-slate-200">Recent Invoices & Claims</h3>
        </div>
        <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-nexus-900/50 text-slate-400 sticky top-0 z-10">
                    <tr>
                        <th className="p-4 font-medium">Invoice ID</th>
                        <th className="p-4 font-medium">Patient</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Payer / Insurance</th>
                        <th className="p-4 font-medium text-right">Amount (IDR)</th>
                        <th className="p-4 font-medium text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-nexus-700/50">
                    {MOCK_INVOICES.map((inv) => (
                        <tr key={inv.id} className="hover:bg-nexus-700/30 transition-colors group">
                            <td className="p-4 font-mono text-nexus-400">{inv.id}</td>
                            <td className="p-4 font-medium text-white">{inv.patientName}</td>
                            <td className="p-4 text-slate-400">{inv.date}</td>
                            <td className="p-4 text-slate-400">{inv.insuranceProvider || 'Self-Pay'}</td>
                            <td className="p-4 text-right font-mono font-medium">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(inv.amount)}
                            </td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                                    inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {inv.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};