import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store.ts';
import { 
  ShieldCheck, Clock, FileText, 
  Award, Smartphone, 
  Download, Shield, ArrowRight, Loader2, QrCode, LayoutDashboard, Bell, LogOut, ShieldAlert,
  MapPin, Edit3, Save, User as UserIcon, Phone, CheckCircle2, Package, Search, Truck, Settings,
  BarChart2, X, ShoppingCart, Zap, Navigation, Signal, ArrowLeft
} from 'lucide-react';
import { Navigate, useNavigate, Link, useSearchParams } from 'react-router-dom';
import anime from 'animejs';
import jsPDF from 'jspdf';
import { PRODUCTS, LOGO_URL, EMAIL_SUPPORT } from '../constants.tsx';
import { broadcastTelemetry } from '../lib/api.ts';

type DashboardTab = 'overview' | 'ledger' | 'track' | 'security' | 'compare';

const Dashboard: React.FC = () => {
  const { 
    isAuthenticated, user, logout, lifetimeSpend, orderHistory, updateProfile, 
    compareList, toggleCompare, clearCompare, addItem, setIsOpen: openCart 
  } = useCartStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = (searchParams.get('tab') as DashboardTab) || 'overview';
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [mfaEnabled, setMfaEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isSimulating) return;
    let step = 0;
    const interval = setInterval(() => {
      const order = orderHistory.find(o => o.status === 'shipped' || o.id === 'ORD_7721');
      if (order) {
        step += 1;
        broadcastTelemetry({
          id: step,
          order_id: order.id,
          latitude: -1.286389 + (step * 0.0005),
          longitude: 36.817223 + (step * 0.0008),
          heading: 45 + (Math.sin(step) * 5),
          speed: 40 + (Math.random() * 20),
          created_at: new Date().toISOString()
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulating, orderHistory]);

  const loyaltyProgress = Math.min((lifetimeSpend / 1500000) * 100, 100);

  const compareItems = useMemo(() => 
    PRODUCTS.filter(p => compareList.includes(p.id)), [compareList]
  );

  const handleTabChange = (tab: DashboardTab) => {
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleDownloadInvoice = async (order: any) => {
    setDownloading(order.id);
    try {
      const doc = new jsPDF({
        compress: true,
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const goldColor = [197, 160, 89];
      const obsidianColor = [2, 6, 23];

      doc.setFillColor(obsidianColor[0], obsidianColor[1], obsidianColor[2]);
      doc.rect(0, 0, 210, 297, 'F');

      try {
        doc.addImage(LOGO_URL, 'PNG', 15, 15, 25, 25);
      } catch (e) {
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFontSize(22);
        doc.text("SMART DUKA", 15, 25);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Smart Duka Electronics", 50, 20);
      doc.setFont("helvetica", "normal");
      doc.text("Tom Mboya Nairobi, Kenya", 50, 25);
      doc.text("WhatsApp: 0742721309 | Call: 0742721309", 50, 30);
      doc.text(`Support: ${EMAIL_SUPPORT}`, 50, 35);

      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("RECEIPT", 145, 25);

      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.5);
      doc.line(15, 45, 195, 45);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("ORDER SUMMARY", 15, 55);
      
      doc.setTextColor(150, 150, 150);
      doc.text("ORDER ID:", 15, 62);
      doc.text("PAYMENT REF:", 15, 68);
      doc.text("DATE:", 15, 74);

      doc.setTextColor(255, 255, 255);
      doc.text(`#${order.id}`, 45, 62);
      doc.text(order.mpesa_receipt || "QWX88921L", 45, 68);
      doc.text(new Date(order.created_at).toLocaleDateString(), 45, 74);

      doc.text("CUSTOMER DETAILS", 120, 55);
      doc.setTextColor(150, 150, 150);
      doc.text("NAME:", 120, 62);
      doc.text("PHONE:", 120, 68);
      doc.setTextColor(255, 255, 255);
      doc.text(user?.name || "Guest Client", 145, 62);
      doc.text(user?.phone || "0742721309", 145, 68);

      doc.setFillColor(30, 41, 59);
      doc.rect(15, 85, 180, 10, 'F');
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(8);
      doc.text("PRODUCT / SERVICE", 20, 91);
      doc.text("WARRANTY NO.", 100, 91);
      doc.text("QTY", 140, 91);
      doc.text("PRICE (KSH)", 170, 91);

      let yPos = 105;
      const orderItems = order.items || [{ name: "Electronic Asset", price: order.total_amount }];
      orderItems.forEach((item: any) => {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(item.name.substring(0, 35), 20, yPos);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("SD-WARRANTY-ACT", 100, yPos);
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text("01", 142, yPos);
        doc.text(item.price.toLocaleString(), 170, yPos);
        yPos += 12;
      });

      doc.setDrawColor(255, 255, 255, 0.1);
      doc.line(15, yPos, 195, yPos);
      yPos += 10;
      doc.setTextColor(150, 150, 150);
      doc.text("Subtotal", 140, yPos);
      doc.setTextColor(255, 255, 255);
      doc.text(`KSh ${order.total_amount.toLocaleString()}`, 170, yPos);
      
      yPos += 6;
      doc.setTextColor(150, 150, 150);
      doc.text("Tax (Incl.)", 140, yPos);
      doc.setTextColor(255, 255, 255);
      doc.text(`KSh ${(order.total_amount * 0.16).toLocaleString()}`, 170, yPos);

      yPos += 12;
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(135, yPos - 8, 60, 12, 'F');
      doc.setTextColor(obsidianColor[0], obsidianColor[1], obsidianColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("GRAND TOTAL", 140, yPos);
      doc.text(`KSh ${order.total_amount.toLocaleString()}`, 170, yPos);

      yPos = 240;
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(15, yPos, 180, 40);
      
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(12);
      doc.text("OFFICIAL WARRANTY CERTIFICATE", 25, yPos + 10);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const expiry = new Date(order.created_at);
      expiry.setFullYear(expiry.getFullYear() + 1);
      doc.text(`VALID UNTIL: ${expiry.toLocaleDateString()}`, 25, yPos + 20);
      doc.text("SERVICE CENTER: Smart House, Nairobi", 25, yPos + 26);
      doc.text("STATUS: AUTHENTICATED", 25, yPos + 32);

      doc.rect(160, yPos + 5, 30, 30);
      doc.setFontSize(6);
      doc.text("SCAN FOR AUTH", 163, yPos + 38);

      doc.save(`SmartDuka_Order_${order.id}.pdf`);
    } catch (err) {
      console.error("PDF failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  if (!isAuthenticated) return <Navigate to="/auth" />;

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'track', icon: Truck, label: 'Tracking' },
    { id: 'ledger', icon: FileText, label: 'Orders' },
    { id: 'compare', icon: BarChart2, label: 'Compare' },
    { id: 'security', icon: Settings, label: 'Account' }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row overflow-hidden relative">
      <nav className="fixed top-0 right-0 z-[110] bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 lg:px-12 w-full lg:w-[calc(100%-280px)] lg:left-[280px]">
        <div className="flex justify-between items-center w-full">
           <Link to="/" className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={16} /> <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Back to Shop</span></Link>
           <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{user?.name}</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Member Dashboard</p>
              </div>
              <img src={user?.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="Profile" />
           </div>
        </div>
      </nav>

      <aside className="hidden lg:flex lg:w-[280px] lg:h-screen bg-[#0F172A] border-r border-white/5 z-[120] p-8 flex-col sticky top-0">
        <div className="mb-12">
          <Link to="/" className="flex items-center mb-12">
            <img src={LOGO_URL} alt="Smart Duka Logo" className="h-16 w-auto object-contain" />
          </Link>
          <div className="space-y-3">
             {navItems.map((item) => (
               <button key={item.id} onClick={() => handleTabChange(item.id as DashboardTab)} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all border ${activeTab === item.id ? 'bg-[#C5A059] text-slate-950 border-[#C5A059]' : 'text-slate-500 border-transparent hover:bg-white/5'}`}>
                 <item.icon size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
               </button>
             ))}
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 text-red-400 text-[9px] font-black uppercase tracking-widest mt-auto hover:bg-red-500/10 transition-all">
          <span>Sign Out</span>
          <LogOut size={14} />
        </button>
      </aside>

      <main className="flex-grow min-h-screen overflow-y-auto p-6 lg:p-12 xl:p-20 pt-28 lg:pt-36 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#020617] pb-36 lg:pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'ledger' && (
            <motion.div key="ledger" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-12 lg:space-y-16">
               <header>
                 <h1 className="text-4xl md:text-7xl font-black font-playfair italic text-white tracking-tighter">Order History.</h1>
                 <p className="text-slate-500 text-base mt-6 font-medium max-w-xl">Review your previous purchases and download your warranty certificates.</p>
               </header>

               <div className="grid grid-cols-1 gap-6">
                  {orderHistory.map(order => (
                    <div key={order.id} className="bg-white/5 rounded-[2.5rem] p-8 md:p-10 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white/[0.08] transition-all">
                       <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 w-full md:w-auto">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-950 rounded-3xl flex items-center justify-center border border-white/5">
                            <Package className="text-[#C5A059] opacity-40" size={32} />
                          </div>
                          <div className="space-y-2 text-center sm:text-left">
                             <div className="flex items-center space-x-4 justify-center sm:justify-start">
                               <p className="text-white font-black text-xl leading-none">Order #{order.id}</p>
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${order.status === 'Paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>{order.status}</span>
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(order.created_at).toLocaleDateString()} • {order.items?.[0]?.name || "Product Item"}</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="px-6 py-4 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/5">
                            <span className="text-lg font-black text-white tracking-tighter">KSh {order.total_amount.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => handleDownloadInvoice(order)} 
                            disabled={downloading === order.id} 
                            className="flex items-center space-x-3 bg-[#C5A059] text-slate-950 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                          >
                             {downloading === order.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                             <span>{downloading === order.id ? 'Generating...' : 'Invoice'}</span>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <h2 className="text-3xl font-playfair italic text-white mb-4">Account Overview Active</h2>
              <p className="text-slate-500 max-w-md mx-auto">Manage your profile, track active deliveries, and review your order history from the sidebar navigation.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;