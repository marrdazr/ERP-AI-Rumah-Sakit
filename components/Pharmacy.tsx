import React, { useState } from 'react';
import { Package, TrendingUp, RefreshCw, Plus, Minus, Edit, X, Save, AlertTriangle, Calendar, Hash, Tag } from 'lucide-react';
import { InventoryItem, PredictionResult } from '../types';
import { predictStockNeeds } from '../services/geminiService';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Paracetamol 500mg', sku: 'MED-001', category: 'Medicine', batchNumber: 'B8291', expiryDate: '2025-12-01', stockLevel: 120, unit: 'Box', reorderLevel: 200, monthlyUsage: [150, 180, 210, 190, 240, 300] },
  { id: '2', name: 'Amoxicillin 250mg', sku: 'MED-002', category: 'Medicine', batchNumber: 'B2211', expiryDate: '2024-06-15', stockLevel: 45, unit: 'Box', reorderLevel: 50, monthlyUsage: [40, 45, 42, 48, 50, 55] },
  { id: '3', name: 'Sarung Tangan Medis (L)', sku: 'CON-105', category: 'Consumable', batchNumber: 'G9921', expiryDate: '2026-01-01', stockLevel: 800, unit: 'Pair', reorderLevel: 500, monthlyUsage: [400, 420, 380, 410, 390, 405] },
  { id: '4', name: 'Insulin Glargine', sku: 'MED-055', category: 'Medicine', batchNumber: 'B7721', expiryDate: '2024-08-20', stockLevel: 12, unit: 'Vial', reorderLevel: 30, monthlyUsage: [20, 25, 22, 28, 30, 35] },
];

export const Pharmacy: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  
  // State for Adjustment Modal
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'reduce'>('add');
  const [adjustQty, setAdjustQty] = useState<string>('');

  // State for Add New Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    sku: '',
    category: 'Medicine',
    batchNumber: '',
    expiryDate: '',
    stockLevel: 0,
    unit: 'Pcs',
    reorderLevel: 10
  });

  const handlePredict = async () => {
    setAnalyzing(true);
    try {
      const results = await predictStockNeeds(inventory);
      setPredictions(results);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const openAdjustModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustType('add');
    setAdjustQty('');
  };

  const handleSaveAdjustment = () => {
    if (!selectedItem || !adjustQty) return;
    
    const qty = parseInt(adjustQty);
    if (isNaN(qty) || qty <= 0) return;

    setInventory(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        let newStock = item.stockLevel;
        if (adjustType === 'add') {
          newStock += qty;
        } else {
          newStock = Math.max(0, item.stockLevel - qty);
        }
        return { ...item, stockLevel: newStock };
      }
      return item;
    }));

    setSelectedItem(null);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku) return;

    const itemToAdd: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name!,
      sku: newItem.sku!,
      category: newItem.category as any,
      batchNumber: newItem.batchNumber || 'N/A',
      expiryDate: newItem.expiryDate || new Date().toISOString().split('T')[0],
      stockLevel: Number(newItem.stockLevel) || 0,
      unit: newItem.unit || 'Pcs',
      reorderLevel: Number(newItem.reorderLevel) || 10,
      monthlyUsage: [0, 0, 0, 0, 0, 0] // Default empty history
    };

    setInventory(prev => [itemToAdd, ...prev]);
    setIsAddModalOpen(false);
    setNewItem({
        name: '', sku: '', category: 'Medicine', batchNumber: '', expiryDate: '', stockLevel: 0, unit: 'Pcs', reorderLevel: 10
    });
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-hidden relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <Package className="w-8 h-8 text-nexus-400" /> Farmasi & Inventaris
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Valuasi stok real-time dan pelacakan kedaluwarsa.</p>
        </div>
        <div className="flex gap-3">
            <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-nexus-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-[1.02] transition-all font-bold border border-white/10"
            >
            <Plus className="w-5 h-5" /> Tambah Obat
            </button>
            <button 
            onClick={handlePredict}
            disabled={analyzing}
            className="flex items-center gap-2 bg-nexus-900/50 backdrop-blur border border-nexus-500/50 text-nexus-400 px-5 py-2.5 rounded-xl hover:bg-nexus-500/10 transition-all font-medium shadow-lg shadow-nexus-500/10"
            >
            {analyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
            {analyzing ? 'Menganalisis...' : 'Prediksi AI'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Inventory Table */}
        <div className="lg:col-span-2 bg-nexus-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
             <h3 className="font-semibold text-white text-lg">Buku Besar Stok</h3>
             <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Live Sync Active</span>
          </div>
          <div className="overflow-auto flex-1 custom-scrollbar relative z-10">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-nexus-900/90 backdrop-blur text-slate-400 sticky top-0 z-10 uppercase tracking-wider text-xs border-b border-white/5">
                <tr>
                  <th className="p-4 font-bold">Nama Item</th>
                  <th className="p-4 font-bold">Batch</th>
                  <th className="p-4 font-bold">Exp. Date</th>
                  <th className="p-4 font-bold text-right">Stok</th>
                  <th className="p-4 font-bold text-right">Status</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-all duration-200 group">
                    <td className="p-4 font-medium text-white group-hover:text-nexus-300 transition-colors">{item.name}</td>
                    <td className="p-4 font-mono text-slate-500 text-xs">{item.batchNumber}</td>
                    <td className="p-4 text-slate-400">{item.expiryDate}</td>
                    <td className="p-4 text-right font-mono text-slate-200 font-bold">{item.stockLevel} <span className="text-slate-500 text-xs font-normal">{item.unit}</span></td>
                    <td className="p-4 text-right">
                      {item.stockLevel < item.reorderLevel ? (
                        <span className="text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md text-xs border border-red-500/20 font-bold shadow-[0_0_10px_rgba(248,113,113,0.1)]">Stok Rendah</span>
                      ) : (
                        <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md text-xs border border-emerald-500/20 font-bold shadow-[0_0_10px_rgba(52,211,153,0.1)]">Aman</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => openAdjustModal(item)}
                        className="p-2 hover:bg-nexus-500/20 rounded-lg text-nexus-400 hover:text-white transition-all border border-transparent hover:border-nexus-500/30 hover:shadow-lg hover:scale-110"
                        title="Sesuaikan Stok"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="bg-nexus-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-500 via-teal-400 to-nexus-500 opacity-30"></div>
          <div className="p-5 border-b border-white/10 bg-white/5">
            <h3 className="font-semibold text-nexus-400 flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" /> Perkiraan Permintaan
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {!analyzing && predictions.length === 0 && (
              <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-600" />
                </div>
                <p className="font-medium text-slate-400">Model Prediksi Siaga</p>
                <p className="text-sm mt-2 opacity-60 max-w-[200px]">Sistem AI siap menganalisis tren penggunaan historis Anda.</p>
              </div>
            )}
            
            {predictions.map((pred, idx) => (
              <div key={idx} className="bg-gradient-to-br from-nexus-900/80 to-slate-900/80 p-4 rounded-xl border-l-4 border-nexus-500 shadow-lg hover:shadow-nexus-500/10 transition-all animate-in fade-in slide-in-from-right duration-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-sm">{pred.itemName}</h4>
                  <span className="text-[10px] bg-nexus-500 text-white px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(14,165,233,0.4)]">
                    +{pred.predictedDemand} Unit
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3 leading-relaxed">{pred.recommendation}</p>
                <div className="text-xs text-slate-400 italic bg-black/20 p-2.5 rounded-lg border border-white/5 flex gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                  "{pred.reasoning}"
                </div>
              </div>
            ))}
            
            {/* Visualizer for first item if available */}
            {inventory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-bold flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" /> Tren Penggunaan: {inventory[0].name}
                    </h4>
                    <div className="h-40 w-full bg-black/20 rounded-xl p-2 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inventory[0].monthlyUsage.map((val, i) => ({ month: i, val }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                <XAxis dataKey="month" hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#bae6fd' }}
                                    cursor={{fill: '#334155', opacity: 0.2}}
                                />
                                <Bar dataKey="val" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1}/>
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.6}/>
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-nexus-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden scale-100 animate-in zoom-in-95 duration-300 relative">
                {/* Modal Glow Effect */}
                <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-nexus-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
                    <div>
                        <h3 className="font-bold text-2xl text-white tracking-tight">Katalog Obat Baru</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Entri Master Data Farmasi</p>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(false)}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-6 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                             <label className="text-xs font-bold text-nexus-400 uppercase tracking-widest mb-2 block">Nama Produk</label>
                             <div className="relative group">
                                <Package className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-nexus-400 transition-colors" />
                                <input 
                                    type="text" 
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all"
                                    placeholder="Contoh: Amoxicillin 500mg"
                                />
                             </div>
                        </div>

                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-white transition-colors">SKU / Kode</label>
                             <div className="relative group">
                                <Hash className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text"
                                    value={newItem.sku}
                                    onChange={(e) => setNewItem({...newItem, sku: e.target.value})} 
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-200 font-mono text-sm focus:border-nexus-500 outline-none"
                                    placeholder="MED-XXX"
                                />
                             </div>
                        </div>

                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Kategori</label>
                             <div className="relative">
                                <Tag className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                <select 
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({...newItem, category: e.target.value as any})}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-nexus-500 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Medicine">Obat-obatan</option>
                                    <option value="Consumable">Bahan Habis Pakai</option>
                                    <option value="Equipment">Peralatan</option>
                                </select>
                             </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Nomor Batch</label>
                            <input 
                                type="text" 
                                value={newItem.batchNumber}
                                onChange={(e) => setNewItem({...newItem, batchNumber: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:border-nexus-500 outline-none"
                                placeholder="BATCH-001"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Tanggal Kedaluwarsa</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                <input 
                                    type="date" 
                                    value={newItem.expiryDate}
                                    onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-nexus-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Stok Awal</label>
                                <input 
                                    type="number" 
                                    value={newItem.stockLevel}
                                    onChange={(e) => setNewItem({...newItem, stockLevel: parseInt(e.target.value)})}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Satuan</label>
                                <input 
                                    type="text" 
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-nexus-500 outline-none"
                                    placeholder="Box/Pcs"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Min. Order</label>
                                <input 
                                    type="number" 
                                    value={newItem.reorderLevel}
                                    onChange={(e) => setNewItem({...newItem, reorderLevel: parseInt(e.target.value)})}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
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
                            onClick={handleAddItem}
                            disabled={!newItem.name || !newItem.sku}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-nexus-600 to-teal-600 text-white font-bold hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" /> Simpan ke Inventaris
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-nexus-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-5 bg-gradient-to-r from-nexus-800 to-nexus-900 border-b border-white/10 flex justify-between items-center relative z-10">
              <h3 className="font-bold text-white text-lg">Sesuaikan Stok Level</h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 relative z-10">
              <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                <p className="text-xs text-nexus-400 mb-1 uppercase tracking-wider font-bold">Item Terpilih</p>
                <h4 className="text-xl font-bold text-white mb-1">{selectedItem.name}</h4>
                <p className="text-sm text-slate-400">
                  Stok Saat Ini: <span className="font-mono text-white bg-slate-700 px-1.5 py-0.5 rounded text-xs">{selectedItem.stockLevel} {selectedItem.unit}</span>
                </p>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setAdjustType('add')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium ${
                    adjustType === 'add' 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-nexus-900/50 border-white/10 text-slate-400 hover:bg-nexus-800'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Masuk (In)
                </button>
                <button
                  onClick={() => setAdjustType('reduce')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium ${
                    adjustType === 'reduce' 
                      ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                      : 'bg-nexus-900/50 border-white/10 text-slate-400 hover:bg-nexus-800'
                  }`}
                >
                  <Minus className="w-4 h-4" /> Keluar (Out)
                </button>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-slate-400 mb-2 font-medium text-center">Jumlah ({selectedItem.unit})</label>
                <input 
                  type="number" 
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="0"
                  className="w-full bg-nexus-900 border border-nexus-500/30 rounded-xl px-4 py-4 text-white text-3xl font-mono text-center focus:border-nexus-500 focus:ring-2 focus:ring-nexus-500/20 outline-none transition-all shadow-inner"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-medium"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveAdjustment}
                  disabled={!adjustQty || parseInt(adjustQty) <= 0}
                  className="flex-1 py-3 rounded-xl bg-nexus-500 text-slate-900 font-bold hover:bg-nexus-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]"
                >
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};