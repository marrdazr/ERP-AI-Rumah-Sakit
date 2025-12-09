import React, { useState } from 'react';
import { User, Activity, FileText, Sparkles, Check, Plus, X, Save, Search } from 'lucide-react';
import { Patient, ICDCode } from '../types';
import { analyzeClinicalNote } from '../services/geminiService';

const INITIAL_PATIENTS: Patient[] = [
  { id: '1', name: 'Siti Aminah', dob: '1985-04-12', gender: 'Female', mrn: 'MRN-9921', lastVisit: '2023-10-24', status: 'Admitted' },
  { id: '2', name: 'Budi Santoso', dob: '1972-11-30', gender: 'Male', mrn: 'MRN-1022', lastVisit: '2023-10-25', status: 'Outpatient' },
  { id: '3', name: 'Dewi Pertiwi', dob: '1990-02-14', gender: 'Female', mrn: 'MRN-3311', lastVisit: '2023-10-20', status: 'Discharged' },
];

export const PatientEMR: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedCodes, setSuggestedCodes] = useState<ICDCode[]>([]);
  
  // State for Add Patient Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    dob: '',
    gender: 'Male',
    mrn: '',
    status: 'Outpatient'
  });

  const handleAnalyze = async () => {
    if (!noteContent.trim()) return;
    setIsAnalyzing(true);
    setSuggestedCodes([]);
    
    try {
      const codes = await analyzeClinicalNote(noteContent);
      setSuggestedCodes(codes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.mrn) return;

    const patientToAdd: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPatient.name!,
      dob: newPatient.dob || '2000-01-01',
      gender: newPatient.gender as 'Male' | 'Female',
      mrn: newPatient.mrn!,
      lastVisit: new Date().toISOString().split('T')[0],
      status: newPatient.status as any,
    };

    setPatients(prev => [patientToAdd, ...prev]);
    setIsAddModalOpen(false);
    setNewPatient({ name: '', dob: '', gender: 'Male', mrn: '', status: 'Outpatient' });
    setSelectedPatient(patientToAdd);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
      {/* Patient List Sidebar */}
      <div className="w-full md:w-1/3 bg-nexus-900/50 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col shadow-2xl">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-nexus-900/50 to-transparent">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-nexus-400" /> Direktori Pasien
            </h2>
            <p className="text-xs text-slate-400 mt-1">Kelola data rekam medis</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 bg-nexus-500/10 text-nexus-400 hover:bg-nexus-500 hover:text-white rounded-lg transition-all border border-nexus-500/20"
            title="Tambah Pasien Baru"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar (Visual Only) */}
        <div className="px-4 py-3">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Cari pasien..." 
                    className="w-full bg-nexus-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:border-nexus-500 outline-none"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {patients.map((patient) => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 rounded-xl cursor-pointer transition-all border group relative overflow-hidden ${
                selectedPatient?.id === patient.id 
                  ? 'bg-nexus-500/10 border-nexus-500/50 shadow-[0_0_20px_rgba(14,165,233,0.1)]' 
                  : 'bg-nexus-800/20 border-white/5 hover:bg-nexus-800/40 hover:border-nexus-500/30'
              }`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className={`font-semibold text-base ${selectedPatient?.id === patient.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {patient.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{patient.mrn}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                  patient.status === 'Admitted' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  patient.status === 'Outpatient' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {patient.status === 'Admitted' ? 'Rawat Inap' : 
                   patient.status === 'Outpatient' ? 'Rawat Jalan' : 'Pulang'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Workspace */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        {selectedPatient ? (
          <>
            <div className="bg-nexus-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-nexus-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{selectedPatient.name}</h2>
                  <div className="flex gap-6 text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-nexus-500 rounded-full"></span> Tgl Lahir: {selectedPatient.dob}</span>
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-nexus-500 rounded-full"></span> Gender: {selectedPatient.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-md">
                  <Activity className="w-4 h-4 text-emerald-400" /> Riwayat Vital
                </button>
              </div>

              {/* AI Clinical Note Section */}
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-nexus-400" /> Catatan Klinis (SOAP)
                  </h3>
                  <span className="text-[10px] font-bold bg-nexus-500/20 text-nexus-300 px-2 py-1 rounded border border-nexus-500/30 uppercase tracking-wider">AI Enhanced</span>
                </div>
                
                <textarea
                  className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-slate-200 focus:ring-1 focus:ring-nexus-500 focus:border-nexus-500 outline-none resize-none placeholder-slate-600 transition-all text-sm leading-relaxed"
                  placeholder="Masukkan observasi klinis, diagnosis, dan rencana perawatan di sini..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />

                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-slate-500 italic">Didukung oleh Gemini 2.5 Flash</p>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !noteContent}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                      isAnalyzing 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-nexus-600 to-teal-600 text-white hover:shadow-nexus-500/30 hover:scale-[1.02]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /> Menganalisis...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Auto-Kodifikasi (ICD-10)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Results Panel */}
            {suggestedCodes.length > 0 && (
              <div className="bg-nexus-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" /> Rekomendasi Kode ICD-10
                </h3>
                <div className="space-y-3">
                  {suggestedCodes.map((code, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-nexus-500/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <span className="text-nexus-400 font-bold font-mono text-xl bg-nexus-500/10 px-2 py-1 rounded">{code.code}</span>
                        <span className="text-slate-200 font-medium">{code.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {code.confidence && (
                           <span className="text-xs font-bold text-slate-500 bg-black/20 px-2 py-1 rounded-full">{(code.confidence * 100).toFixed(0)}% Akurat</span>
                        )}
                        <button className="p-2 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-nexus-900/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/5">
            <div className="w-20 h-20 bg-nexus-500/5 rounded-full flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-nexus-500/40" />
            </div>
            <p className="text-lg font-medium text-slate-400">Pilih pasien untuk melihat Rekam Medis</p>
            <p className="text-sm text-slate-600 mt-2">Gunakan panel kiri untuk navigasi atau tambah pasien baru.</p>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-nexus-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-nexus-800 to-nexus-900">
              <h3 className="font-bold text-xl text-white">Registrasi Pasien Baru</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all"
                  placeholder="Contoh: Ahmad Dahlan"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Nomor Rekam Medis (MRN)</label>
                  <input 
                    type="text" 
                    value={newPatient.mrn}
                    onChange={(e) => setNewPatient({...newPatient, mrn: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-nexus-500 outline-none"
                    placeholder="MRN-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Tanggal Lahir</label>
                  <input 
                    type="date" 
                    value={newPatient.dob}
                    onChange={(e) => setNewPatient({...newPatient, dob: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-nexus-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Jenis Kelamin</label>
                    <div className="flex bg-black/20 rounded-xl p-1 border border-white/10">
                        <button 
                            onClick={() => setNewPatient({...newPatient, gender: 'Male'})}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${newPatient.gender === 'Male' ? 'bg-nexus-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Laki-laki
                        </button>
                        <button 
                            onClick={() => setNewPatient({...newPatient, gender: 'Female'})}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${newPatient.gender === 'Female' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Perempuan
                        </button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Status Awal</label>
                    <select 
                        value={newPatient.status}
                        onChange={(e) => setNewPatient({...newPatient, status: e.target.value as any})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-nexus-500 outline-none appearance-none"
                    >
                        <option value="Outpatient">Rawat Jalan</option>
                        <option value="Admitted">Rawat Inap</option>
                    </select>
                 </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-medium"
                >
                  Batal
                </button>
                <button 
                  onClick={handleAddPatient}
                  disabled={!newPatient.name || !newPatient.mrn}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-nexus-500 to-teal-500 text-slate-900 font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};