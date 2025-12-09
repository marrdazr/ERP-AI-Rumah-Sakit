import React, { useState } from 'react';
import { Package, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { InventoryItem, PredictionResult } from '../types';
import { predictStockNeeds } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Paracetamol 500mg', sku: 'MED-001', category: 'Medicine', batchNumber: 'B8291', expiryDate: '2025-12-01', stockLevel: 120, unit: 'Box', reorderLevel: 200, monthlyUsage: [150, 180, 210, 190, 240, 300] },
  { id: '2', name: 'Amoxicillin 250mg', sku: 'MED-002', category: 'Medicine', batchNumber: 'B2211', expiryDate: '2024-06-15', stockLevel: 45, unit: 'Box', reorderLevel: 50, monthlyUsage: [40, 45, 42, 48, 50, 55] },
  { id: '3', name: 'Surgical Gloves (L)', sku: 'CON-105', category: 'Consumable', batchNumber: 'G9921', expiryDate: '2026-01-01', stockLevel: 800, unit: 'Pair', reorderLevel: 500, monthlyUsage: [400, 420, 380, 410, 390, 405] },
  { id: '4', name: 'Insulin Glargine', sku: 'MED-055', category: 'Medicine', batchNumber: 'B7721', expiryDate: '2024-08-20', stockLevel: 12, unit: 'Vial', reorderLevel: 30, monthlyUsage: [20, 25, 22, 28, 30, 35] },
];

export const Pharmacy: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const handlePredict = async () => {
    setAnalyzing(true);
    try {
      const results = await predictStockNeeds(MOCK_INVENTORY);
      setPredictions(results);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-nexus-400" /> Pharmacy & Inventory
          </h2>
          <p className="text-slate-400 mt-1">Real-time valuation and expiration tracking.</p>
        </div>
        <button 
          onClick={handlePredict}
          disabled={analyzing}
          className="flex items-center gap-2 bg-nexus-800 border border-nexus-500 text-nexus-400 px-4 py-2 rounded-lg hover:bg-nexus-700 transition-all"
        >
          {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          {analyzing ? 'Running Predictive Models...' : 'Run Stock Prediction (AI)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Inventory Table */}
        <div className="lg:col-span-2 bg-nexus-800 rounded-xl border border-nexus-700 shadow-lg flex flex-col">
          <div className="p-4 border-b border-nexus-700 flex justify-between">
             <h3 className="font-semibold text-slate-200">Current Stock Ledger</h3>
             <span className="text-xs text-slate-500">Last Synced: Just now</span>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-nexus-900/50 text-slate-400 sticky top-0">
                <tr>
                  <th className="p-3 font-medium">Item Name</th>
                  <th className="p-3 font-medium">Batch</th>
                  <th className="p-3 font-medium">Expiry</th>
                  <th className="p-3 font-medium text-right">Stock</th>
                  <th className="p-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nexus-700/50">
                {MOCK_INVENTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-nexus-700/30 transition-colors">
                    <td className="p-3 font-medium text-white">{item.name}</td>
                    <td className="p-3 font-mono text-slate-400">{item.batchNumber}</td>
                    <td className="p-3 text-slate-400">{item.expiryDate}</td>
                    <td className="p-3 text-right font-mono">{item.stockLevel} {item.unit}</td>
                    <td className="p-3 text-right">
                      {item.stockLevel < item.reorderLevel ? (
                        <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20">Low Stock</span>
                      ) : (
                        <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs border border-green-400/20">Healthy</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="bg-nexus-800 rounded-xl border border-nexus-700 shadow-lg flex flex-col">
          <div className="p-4 border-b border-nexus-700">
            <h3 className="font-semibold text-nexus-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Demand Forecast
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!analyzing && predictions.length === 0 && (
              <div className="text-center text-slate-500 mt-10">
                <p>No active predictions.</p>
                <p className="text-sm">Click "Run Stock Prediction" to analyze usage trends.</p>
              </div>
            )}
            
            {predictions.map((pred, idx) => (
              <div key={idx} className="bg-nexus-900/80 p-4 rounded-lg border-l-4 border-nexus-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-200">{pred.itemName}</h4>
                  <span className="text-xs bg-nexus-500 text-slate-900 px-2 py-0.5 rounded font-bold">
                    +{pred.predictedDemand} Demand
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-2">{pred.recommendation}</p>
                <div className="text-xs text-slate-500 italic bg-nexus-800 p-2 rounded">
                  "{pred.reasoning}"
                </div>
              </div>
            ))}
            
            {/* Visualizer for first item if available */}
            {MOCK_INVENTORY.length > 0 && (
                <div className="mt-4 pt-4 border-t border-nexus-700">
                    <h4 className="text-xs text-slate-400 mb-2 uppercase">Usage Trend: {MOCK_INVENTORY[0].name}</h4>
                    <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_INVENTORY[0].monthlyUsage.map((val, i) => ({ month: i, val }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#bae6fd' }}
                                    cursor={{fill: '#334155', opacity: 0.4}}
                                />
                                <Bar dataKey="val" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};