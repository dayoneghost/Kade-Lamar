
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useCartStore } from '../store.ts';
import anime from 'animejs';

const FloatingConcierge: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! Welcome to Smart Duka Electronics. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatBtnRef = useRef<HTMLButtonElement>(null);
  const waBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isChatOpen && 
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node) &&
        !chatBtnRef.current?.contains(event.target as Node)
      ) {
        setIsChatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChatOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { 
          systemInstruction: `You are a Customer Support Agent for Smart Duka Electronics Kenya. 
          Expert on TVs, Apple devices, and mounting services. 
          Smart Duka is located at Smart House, Kimathi Street, Nairobi. 
          Be helpful, friendly, and answer questions about products and pricing.` 
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Sorry, I am having trouble connecting. Please chat with us on WhatsApp." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection error. Please use our WhatsApp link below for faster help." }]);
    } finally { setIsTyping(false); }
  };

  const whatsappLink = `https://wa.me/254742721309?text=${encodeURIComponent("Hi, I need help with an electronic product.")}`;

  if (isCartOpen) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[300] flex flex-col items-end space-y-6">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, scale: 0.8, y: 40, originY: 'bottom', originX: 'right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40, transition: { duration: 0.2 } }}
            className="w-[350px] md:w-[380px] h-[500px] md:h-[580px] max-h-[calc(100vh-140px)] bg-[#0F172A] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col mb-4 overflow-hidden border border-white/10"
          >
            <div className="p-6 md:p-8 bg-slate-950 text-white flex justify-between items-center border-b border-white/5">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center text-slate-950 shadow-xl">
                  <Bot size={24} />
                </div>
                <div>
                  <span className="font-bold block leading-none">Shop Assistant</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-green-500 mt-1 block">Online</span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:text-[#C5A059] transition-colors p-2">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-900/30 hide-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 md:p-5 rounded-[1.75rem] text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-[#C5A059] text-slate-950 font-bold shadow-lg' : 'bg-white/5 text-slate-200 border border-white/5 shadow-sm rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest px-4 animate-pulse">Assistant is typing...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-5 md:p-6 bg-slate-950 border-t border-white/5 space-y-4">
              <div className="flex space-x-3">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..." 
                  className="flex-grow bg-white/5 rounded-2xl px-5 py-3 md:py-4 text-sm text-white outline-none font-medium placeholder:text-slate-600 focus:bg-white/10 transition-all border border-transparent focus:border-white/10"
                />
                <button onClick={handleSend} className="bg-[#C5A059] text-slate-950 p-3 md:p-4 rounded-2xl hover:bg-white transition-all shadow-xl active:scale-90">
                  <Send size={20} />
                </button>
              </div>
              <a href={whatsappLink} target="_blank" className="flex items-center justify-center space-x-2 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-[#C5A059] transition-colors pt-1">
                <ExternalLink size={12} />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col space-y-4">
        <button 
          ref={chatBtnRef}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 glass-elevated rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all group overflow-hidden border-2 border-white/5"
        >
          {isChatOpen ? <X size={24} className="text-white" /> : <MessageSquare size={24} className="text-white group-hover:text-[#C5A059] transition-colors" />}
        </button>
        
        {!isChatOpen && (
          <a 
            ref={waBtnRef}
            href={whatsappLink}
            target="_blank"
            className="w-16 h-16 glass-elevated border-2 border-[#49B642] rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all group overflow-hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#49B642] group-hover:text-white transition-colors relative z-10">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.3379 17L2 22L7 20.6621C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 14.5C16 14.5 15.5 16 13.5 16C11.5 16 8 12.5 8 10.5C8 8.5 9.5 8 9.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="absolute inset-0 bg-[#49B642]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        )}
      </div>
    </div>
  );
};

export default FloatingConcierge;
