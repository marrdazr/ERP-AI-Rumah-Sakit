import React, { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for login
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center relative overflow-hidden font-sans">
        {/* Background Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-nexus-500/20 rounded-full blur-[120px] pointer-events-none opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none opacity-60"></div>

        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl z-10 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-500 via-teal-400 to-nexus-500 rounded-t-3xl opacity-80"></div>
            
            <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-nexus-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(14,165,233,0.3)] transform rotate-3">
                    <Activity className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">MedCore Nexus</h1>
                <p className="text-slate-400 text-sm mt-2 font-medium">Sistem ERP Rumah Sakit Cerdas</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-nexus-400 uppercase tracking-widest mb-2">Akses Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-nexus-400 transition-colors" />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:ring-1 focus:ring-nexus-400 focus:border-nexus-400 outline-none transition-all placeholder-slate-600"
                            placeholder="admin@medcore.nexus"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-nexus-400 uppercase tracking-widest mb-2">Token Keamanan</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-nexus-400 transition-colors" />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:ring-1 focus:ring-nexus-400 focus:border-nexus-400 outline-none transition-all placeholder-slate-600"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-nexus-500 to-teal-500 hover:from-nexus-400 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_10px_30px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>Autentikasi Masuk <ArrowRight className="w-5 h-5" /></>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-xs text-slate-500">Sistem Akses Terbatas. Penggunaan tanpa izin dilarang.</p>
            </div>
        </div>
    </div>
  );
};