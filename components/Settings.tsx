import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Moon, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="h-full p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <SettingsIcon className="w-8 h-8 text-nexus-400" /> Pengaturan Sistem
        </h2>
        <p className="text-slate-400 mt-2 text-lg">Konfigurasi profil dan preferensi aplikasi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-nexus-900/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Profil Pengguna</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nama Lengkap</label>
              <input type="text" defaultValue="Dr. Administrator" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-slate-200 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Alamat Email</label>
              <input type="email" defaultValue="admin@medcore.nexus" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-slate-200 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Peran (Role)</label>
              <input type="text" defaultValue="Super Admin" disabled className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-slate-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-nexus-900/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Preferensi</h3>
           <div className="space-y-8">
             <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-nexus-500/10 rounded-xl text-nexus-400 group-hover:bg-nexus-500/20 transition-colors">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-200 font-semibold text-lg">Notifikasi</p>
                        <p className="text-sm text-slate-500">Terima peringatan untuk stok kritis</p>
                    </div>
                </div>
                <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${notifications ? 'bg-nexus-500' : 'bg-slate-700'}`}
                >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
             </div>

             <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                        <Moon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-200 font-semibold text-lg">Mode Gelap</p>
                        <p className="text-sm text-slate-500">Tema mewah aktif secara default</p>
                    </div>
                </div>
                 <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${darkMode ? 'bg-nexus-500' : 'bg-slate-700'}`}
                >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${darkMode ? 'left-7' : 'left-1'}`}></div>
                </button>
             </div>

             <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-200 font-semibold text-lg">Keamanan 2FA</p>
                        <p className="text-sm text-slate-500">Autentikasi dua faktor</p>
                    </div>
                </div>
                 <button className="w-14 h-8 rounded-full bg-slate-700 relative shadow-inner cursor-not-allowed opacity-60">
                    <div className="absolute top-1 left-1 w-6 h-6 bg-slate-400 rounded-full shadow-md"></div>
                </button>
             </div>
           </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
          <button className="flex items-center gap-3 bg-gradient-to-r from-nexus-600 to-teal-600 hover:from-nexus-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transform hover:scale-[1.02]">
              <Save className="w-5 h-5" /> Simpan Perubahan
          </button>
      </div>
    </div>
  );
};