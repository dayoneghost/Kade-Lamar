
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store.ts';
import { useNavigate, Navigate } from 'react-router-dom';
import { Tv, Home, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

const Preferences: React.FC = () => {
  const { user, setPreferences, isAuthenticated } = useCartStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  if (!isAuthenticated) return <Navigate to="/" />;

  const options = [
    { id: 'Home Cinema', icon: <Tv size={24} />, desc: 'OLED, Projectors & Immersive Audio' },
    { id: 'Smart Appliances', icon: <Home size={24} />, desc: 'Intelligent Kitchen & Eco-Living' },
    { id: 'Office Setup', icon: <Briefcase size={24} />, desc: 'Elite Computing & Connectivity' }
  ];

  const toggleOption = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    setPreferences(selected);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-white rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        <div className="md:w-2/5 bg-slate-900 p-12 lg:p-16 text-white flex flex-col justify-between">
          <div>
            <Sparkles className="text-[#C5A059] mb-8" size={32} />
            <h1 className="text-4xl font-black font-playfair italic tracking-tight leading-tight mb-6">
              Welcome to the <br/>Lounge, {user?.name.split(' ')[0]}.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              We curate our ecosystem based on your technical ambitions. Select your focus for a personalized showroom experience.
            </p>
          </div>
          <div className="space-y-4 pt-12">
            <div className="flex items-center space-x-4 opacity-40">
              <div className="w-8 h-[1px] bg-white"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Preference Sync</span>
            </div>
          </div>
        </div>

        <div className="md:w-3/5 p-12 lg:p-16 flex flex-col justify-center bg-gray-50/50">
          <div className="space-y-6 mb-12">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`w-full p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 flex items-center space-x-6 ${
                  selected.includes(opt.id) 
                    ? 'border-[#C5A059] bg-white shadow-xl shadow-[#C5A059]/5 scale-[1.02]' 
                    : 'border-transparent bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  selected.includes(opt.id) ? 'bg-[#C5A059] text-white' : 'bg-gray-100 text-slate-400'
                }`}>
                  {opt.icon}
                </div>
                <div>
                  <p className="font-black text-lg">{opt.id}</p>
                  <p className="text-xs text-slate-500 font-medium">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleFinish}
            disabled={selected.length === 0}
            className="group w-full bg-slate-950 text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-4 hover:bg-[#C5A059] transition-all disabled:opacity-20 shadow-2xl"
          >
            <span>Finalize Profile</span>
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Preferences;
