
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_ENGINE } from '../constants.tsx';
import { 
  Calendar, Clock, Wrench, ShieldCheck, ArrowRight, 
  Zap, Volume2, LayoutGrid, Bell, ChevronLeft, ChevronRight, 
  Quote, Star, MapPin, ExternalLink, Camera, CheckCircle2
} from 'lucide-react';

const MOUNTING_GALLERY = [
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
    title: 'Precision Stealth',
    desc: 'Zero-cable visibility for a minimalist architectural finish.'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=1600',
    title: 'The Great Room',
    desc: '75-inch calibration in Nairobi’s premier residences.'
  }
];

const GBP_REVIEWS = [
  { user: 'Brian Kiprotich', text: 'Best mounting service in Nairobi. They arrived on time in Westlands and the cable management is just magic.', rating: 5, date: '1 month ago' },
  { user: 'Njeri Kamau', text: 'Professional guys. They mounted my 65 inch Hisense and even helped me set up the soundbar. Highly recommended.', rating: 5, date: '2 weeks ago' },
  { user: 'James G.', text: 'Expert knowledge on brackets. I was worried about my gypsum wall but they used specialized anchors. Zero issues.', rating: 5, date: '3 days ago' }
];

const Booking: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    tvSize: '55"',
    bracketType: 'Fixed',
    preferredDate: '',
    preferredHour: '09:00',
    mount_soundbar: false,
    hasOwnSnakeLights: true,
    hide_cables: false,
    home_presence: true,
    notes: ''
  });

  const [totals, setTotals] = useState({
    labor: 0,
    bracket: 0,
    transport: PRICING_ENGINE.transport,
    addons: 0,
    finalTotal: 0
  });

  useEffect(() => {
    const labor = PRICING_ENGINE.labor[formData.tvSize as keyof typeof PRICING_ENGINE.labor] || 0;
    const transport = PRICING_ENGINE.transport;
    let bracketPrice = 0;
    if (formData.bracketType === 'Fixed') {
      bracketPrice = PRICING_ENGINE.bracketFixed[formData.tvSize as keyof typeof PRICING_ENGINE.bracketFixed] || 0;
    } else {
      bracketPrice = PRICING_ENGINE.bracketSwivel[formData.tvSize as keyof typeof PRICING_ENGINE.bracketSwivel] || 0;
    }
    
    const addonsTotal = 
      (!formData.hasOwnSnakeLights ? PRICING_ENGINE.addons.backlights_supply : 0) + 
      (formData.mount_soundbar ? PRICING_ENGINE.addons.soundbarLabor : 0) +
      (formData.hide_cables ? 300 : 0);

    setTotals({
      labor,
      bracket: bracketPrice,
      transport,
      addons: addonsTotal,
      finalTotal: labor + transport + bracketPrice + addonsTotal
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const today = new Date().toISOString().split('T')[0];

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.();
      dateInputRef.current.focus();
    }
  };

  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const Toggle = ({ active, onClick, label, icon: Icon, sublabel }: any) => (
    <button 
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full p-5 md:p-6 rounded-2xl border transition-all duration-500 ${active ? 'bg-[#C5A059]/10 border-[#C5A059] shadow-[0_10px_30px_rgba(197,160,89,0.1)]' : 'bg-slate-900/50 border-white/5 hover:border-white/20'}`}
    >
      <div className="flex items-center space-x-4 text-left">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-[#C5A059] text-slate-950' : 'bg-white/5 text-slate-500'}`}>
          <Icon size={18} />
        </div>
        <div>
          <span className="font-bold text-sm block">{label}</span>
          {sublabel && <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">{sublabel}</span>}
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-[#C5A059]' : 'bg-slate-800'}`}>
         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] pt-24 md:pt-32 pb-40 px-6">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16 md:mb-32 text-center max-w-4xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-14 h-14 md:w-16 md:h-16 bg-[#C5A059] rounded-2xl flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-2xl"
           >
              <Wrench className="text-slate-950" size={28} />
           </motion.div>
           <h1 className="text-4xl md:text-8xl font-black font-playfair italic tracking-tighter leading-[0.9] mb-8 text-white">
             Bespoke <br/><span className="text-slate-400">Installation.</span>
           </h1>
           <p className="text-base md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
             Precision TV mounting for Nairobi’s premier residences. Every appointment includes a 12-month structural integrity guarantee.
           </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-10 md:gap-24 items-start mb-40">
           <div className="lg:col-span-7 space-y-12">
              <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] border border-white/10 p-8 md:p-16 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Screen Size</label>
                        <select required className="w-full bg-slate-950/80 border border-white/10 rounded-xl md:rounded-2xl px-6 py-4 md:py-5 focus:border-[#C5A059] outline-none font-bold text-white transition-all appearance-none cursor-pointer" value={formData.tvSize} onChange={(e) => setFormData({...formData, tvSize: e.target.value})}>
                            {Object.keys(PRICING_ENGINE.labor).map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bracket Style</label>
                        <select required className="w-full bg-slate-950/80 border border-white/10 rounded-xl md:rounded-2xl px-6 py-4 md:py-5 focus:border-[#C5A059] outline-none font-bold text-white transition-all appearance-none cursor-pointer" value={formData.bracketType} onChange={(e) => setFormData({...formData, bracketType: e.target.value})}>
                            <option value="Fixed" className="bg-slate-900">Fixed Flush Mount</option>
                            <option value="Swivel" className="bg-slate-900">Full Motion Swivel</option>
                        </select>
                      </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Service Add-ons</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <Toggle 
                          active={formData.mount_soundbar} 
                          onClick={() => setFormData({...formData, mount_soundbar: !formData.mount_soundbar})}
                          label="Audio Soundbar"
                          sublabel="KES 1,000 Labor"
                          icon={Volume2}
                        />
                        <Toggle 
                          active={!formData.hasOwnSnakeLights} 
                          onClick={() => setFormData({...formData, hasOwnSnakeLights: !formData.hasOwnSnakeLights})}
                          label="Ambient Lighting"
                          sublabel={formData.hasOwnSnakeLights ? "I have the lights" : "+ KES 1,300 (Supply + Stealth)"}
                          icon={Zap}
                        />
                        <Toggle 
                          active={formData.hide_cables} 
                          onClick={() => setFormData({...formData, hide_cables: !formData.hide_cables})}
                          label="Hide wires"
                          sublabel="+ KES 300"
                          icon={LayoutGrid}
                        />
                        <Toggle 
                          active={formData.home_presence} 
                          onClick={() => setFormData({...formData, home_presence: !formData.home_presence})}
                          label="Transit Alert"
                          icon={Bell}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pt-4">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center space-x-3"><Calendar size={14} /> <span>Service Date</span></label>
                        <input 
                          ref={dateInputRef}
                          type="date" 
                          required 
                          min={today}
                          onClick={handleDateClick}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl md:rounded-2xl px-6 py-4 md:py-5 focus:border-[#C5A059] outline-none font-bold text-white transition-all cursor-pointer"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center space-x-3"><Clock size={14} /> <span>Time Slot</span></label>
                        <select required className="w-full bg-slate-950/80 border border-white/10 rounded-xl md:rounded-2xl px-6 py-4 md:py-5 focus:border-[#C5A059] outline-none font-bold text-white transition-all appearance-none cursor-pointer" value={formData.preferredHour} onChange={(e) => setFormData({...formData, preferredHour: e.target.value})}>
                            {hours.map(h => <option key={h} className="bg-slate-900">{h}</option>)}
                        </select>
                      </div>
                  </div>

                  <div className="space-y-8 pt-6 border-t border-white/5">
                      <input required type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#C5A059] font-bold text-lg md:text-xl placeholder:text-slate-700 transition-all" placeholder="Client Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                      <input required type="tel" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#C5A059] font-bold text-lg md:text-xl placeholder:text-slate-700 transition-all" placeholder="WhatsApp Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      <input required type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#C5A059] font-bold text-lg md:text-xl placeholder:text-slate-700 transition-all" placeholder="Residence Estate" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-[#C5A059] text-slate-950 py-6 md:py-8 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] hover:bg-white transition-all shadow-[0_30px_60px_rgba(197,160,89,0.2)] disabled:opacity-50 active:scale-95">
                      {loading ? "Confirming Slot..." : "Confirm Installation Appointment"}
                  </button>
                </form>
              </div>
           </div>

           <div className="lg:col-span-5">
              <div className="bg-[#C5A059] p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] text-slate-950 shadow-[0_50px_100px_rgba(197,160,89,0.3)] lg:sticky lg:top-32">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b border-slate-950/20 pb-4">Service Quotation</h4>
                 <div className="space-y-8">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Estimated Value</p>
                          <span className="text-3xl md:text-5xl font-black tracking-tighter leading-none">KSh {totals.finalTotal.toLocaleString()}</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4 pt-8 border-t border-slate-950/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                       <div className="flex justify-between opacity-60">
                          <span>Labor ({formData.tvSize})</span>
                          <span>KSh {totals.labor.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between opacity-60">
                          <span>Hardware</span>
                          <span>KSh {totals.bracket.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between opacity-60">
                          <span>Add-ons</span>
                          <span>KSh {totals.addons.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between opacity-60">
                          <span>Logistics Hub Fee</span>
                          <span>KSh {totals.transport.toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <section className="mb-32 md:mb-40">
           <div className="flex items-center space-x-6 mb-12 md:mb-16">
              <Camera className="text-[#C5A059]" size={28} />
              <h2 className="text-3xl md:text-6xl font-black font-playfair italic text-white tracking-tighter">Installation <span className="text-slate-500">Pictorials.</span></h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {MOUNTING_GALLERY.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="group relative aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl"
                >
                   <img src={item.url} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                   <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 md:right-10">
                      <h4 className="text-xl md:text-2xl font-black font-playfair italic text-white mb-1 md:mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-[10px] md:text-sm font-medium">{item.desc}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        <section className="mb-24">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 md:mb-20 gap-8">
              <div className="flex items-center space-x-6">
                <Quote className="text-[#C5A059]" size={28} />
                <h2 className="text-3xl md:text-6xl font-black font-playfair italic text-white tracking-tighter">Verified <span className="text-slate-500">Expertise.</span></h2>
              </div>
              <a href="https://share.google/6JOgBWtHDWlcHOIPr" target="_blank" className="flex items-center space-x-4 bg-white/5 px-8 py-4 rounded-full border border-white/5 hover:bg-white/10 transition-all group w-max">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Google Hub</span>
                <ExternalLink size={14} className="text-[#C5A059] group-hover:translate-x-1 transition-transform" />
             </a>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {GBP_REVIEWS.map((rev, idx) => (
                <div key={idx} className="bg-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 space-y-6 relative group overflow-hidden">
                   <div className="flex space-x-1">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="#C5A059" className="text-[#C5A059]" />)}
                   </div>
                   <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed italic">"{rev.text}"</p>
                   <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-sm">{rev.user}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{rev.date}</p>
                      </div>
                      <CheckCircle2 size={16} className="text-green-500" />
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
      
      <AnimatePresence>
        {submitted && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-[#020617]/95 backdrop-blur-2xl z-[300] flex flex-col items-center justify-center text-center p-8"
          >
             <div className="w-24 h-24 md:w-32 md:h-32 bg-[#C5A059] rounded-full flex items-center justify-center mb-10 md:mb-12 shadow-[0_0_100px_rgba(197,160,89,0.3)]">
                <ShieldCheck size={48} className="text-slate-950" />
             </div>
             <h2 className="font-playfair text-4xl md:text-8xl font-black italic mb-6 leading-none tracking-tighter text-white">Slot <br/><span className="text-[#C5A059]">Reserved.</span></h2>
             <p className="text-slate-400 text-base md:text-xl font-medium max-w-lg mb-10 md:mb-12 leading-relaxed">
               Your installation has been scheduled. A lead specialist will contact you via WhatsApp momentarily for site confirmation.
             </p>
             <button onClick={() => setSubmitted(false)} className="px-12 md:px-16 py-5 md:py-7 bg-white text-slate-950 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] rounded-2xl hover:bg-[#C5A059] transition-all flex items-center space-x-4 shadow-2xl active:scale-95">
               <span>Close Confirmation</span>
               <ArrowRight size={14} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;
