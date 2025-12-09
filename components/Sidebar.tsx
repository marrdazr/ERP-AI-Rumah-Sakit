import React from 'react';
import { LayoutDashboard, Users, Pill, CreditCard, Settings, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.EMR, label: 'Patient EMR', icon: Users },
    { id: ViewState.PHARMACY, label: 'Pharmacy & Stock', icon: Pill },
    { id: ViewState.BILLING, label: 'Billing & Claims', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-nexus-900 border-r border-nexus-700 h-full flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-nexus-500 to-teal-400 flex items-center justify-center font-bold text-slate-900">
          N
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">NEXUS <span className="text-nexus-400 font-light">ERP</span></h1>
      </div>

      <div className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-all relative ${
              currentView === item.id 
                ? 'text-nexus-400 bg-nexus-800/50' 
                : 'text-slate-400 hover:text-white hover:bg-nexus-800/30'
            }`}
          >
            {currentView === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-nexus-400 rounded-r-full" />
            )}
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-nexus-700 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      
      <div className="p-6 text-xs text-slate-600">
        v2.5.0-alpha<br />
        Powered by Google GenAI
      </div>
    </div>
  );
};