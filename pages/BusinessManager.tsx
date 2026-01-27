import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Truck, Hammer, FileText, 
  Map as MapIcon, Settings, LogOut, Search, Filter, 
  ChevronRight, MoreVertical, CheckCircle2, Clock, 
  User, ShieldCheck, Zap, ArrowUpRight, Signal, 
  Download, Eye, UserPlus, Calendar, MapPin
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { LOGO_URL } from '../constants.tsx';
import anime from 'animejs';

type AdminTab = 'orders' | 'dispatch' | 'fleet' | 'documents';

const BusinessManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  // Mock Admin Data
  const [orders, setOrders] = useState([
    { id: 'ORD_7721', client: 'David M.', item: 'Hisense 75" U8K Mini-LED', total: 185000, status: 'Paid', date: 'Today, 10:45 AM', installRequested: true },
    { id: 'ORD_6542', client: 'Sarah W.', item: 'iPhone 15 Pro Max', total: 195000, status: 'Out for Delivery', date: 'Today, 09:15 AM', installRequested: false },
    { id: 'ORD_4420', client: 'James K.', item: 'Hisense 55" A6K UHD', total: 54500, status: 'Delivered', date: 'Yesterday', installRequested: true },
    { id: 'ORD_9912', client: 'Elite Corp', item: 'Office TV Fleet (x5)', total: 425000, status: 'Processing', date: 'Just now', installRequested: true },
  ]);

  const [installers, setInstallers] = useState([
    { id: 'ENG_1', name: 'Brian Kiprotich', status: 'In Transit', activeOrder: 'ORD_6542', location: 'Westlands' },
    { id: 'ENG_2', name: 'Moses Ochieng', status: 'Available', activeOrder: null, location: 'Nairobi CBD' },
    { id: 'ENG_3', name: 'Faith Njeri', status: 'On Site', activeOrder: 'ORD_4420', location: 'Karen' },
  ]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === 'admin@smartduka.co.ke' && loginForm.password === 'SmartDuka_Premium_2026') {
      setIsAdminAuth(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      (anime as any)({
        targets: '.login-card',
        translateX: [-10, 10, -10, 10, 0],
        duration: 400,
        easing: 'easeInOutQuad'
      });
    }
  };

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10"><Zap size={400} className="text-[#C5A059]" /></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="login-card w-full max-w-md bg-[#0F172A] rounded-[3rem] p-12 border border-white/10 shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
             <img src={LOGO_URL} className="h-16 mx-auto mb-6 object-contain" alt="Smart Duka" />
             <h1 className="text-2xl font-black font-playfair italic text-white">Business Manager</h1>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Authorized Access Only</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] px-2">Portal Email</label>
                <input 
                   type="email" required 
                   className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#C5A059] transition-all"
                   placeholder="admin@smartduka.co.ke"
                   value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] px-2">Access Key</label>
                <input 
                   type="password" required 
                   className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#C5A059] transition-all"
                   placeholder="••••••••••••"
                   value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                />
             </div>
             {authError && <p className="text-red-500 text-[10px] font-bold text-center">Invalid Credentials. Security Log Initiated.</p>}
             <button type="submit" className="w-full bg-[#C5A059] text-slate-950 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-white transition-all shadow-xl">
                Enter Manager Portal
             </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'orders', icon: Package, label: 'Order Fulfillment' },
    { id: 'dispatch', icon: Hammer, label: 'Service Dispatch' },
    { id: 'fleet', icon: MapIcon, label: 'Fleet Monitor' },
    { id: 'documents', icon: FileText, label: 'Document Ledger' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 bg-[#0F172A] border-r border-white/5 flex-col p-8 z-50">
        <div className="mb-12">
          <Link to="/">
            <img src={LOGO_URL} className="h-14 object-contain mb-10" alt="Logo" />
          </Link>
          <div className="space-y-3">
             {sidebarItems.map(item => (
               <button 
                 key={item.id} 
                 onClick={() => setActiveTab(item.id as AdminTab)}
                 className={`w-full flex items-center space-x-4 p-5 rounded-2xl transition-all border ${activeTab === item.id ? 'bg-[#C5A059] text-slate-950 border-[#C5A059] shadow-xl' : 'text-slate-500 border-transparent hover:bg-white/5'}`}
               >
                 <item.icon size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="mt-auto space-y-4">
           <div className="p-6 bg-slate-950 rounded-[2rem] border border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hub Status: Online</span>
              </div>
              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">Nairobi CBD Fulfillment Center Active</p>
           </div>
           <button onClick={() => setIsAdminAuth(false)} className="w-full flex items-center justify-between p-5 rounded-2xl bg-red-500/5 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all border border-red-500/10">
              <span>Sign Out</span>
              <LogOut size={16} />
           </button>
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-grow h-screen overflow-y-auto bg-gradient-to-br from-[#020617] to-[#0F172A] p-8 lg:p-16 relative">
        
        {/* Header Stats */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
           <div>
              <h1 className="text-4xl lg:text-6xl font-black font-playfair italic tracking-tighter text-white">Manager Portal.</h1>
              <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">Global Business Oversight</p>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Revenue Today', val: 'KSh 1.2M', color: 'text-[#C5A059]' },
                { label: 'Pending Installs', val: '12', color: 'text-blue-400' },
                { label: 'Fleet Active', val: '8/10', color: 'text-green-400' },
                { label: 'Success Rate', val: '99.2%', color: 'text-purple-400' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0F172A] border border-white/5 p-6 rounded-3xl min-w-[140px] shadow-2xl">
                   <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2">{s.label}</p>
                   <p className={`text-xl font-black tracking-tighter ${s.color}`}>{s.val}</p>
                </div>
              ))}
           </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
               <div className="flex justify-between items-center bg-[#0F172A] p-4 rounded-[2rem] border border-white/5">
                  <div className="relative flex-grow max-w-md">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                     <input className="w-full bg-slate-950 border-0 rounded-2xl py-4 pl-16 pr-6 text-xs text-white outline-none" placeholder="Search orders, clients, serial numbers..." />
                  </div>
                  <button className="flex items-center space-x-3 px-8 text-slate-400 hover:text-white transition-colors">
                     <Filter size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Filter Archive</span>
                  </button>
               </div>

               <div className="bg-[#0F172A] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                     <thead className="bg-slate-950/50 border-b border-white/5">
                        <tr>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Order ID</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Client Details</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset & Service</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {orders.map(order => (
                          <tr key={order.id} className="group hover:bg-white/[0.02] transition-all">
                             <td className="p-8">
                                <span className="font-mono text-xs font-bold text-[#C5A059]">#{order.id}</span>
                                <p className="text-[9px] text-slate-600 uppercase mt-1">{order.date}</p>
                             </td>
                             <td className="p-8">
                                <div className="flex items-center space-x-4">
                                   <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 border border-white/5">
                                      <User size={18} />
                                   </div>
                                   <p className="font-bold text-sm text-white">{order.client}</p>
                                </div>
                             </td>
                             <td className="p-8">
                                <p className="text-xs font-bold text-white line-clamp-1">{order.item}</p>
                                {order.installRequested && (
                                   <div className="flex items-center space-x-2 text-blue-400 mt-1">
                                      <Hammer size={10} />
                                      <span className="text-[8px] font-black uppercase tracking-widest">Installation Included</span>
                                   </div>
                                )}
                             </td>
                             <td className="p-8">
                                <span className="font-black text-white">KSh {order.total.toLocaleString()}</span>
                             </td>
                             <td className="p-8">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                   order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                   order.status === 'Paid' ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20' :
                                   'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                   {order.status}
                                </span>
                             </td>
                             <td className="p-8 text-right">
                                <button className="p-4 rounded-xl hover:bg-white/5 text-slate-500 transition-all">
                                   <MoreVertical size={16} />
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'dispatch' && (
            <motion.div 
              key="dispatch" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="grid lg:grid-cols-12 gap-10"
            >
               <div className="lg:col-span-8 space-y-8">
                  <header className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 flex justify-between items-center">
                     <div>
                        <h3 className="text-2xl font-black font-playfair italic text-white">Service Queue</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Assign Engineers to Clients</p>
                     </div>
                     <div className="flex items-center space-x-4">
                        <div className="bg-slate-950 px-6 py-3 rounded-2xl border border-white/5 flex items-center space-x-4">
                           <Calendar size={14} className="text-[#C5A059]" />
                           <span className="text-[10px] font-black text-white">Nov 28, 2024</span>
                        </div>
                     </div>
                  </header>

                  <div className="grid grid-cols-1 gap-6">
                     {orders.filter(o => o.installRequested).map(order => (
                       <div key={order.id} className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center group hover:border-[#C5A059]/30 transition-all">
                          <div className="flex items-center space-x-8 mb-6 md:mb-0">
                             <div className="w-16 h-16 bg-slate-950 rounded-3xl flex items-center justify-center text-[#C5A059] border border-white/5 shadow-xl">
                                <Hammer size={24} />
                             </div>
                             <div>
                                <div className="flex items-center space-x-4 mb-2">
                                   <p className="text-white font-black text-lg">Order #{order.id}</p>
                                   <span className="text-[10px] font-bold text-slate-500">Client: {order.client}</span>
                                </div>
                                <div className="flex items-center space-x-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                   <span className="flex items-center space-x-2"><MapPin size={12} className="text-[#C5A059]" /> <span>Kilimani, Nairobi</span></span>
                                   <span className="flex items-center space-x-2"><Clock size={12} className="text-[#C5A059]" /> <span>14:00 - 16:00</span></span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center space-x-4 w-full md:w-auto">
                             <select className="flex-grow md:flex-grow-0 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 outline-none focus:border-[#C5A059] transition-all cursor-pointer">
                                <option>Assign Installer</option>
                                {installers.filter(i => i.status === 'Available').map(i => <option key={i.id}>{i.name}</option>)}
                             </select>
                             <button className="bg-[#C5A059] text-slate-950 p-4 rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95">
                                <UserPlus size={18} />
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <aside className="lg:col-span-4 space-y-8">
                  <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-3xl" />
                     <h4 className="text-sm font-black font-playfair italic text-white uppercase tracking-tight mb-8">Active Fleet</h4>
                     <div className="space-y-6">
                        {installers.map(installer => (
                          <div key={installer.id} className="flex items-center justify-between group">
                             <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-500 border border-white/5">
                                   <User size={20} />
                                </div>
                                <div>
                                   <p className="text-xs font-black text-white">{installer.name}</p>
                                   <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{installer.location}</p>
                                </div>
                             </div>
                             <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                               installer.status === 'Available' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                             }`}>{installer.status}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </aside>
            </motion.div>
          )}

          {activeTab === 'fleet' && (
            <motion.div 
              key="fleet" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="h-[75vh] bg-slate-900 rounded-[4rem] overflow-hidden border border-white/5 relative group shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
            >
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31910.55117323287!2d36.817223!3d-1.286389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske&dark_mode=true" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="grayscale opacity-50"
               />
               <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                        <div className="flex items-center space-x-3 mb-6 text-green-500">
                           <Signal size={16} className="animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Fleet Telemetry</span>
                        </div>
                        <div className="space-y-4">
                           {installers.filter(i => i.status !== 'Available').map(i => (
                             <div key={i.id} className="flex items-center space-x-6">
                                <div className="w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center text-slate-950 shadow-xl"><Truck size={18} /></div>
                                <div>
                                   <p className="text-xs font-black text-white">{i.name}</p>
                                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Assign: {i.activeOrder}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-center">
                     <div className="bg-[#C5A059] text-slate-950 px-12 py-5 rounded-full font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl flex items-center space-x-4">
                        <MapPin size={16} />
                        <span>Central Dispatch Console Active</span>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
             <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { label: 'Total Invoices', val: '2,840', icon: FileText },
                     { label: 'Warranty Claims', val: '14', icon: ShieldCheck },
                     { label: 'Pending Sign-offs', val: '3', icon: Clock },
                   ].map((s, i) => (
                     <div key={i} className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl group hover:border-[#C5A059]/30 transition-all">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#C5A059] mb-8 group-hover:scale-110 transition-transform">
                           <s.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">{s.label}</p>
                        <p className="text-4xl font-black text-white tracking-tighter leading-none">{s.val}</p>
                     </div>
                   ))}
                </div>

                <div className="bg-[#0F172A] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                   <div className="p-8 border-b border-white/5 flex justify-between items-center">
                      <h3 className="text-xl font-black font-playfair italic text-white">Receipt Ledger</h3>
                      <button className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] hover:underline">Download Today's Manifest</button>
                   </div>
                   <div className="divide-y divide-white/5">
                      {orders.map(order => (
                        <div key={order.id} className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                           <div className="flex items-center space-x-8">
                              <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-700 border border-white/5"><FileText size={20}/></div>
                              <div>
                                 <p className="text-sm font-black text-white tracking-tight">Invoice_{order.id}.pdf</p>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generated: {order.date} • {order.client}</p>
                              </div>
                           </div>
                           <div className="flex items-center space-x-4">
                              <button className="bg-white/5 p-4 rounded-xl text-slate-400 hover:text-white transition-all"><Eye size={16}/></button>
                              <button className="bg-white/5 p-4 rounded-xl text-slate-400 hover:text-white transition-all"><Download size={16}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] -mr-48 -mb-48 pointer-events-none" />
    </div>
  );
};

export default BusinessManager;