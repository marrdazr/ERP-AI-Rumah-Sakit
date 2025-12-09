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
    { role: 'model', text: 'Hello. I am Nexus, your Hospital ERP Assistant. How can I help with financial data or stock inquiries today?' }
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
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-nexus-500 hover:bg-nexus-400 text-slate-900 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 h-[500px] bg-nexus-900 border border-nexus-700 rounded-2xl shadow-2xl flex flex-col z-50 transition-all transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-4 bg-nexus-800 border-b border-nexus-700 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-nexus-500 to-teal-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Nexus Assistant</h3>
              <p className="text-xs text-nexus-400">AI Powered • Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-nexus-500 text-slate-900 rounded-br-none font-medium' 
                  : 'bg-nexus-800 text-slate-200 border border-nexus-700 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-nexus-800 px-4 py-2 rounded-2xl rounded-bl-none border border-nexus-700 flex gap-1">
                 <span className="w-2 h-2 bg-nexus-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-nexus-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-nexus-400 rounded-full animate-bounce delay-150"></span>
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-nexus-800 border-t border-nexus-700 rounded-b-2xl">
          <div className="flex items-center gap-2 bg-nexus-900 rounded-xl px-3 py-2 border border-nexus-700 focus-within:border-nexus-500 transition-colors">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about revenue, stock, or patients..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
            <button onClick={handleSend} disabled={!input.trim()} className="text-nexus-400 hover:text-white disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </>
  );
};