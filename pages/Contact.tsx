
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, ArrowRight, Star, Upload } from 'lucide-react';

const Contact: React.FC = () => {
  const [mood, setMood] = useState('Installation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [budget, setBudget] = useState(150000);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vision: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // VIP Priority Logic based on intent and project scale
    const isVIP = mood === 'Private Viewing' || budget > 1000000;
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      console.log(isVIP ? "VIP PRIORITY LEAD: Immediate concierge escalation triggered." : "Standard inquiry logged in CRM.");
    }, 2000);
  };

  const moods = [
    { id: 'Installation', label: 'Bespoke Installation' },
    { id: 'Corporate', label: 'Corporate Fleet' },
    { id: 'Private Viewing', label: 'Private Appointment' }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-24">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24">
          
          {/* Left: Branding & Info */}
          <div className="space-y-20">
            <div>
              <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em] mb-8 block">Digital Concierge</span>
              <h1 className="text-6xl md:text-8xl font-black font-playfair italic leading-[0.9] tracking-tighter mb-12">
                Connect with <br/>the <span className="text-[#C5A059]">Curators.</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg">
                Whether a home cinema in Muthaiga or an office fleet in Upperhill, our concierge team ensures your vision is realized with absolute technical precision.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-[#C5A059]">
                  <MapPin size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Showroom</span>
                </div>
                <p className="font-bold text-lg leading-tight">Smart House, 4th Floor,<br/>Kimathi Street, Nairobi CBD</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-[#C5A059]">
                  <Clock size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Availability</span>
                </div>
                <p className="font-bold text-lg leading-tight">Mon – Sat: 09:00 – 19:00<br/>Priority Hub: 24/7 Access</p>
              </div>
            </div>

            <div className="relative h-80 bg-slate-900 rounded-[3rem] overflow-hidden border border-white/5 group">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover opacity-20 grayscale"
                alt="Map Context"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                   <div className="absolute -inset-4 bg-[#C5A059]/20 rounded-full animate-ping" />
                   <div className="relative w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center border-4 border-slate-950">
                     <Star size={12} fill="white" className="text-white" />
                   </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-bold mb-2">Smart Duka Official Headquarters</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Open Priority GPS Link</button>
              </div>
            </div>
          </div>

          {/* Right: The High-Conversion Form */}
          <div className="bg-white rounded-[4rem] p-12 lg:p-16 text-slate-950 shadow-2xl">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20"
                >
                  <div className="w-24 h-24 bg-[#C5A059] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#C5A059]/30">
                    <Star size={40} fill="white" />
                  </div>
                  <h2 className="text-4xl font-black font-playfair italic">Inquiry Verified.</h2>
                  <p className="text-slate-500 font-medium">Your dossier has been routed to the relevant technical lead. Expect a priority response within 2 showroom hours.</p>
                  <button onClick={() => setSuccess(false)} className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] pt-8 hover:underline">Escalate Another Inquiry</button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit} 
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Type</span>
                    <div className="flex flex-wrap gap-4">
                      {moods.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMood(m.id)}
                          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                            mood === m.id ? 'bg-slate-950 text-white border-slate-950' : 'bg-transparent border-slate-200 text-slate-400'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="relative group">
                      <input 
                        type="text" required 
                        className="w-full bg-transparent border-b border-slate-200 py-4 outline-none focus:border-[#C5A059] transition-all font-bold text-lg peer" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                      <label className="absolute top-4 left-0 text-slate-400 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#C5A059] peer-valid:-top-6 peer-valid:text-[10px]">Client Identity</label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="relative group">
                        <input 
                          type="email" required 
                          className="w-full bg-transparent border-b border-slate-200 py-4 outline-none focus:border-[#C5A059] transition-all font-bold text-lg peer" 
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        <label className="absolute top-4 left-0 text-slate-400 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#C5A059] peer-valid:-top-6 peer-valid:text-[10px]">Secure Email</label>
                      </div>
                      <div className="relative group">
                        <input 
                          type="tel" required 
                          className="w-full bg-transparent border-b border-slate-200 py-4 outline-none focus:border-[#C5A059] transition-all font-bold text-lg peer" 
                          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        <label className="absolute top-4 left-0 text-slate-400 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#C5A059] peer-valid:-top-6 peer-valid:text-[10px]">WhatsApp Link</label>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Anticipated Project Value (KSh)</span>
                        <span className="font-black text-xl tracking-tighter">KSh {budget.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" 
                        min="50000" 
                        max="5000000" 
                        step="50000"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full accent-[#C5A059] h-1 bg-slate-100 rounded-full appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="relative group">
                      <textarea 
                        required 
                        className="w-full bg-transparent border-b border-slate-200 py-4 outline-none focus:border-[#C5A059] transition-all font-bold text-lg h-32 resize-none peer"
                        value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})}
                      ></textarea>
                      <label className="absolute top-4 left-0 text-slate-400 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#C5A059] peer-valid:-top-6 peer-valid:text-[10px]">Technical Vision Details</label>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4 hover:border-[#C5A059] transition-all cursor-pointer group/upload">
                       <Upload size={24} className="text-slate-400 group-hover/upload:text-[#C5A059] transition-colors" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Attach Site Photos (Gypsum/Stone walls)</span>
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full bg-slate-950 text-white py-8 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-4 hover:bg-[#C5A059] transition-all shadow-2xl disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Submit Project Dossier</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
