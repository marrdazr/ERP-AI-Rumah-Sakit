import React, { useState } from 'react';
import { CreditCard, FileCheck, DollarSign, PieChart, Plus, X, Save, User, Calendar, Shield } from 'lucide-react';
import { Invoice } from '../types';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', patientName: 'Siti Aminah', date: '2023-10-25', amount: 15000000, status: 'Pending', insuranceProvider: 'Prudential' },
  { id: 'INV-2023-002', patientName: 'Budi Santoso', date: '2023-10-24', amount: 450000, status: 'Paid' },
  { id: 'INV-2023-003', patientName: 'Dewi Pertiwi', date: '2023-10-23', amount: 8200000, status: 'Claim Submitted', insuranceProvider: 'BPJS Kesehatan' },
  { id: 'INV-2023-004', patientName: 'Rudi Hartono', date: '2023-10-22', amount: 3100000, status: 'Pending', insuranceProvider: 'Allianz' },
];

const STATUS_COLORS = {
  'Paid': '#10b981', // Emerald
  'Pending': '#f59e0b', // Amber
  'Claim Submitted': '#3b82f6', // Blue
};

export const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'Pending',
    insuranceProvider: ''
  });

  const handleAddInvoice = () => {
    if (!newInvoice.patientName || !newInvoice.amount) return;

    const invoiceToAdd: Invoice = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      patientName: newInvoice.patientName!,
      date: newInvoice.date!,
      amount: Number(newInvoice.amount),
      status: newInvoice.status as any,
      insuranceProvider: newInvoice.insuranceProvider || undefined
    };

    setInvoices(prev => [invoiceToAdd, ...prev]);
    setIsAddModalOpen(false);
    setNewInvoice({
        patientName: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        status: 'Pending',
        insuranceProvider: ''
    });
  };

  const calculateChartData = () => {
    const counts = { 'Paid': 0, 'Pending': 0, 'Claim Submitted': 0 };
    invoices.forEach(inv => {
        if (counts[inv.status] !== undefined) counts[inv.status]++;
    });
    return [
        { name: 'Lunas', value: counts['Paid'] },
        { name: 'Tertunda', value: counts['Pending'] },
        { name: 'Klaim Diajukan', value: counts['Claim Submitted'] }
    ];
  };

  const chartData = calculateChartData();
  const totalReceivable = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                <CreditCard className="w-8 h-8 text-nexus-400" /> Siklus Pendapatan (RCM)
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Manajemen tagihan dan klaim asuransi terintegrasi.</p>
        </div>
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-nexus-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:scale-[1.02] transition-all font-bold border border-white/10"
        >
            <Plus className="w-5 h-5" /> Buat Faktur Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-nexus-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <DollarSign className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Total Piutang</p>
                    <p className="text-2xl font-bold text-white tracking-tight">
                         {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalReceivable)}
                    </p>
                </div>
            </div>
        </div>
        <div className="bg-nexus-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <FileCheck className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Klaim Disetujui</p>
                    <p className="text-2xl font-bold text-white tracking-tight">82%</p>
                </div>
            </div>
        </div>
        {/* Simple Analytics Chart */}
        <div className="md:col-span-2 bg-nexus-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg flex items-center px-6 relative overflow-hidden">
             <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500 opacity-30"></div>
             <div className="flex-1 py-4">
                 <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-nexus-400" /> Distribusi Status Faktur
                 </h4>
                 <div className="h-24 w-full flex items-center">
                    <div className="h-full w-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie 
                                    data={chartData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={25} 
                                    outerRadius={35} 
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
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
                    <div className="ml-6 space-y-1.5 border-l border-white/10 pl-6">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div> Lunas ({chartData[0].value})</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div> Tertunda ({chartData[1].value})</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div> Klaim Diajukan ({chartData[2].value})</div>
                    </div>
                 </div>
             </div>
        </div>
      </div>

      <div className="bg-nexus-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-500 via-teal-400 to-nexus-500 opacity-20"></div>
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="font-semibold text-white text-lg">Faktur & Klaim Terbaru</h3>
            <button className="text-xs text-nexus-400 hover:text-white transition-colors uppercase font-bold tracking-wider">Lihat Semua</button>
        </div>
        <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-nexus-900/80 text-slate-400 sticky top-0 z-10 uppercase tracking-wider text-xs font-bold border-b border-white/5">
                    <tr>
                        <th className="p-5">ID Faktur</th>
                        <th className="p-5">Pasien</th>
                        <th className="p-5">Tanggal</th>
                        <th className="p-5">Penjamin / Asuransi</th>
                        <th className="p-5 text-right">Jumlah (IDR)</th>
                        <th className="p-5 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/5 transition-all duration-200 group">
                            <td className="p-5 font-mono text-nexus-400 group-hover:text-nexus-300 font-medium">{inv.id}</td>
                            <td className="p-5 font-medium text-white">{inv.patientName}</td>
                            <td className="p-5 text-slate-400">{inv.date}</td>
                            <td className="p-5 text-slate-400">
                                {inv.insuranceProvider ? (
                                    <span className="flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-emerald-400" /> {inv.insuranceProvider}
                                    </span>
                                ) : (
                                    <span className="text-slate-600 italic">Pribadi</span>
                                )}
                            </td>
                            <td className="p-5 text-right font-mono font-bold text-slate-200">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(inv.amount)}
                            </td>
                            <td className="p-5 text-center">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border shadow-sm ${
                                    inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                                    inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                                }`}>
                                    {inv.status === 'Paid' ? 'Lunas' : 
                                     inv.status === 'Pending' ? 'Tertunda' : 'Klaim Diajukan'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add New Invoice Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-nexus-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden scale-100 animate-in zoom-in-95 duration-300 relative">
                {/* Decoration Lights */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-nexus-500 to-transparent opacity-50"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-nexus-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
                    <div>
                        <h3 className="font-bold text-2xl text-white tracking-tight">Buat Faktur Baru</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Sistem Penagihan Terpadu</p>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(false)}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                             <label className="text-xs font-bold text-nexus-400 uppercase tracking-widest mb-2 block">Nama Pasien</label>
                             <div className="relative group">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-nexus-400 transition-colors" />
                                <input 
                                    type="text" 
                                    value={newInvoice.patientName}
                                    onChange={(e) => setNewInvoice({...newInvoice, patientName: e.target.value})}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all placeholder-slate-600"
                                    placeholder="Cari nama pasien..."
                                />
                             </div>
                        </div>

                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Tanggal Faktur</label>
                             <div className="relative group">
                                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
                                <input 
                                    type="date"
                                    value={newInvoice.date}
                                    onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})} 
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-nexus-500 outline-none"
                                />
                             </div>
                        </div>

                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Status Pembayaran</label>
                             <div className="relative">
                                <select 
                                    value={newInvoice.status}
                                    onChange={(e) => setNewInvoice({...newInvoice, status: e.target.value as any})}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-nexus-500 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Pending">Tertunda (Pending)</option>
                                    <option value="Paid">Lunas (Paid)</option>
                                    <option value="Claim Submitted">Klaim Asuransi</option>
                                </select>
                             </div>
                        </div>

                        <div className="col-span-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asuransi / Penjamin</label>
                             <div className="relative group">
                                <Shield className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input 
                                    type="text" 
                                    value={newInvoice.insuranceProvider}
                                    onChange={(e) => setNewInvoice({...newInvoice, insuranceProvider: e.target.value})}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all placeholder-slate-600"
                                    placeholder="Kosongkan jika pasien umum/pribadi"
                                />
                             </div>
                        </div>

                        <div className="col-span-2 bg-gradient-to-r from-nexus-900 to-slate-900 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-500/10 rounded-full blur-3xl"></div>
                            <label className="text-xs font-bold text-nexus-400 uppercase tracking-widest mb-3 block">Total Tagihan (IDR)</label>
                            <div className="relative flex items-center">
                                <span className="text-2xl font-bold text-slate-500 mr-2">Rp</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={newInvoice.amount}
                                    onChange={(e) => setNewInvoice({...newInvoice, amount: parseInt(e.target.value)})}
                                    className="w-full bg-transparent border-none text-4xl font-mono font-bold text-white focus:ring-0 outline-none placeholder-slate-700"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 py-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-semibold"
                        >
                            Batalkan
                        </button>
                        <button 
                            onClick={handleAddInvoice}
                            disabled={!newInvoice.patientName || !newInvoice.amount}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-nexus-600 to-teal-600 text-white font-bold hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" /> Simpan Faktur
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};