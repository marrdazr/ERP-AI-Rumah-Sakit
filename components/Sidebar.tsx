import React from 'react';
import { LayoutDashboard, Users, Pill, CreditCard, Settings, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.EMR, label: 'Pasien EMR', icon: Users },
    { id: ViewState.PHARMACY, label: 'Farmasi & Stok', icon: Pill },
    { id: ViewState.BILLING, label: 'Tagihan & Klaim', icon: CreditCard },
  ];

  return (
    <div className="w-72 bg-[#0b1120] border-r border-white/5 h-full flex flex-col shadow-2xl z-20">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-500 to-teal-400 flex items-center justify-center font-bold text-white text-xl shadow-[0_0_15px_rgba(14,165,233,0.4)]">
          N
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight text-white">NEXUS <span className="text-nexus-400 font-light">ERP</span></h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Hospital OS</span>
        </div>
      </div>

      <div className="flex-1 py-6 space-y-2 px-4">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Menu Utama</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all relative group ${
              currentView === item.id 
                ? 'text-white bg-gradient-to-r from-nexus-900 to-slate-900 border border-white/5 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentView === item.id && (
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-nexus-400 rounded-r-full shadow-[0_0_10px_#0ea5e9]" />
            )}
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-nexus-400' : 'text-slate-500 group-hover:text-nexus-400 transition-colors'}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2 mx-4 mb-4">
        <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Akun</p>
        <button 
          onClick={() => onNavigate(ViewState.SETTINGS)}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-colors ${
            currentView === ViewState.SETTINGS ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Pengaturan</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
      
      <div className="px-8 pb-6 text-[10px] text-slate-600 font-medium">
        v2.5.0-alpha<br />
        Powered by Google GenAI
      </div>
    </div>
  );
};