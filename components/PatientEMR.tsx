import React, { useState } from 'react';
import { User, Activity, FileText, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Patient, ClinicalNote, ICDCode } from '../types';
import { analyzeClinicalNote } from '../services/geminiService';

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Sarah W.', dob: '1985-04-12', gender: 'Female', mrn: 'MRN-9921', lastVisit: '2023-10-24', status: 'Admitted' },
  { id: '2', name: 'James B.', dob: '1972-11-30', gender: 'Male', mrn: 'MRN-1022', lastVisit: '2023-10-25', status: 'Outpatient' },
  { id: '3', name: 'Diana P.', dob: '1990-02-14', gender: 'Female', mrn: 'MRN-3311', lastVisit: '2023-10-20', status: 'Discharged' },
];

export const PatientEMR: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedCodes, setSuggestedCodes] = useState<ICDCode[]>([]);

  const handleAnalyze = async () => {
    if (!noteContent.trim()) return;
    setIsAnalyzing(true);
    setSuggestedCodes([]);
    
    // Simulate slight network delay for UX then call API
    try {
      const codes = await analyzeClinicalNote(noteContent);
      setSuggestedCodes(codes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
      {/* Patient List */}
      <div className="w-full md:w-1/3 bg-nexus-800 rounded-xl border border-nexus-700 flex flex-col shadow-lg">
        <div className="p-4 border-b border-nexus-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-nexus-400" /> Patient Directory
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {MOCK_PATIENTS.map((patient) => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedPatient?.id === patient.id 
                  ? 'bg-nexus-700 border-nexus-500' 
                  : 'bg-nexus-900/50 border-transparent hover:bg-nexus-700/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-100">{patient.name}</h3>
                  <p className="text-xs text-slate-400">{patient.mrn}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  patient.status === 'Admitted' ? 'bg-red-500/20 text-red-300' : 
                  patient.status === 'Outpatient' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {patient.status}
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
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPatient.name}</h2>
                  <div className="flex gap-4 text-sm text-slate-400 mt-1">
                    <span>DOB: {selectedPatient.dob}</span>
                    <span>Gender: {selectedPatient.gender}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-nexus-500 hover:bg-nexus-400 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-colors">
                  <Activity className="w-4 h-4" /> Vitals History
                </button>
              </div>

              {/* AI Clinical Note Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-nexus-400" /> Clinical Note Entry
                  </h3>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">AI-Enhanced</span>
                </div>
                
                <textarea
                  className="w-full h-40 bg-nexus-900 border border-nexus-700 rounded-lg p-4 text-slate-300 focus:ring-1 focus:ring-nexus-400 focus:border-nexus-400 outline-none resize-none placeholder-slate-600"
                  placeholder="Enter clinical observations, diagnosis, and treatment plan here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />

                <div className="flex justify-between items-center">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !noteContent}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                      isAnalyzing 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-nexus-500 to-teal-500 text-slate-900 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <span className="animate-pulse">Analyzing...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Auto-Codify (ICD-10)
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 italic">Powered by Gemini v2.5</p>
                </div>
              </div>
            </div>

            {/* AI Results Panel */}
            {suggestedCodes.length > 0 && (
              <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" /> Suggested ICD-10 Codes
                </h3>
                <div className="space-y-3">
                  {suggestedCodes.map((code, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-nexus-900/50 rounded-lg border border-nexus-700/50">
                      <div className="flex items-center gap-4">
                        <span className="text-nexus-400 font-bold font-mono text-lg">{code.code}</span>
                        <span className="text-slate-300">{code.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {code.confidence && (
                           <span className="text-xs text-slate-500">{(code.confidence * 100).toFixed(0)}% Match</span>
                        )}
                        <button className="p-1 hover:bg-nexus-700 rounded text-nexus-400">
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
          <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-nexus-800/20 rounded-xl border-2 border-dashed border-nexus-800">
            <User className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a patient to view EMR and perform AI analysis</p>
          </div>
        )}
      </div>
    </div>
  );
};