import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Truck, User, MapPin, MessageSquare, 
  ArrowLeft, CheckCircle2, Search, Zap, Package, 
  Star, ExternalLink, Clock, Hammer, Shield, 
  ArrowRight, Download, CreditCard, Navigation,
  Signal, Layers
} from 'lucide-react';
import { useCartStore } from '../store.ts';
import { supabase } from '../lib/api.ts';
import { LiveDeliveryPing } from '../types.ts';
import anime from 'animejs';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orderHistory } = useCartStore();
  
  const order = useMemo(() => 
    orderHistory.find(o => o.id === orderId) || {
      id: orderId,
      total_amount: 185000,
      status: 'shipped',
      delivery_lat: -1.286389,
      delivery_lng: 36.817223,
      site_surface_type: 'Stone Wall',
      floor_number: 4,
      items: [{ name: 'Hisense 75" U8K Mini-LED', price: 185000 }]
    }, [orderId, orderHistory]);

  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [telemetry, setTelemetry] = useState<Partial<LiveDeliveryPing> | null>(null);
  const [eta, setEta] = useState('Calculating...');

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`telemetry_${orderId}`)
      .on('broadcast', { event: 'ping' }, ({ payload }) => {
        setTelemetry(payload);
        setEta(`${Math.max(2, Math.floor(15 - (payload.id || 0) / 10))} Minutes`);
      })
      .subscribe();

    const statusChannel = supabase
      .channel(`status_${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (p) => {
        setCurrentStatus(p.new.status);
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel);
      supabase.removeChannel(statusChannel);
    };
  }, [orderId]);

  const stages = [
    { id: 1, label: 'Order Paid', desc: 'Verified & Confirmed', icon: CreditCard },
    { id: 2, label: 'Quality Check', desc: 'Technical Inspection', icon: ShieldCheck },
    { id: 3, label: 'Out for Delivery', desc: 'In Transit to Site', icon: Truck },
    { id: 4, label: 'Arrival & Install', desc: 'Expert Setup at Home', icon: Hammer }
  ];

  const activeStageIndex = useMemo(() => {
    if (currentStatus === 'delivered') return 4;
    if (currentStatus === 'shipped') return 3;
    if (currentStatus === 'Paid') return 2;
    return 1;
  }, [currentStatus]);

  const engineer = {
    name: "Lead Engineer Brian K.",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
    phone: "254742721309"
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#C5A059] selection:text-slate-950 font-inter">
      
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12 py-6">
        <div className="container mx-auto flex items-center justify-between">
           <button onClick={() => navigate('/dashboard?tab=ledger')} className="flex items-center space-x-3 text-slate-500 hover:text-white transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">My Orders</span>
           </button>
           <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-500 bg-green-500/5 px-3 py-1 rounded-full border border-green-500/10">
                 <Signal size={12} className="animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Live Delivery Hub</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Order ID: {orderId}</span>
           </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-40">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
           <div className="space-y-4">
              <div className="relative inline-flex items-center">
                 <div className="status-badge-glow absolute -inset-4 bg-[#C5A059]/20 blur-xl rounded-full opacity-30" />
                 <div className="relative px-6 py-2 rounded-full border-2 border-[#C5A059] bg-[#C5A059]/10 flex items-center space-x-3">
                    <Navigation size={14} className="text-[#C5A059] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">
                       {currentStatus === 'shipped' ? 'ORDER IN TRANSIT' : currentStatus === 'delivered' ? 'DELIVERY COMPLETED' : 'PREPARING DISPATCH'}
                    </span>
                 </div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black font-playfair italic tracking-tighter leading-[0.85] text-white">
                Track Your <br/><span className="text-slate-500">Delivery.</span>
              </h1>
           </div>
           
           <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center space-x-6 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059] flex items-center justify-center text-slate-950 shadow-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Estimated Arrival</p>
                  <p className="text-xl font-black text-white leading-none">{activeStageIndex >= 4 ? 'Arrived' : eta}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center space-x-6 shadow-2xl overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Transit Speed</p>
                  <p className="text-xl font-black text-white leading-none">{telemetry ? `${Math.round(telemetry.speed || 0)} KM/H` : 'Stationary'}</p>
                </div>
              </div>
           </div>
        </header>

        <section className="mb-20">
           <div className="relative flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
              <div className="hidden lg:block absolute top-[22px] left-10 right-10 h-[2px] bg-white/5 z-0">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeStageIndex - 1) / 3) * 100}%` }}
                    className="h-full bg-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all duration-1000"
                 />
              </div>

              {stages.map((stage, idx) => {
                const isActive = activeStageIndex >= stage.id;
                const isCurrent = activeStageIndex === stage.id;
                return (
                  <div key={stage.id} className={`relative z-10 flex items-start lg:flex-col lg:items-center space-x-6 lg:space-x-0 lg:space-y-6 lg:w-1/4 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                     <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${
                        isCurrent ? 'bg-slate-950 border-[#C5A059] text-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.3)]' :
                        isActive ? 'bg-[#C5A059] border-[#C5A059] text-slate-950' : 
                        'bg-slate-900 border-white/5 text-slate-700'
                     }`}>
                        {isActive && !isCurrent ? <CheckCircle2 size={24} /> : <stage.icon size={24} />}
                     </div>
                     <div className="lg:text-center space-y-1">
                        <h4 className={`text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-[#C5A059]' : 'text-white'}`}>{stage.label}</h4>
                        <p className="text-[10px] font-medium text-slate-500 max-w-[200px] leading-relaxed">{stage.desc}</p>
                     </div>
                  </div>
                );
              })}
           </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-10">
           <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 order-1"
           >
              <div className="relative aspect-video lg:aspect-auto lg:h-[650px] bg-slate-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                 <iframe 
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15955.275586616452!2d${telemetry?.longitude || 36.817223}!3d${telemetry?.latitude || -1.286389}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske&dark_mode=true`} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    className="grayscale transition-all duration-1000 opacity-40 group-hover:opacity-70"
                 />
                 
                 <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
                          <div className="flex items-center space-x-3 mb-3 text-[#C5A059]">
                             <Layers size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Delivery Location</span>
                          </div>
                          <div className="space-y-1">
                             <p className="text-xs font-bold text-white uppercase">{order.delivery_address?.address || 'Nairobi Hub'}</p>
                             <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Nairobi Metro Area</p>
                          </div>
                       </div>
                    </div>
                    
                    <motion.div 
                      layout
                      initial={{ x: 100, y: 300 }}
                      animate={telemetry ? {
                        x: (telemetry.longitude || 0) * 100 % 400 + 100, 
                        y: (telemetry.latitude || 0) * 100 % 300 + 100,
                        rotate: (telemetry.heading || 0)
                      } : { x: 300, y: 300 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 60 }}
                      className="absolute"
                    >
                       <div className="relative">
                          <div className="absolute -inset-10 bg-[#C5A059]/20 rounded-full blur-2xl animate-pulse" />
                          <div className="relative w-14 h-14 bg-[#C5A059] rounded-2xl flex items-center justify-center border-4 border-slate-950 shadow-2xl">
                             <Truck size={24} className="text-slate-950" />
                          </div>
                       </div>
                    </motion.div>

                    <div className="flex justify-center">
                       <div className="bg-slate-950/90 backdrop-blur-xl px-12 py-5 rounded-full border border-white/10 flex items-center space-x-8 shadow-2xl">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Professional Dispatch Active</span>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.section>

           <motion.aside 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 space-y-8 order-2"
           >
              <div className="glass-elevated rounded-[2.5rem] p-10 border border-white/5 space-y-10">
                 <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#C5A059]">
                       <Package size={24} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black font-playfair italic text-white uppercase tracking-tight">Order Details</h3>
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Secured Shipment</p>
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Products</span>
                       <p className="text-sm font-bold text-white leading-snug">{order.items?.[0]?.name}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 pt-4 border-t border-white/5">
                       <div className="space-y-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Shipping To</span>
                          <p className="text-xs font-bold text-white">{order.delivery_address?.address || 'Nairobi Metro'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-elevated rounded-[2.5rem] p-10 border border-[#C5A059]/20 bg-[#C5A059]/5 space-y-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-[80px]" />
                 
                 <div className="flex items-center space-x-6 relative z-10">
                    <div className="relative">
                       <img src={engineer.photo} className="w-24 h-24 rounded-3xl object-cover border-2 border-[#C5A059] shadow-2xl" alt="Lead" />
                       <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center text-slate-950 border-4 border-slate-950 shadow-xl">
                          <ShieldCheck size={18} />
                       </div>
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-white leading-none mb-3">{engineer.name}</h4>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Fulfillment Specialist</p>
                       <div className="flex items-center space-x-2 text-green-500 mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Assigned to Order</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4 pt-4 relative z-10">
                    <a href={`https://wa.me/${engineer.phone}?text=${encodeURIComponent(`Hi Brian, I am following up on Order #${orderId}`)}`} target="_blank" className="w-full bg-[#C5A059] text-slate-950 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] flex items-center justify-center space-x-3 hover:bg-white transition-all shadow-2xl">
                       <MessageSquare size={16} />
                       <span>Contact Dispatch</span>
                    </a>
                    <div className="p-5 bg-slate-950/60 rounded-2xl border border-white/10 text-center">
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2 leading-none">Security Code</p>
                       <p className="text-2xl font-black text-white tracking-[0.8em] leading-none">7 7 2 1</p>
                    </div>
                 </div>
              </div>
           </motion.aside>
        </div>
      </main>

      <div className="fixed top-1/2 left-0 w-[1000px] h-[1000px] bg-[#C5A059]/5 rounded-full blur-[200px] -z-10 pointer-events-none" />
    </div>
  );
};

export default OrderTracking;