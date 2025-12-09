import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { chatWithERP } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo. Saya Nexus, Asisten ERP Rumah Sakit Anda. Ada yang bisa saya bantu terkait data keuangan atau stok hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithERP(messages, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Maaf, saya mengalami kesalahan.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 bg-nexus-500 hover:bg-nexus-400 text-white rounded-full shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all z-50 hover:scale-110 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-8 right-8 w-96 h-[550px] bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 transition-all transform origin-bottom-right duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-nexus-900 to-slate-900 border-b border-white/10 rounded-t-3xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-nexus-500 to-teal-400 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Nexus Assistant</h3>
              <p className="text-[10px] text-nexus-400 font-medium uppercase tracking-wider">AI Powered • Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-nexus-600 text-white rounded-br-none font-medium' 
                  : 'bg-white/10 text-slate-200 border border-white/5 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1.5 items-center">
                 <span className="w-2 h-2 bg-nexus-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-nexus-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-nexus-400 rounded-full animate-bounce delay-150"></span>
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900/50 border-t border-white/10 rounded-b-3xl">
          <div className="flex items-center gap-2 bg-black/20 rounded-2xl px-4 py-2.5 border border-white/10 focus-within:border-nexus-500 focus-within:ring-1 focus-within:ring-nexus-500/50 transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya tentang stok atau pendapatan..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
            <button onClick={handleSend} disabled={!input.trim()} className="text-nexus-400 hover:text-white disabled:opacity-50 p-1">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </>
  );
};