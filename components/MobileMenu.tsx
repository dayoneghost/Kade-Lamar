
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronRight, Instagram, Facebook, Youtube, User, LogOut, Package, List, Settings } from 'lucide-react';
import { useCartStore } from '../store.ts';
import { LOGO_URL } from '../constants.tsx';
import anime from 'animejs';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      (anime as any)({
        targets: backdropRef.current,
        opacity: [0, 1],
        duration: 400,
        easing: 'linear'
      });

      (anime as any)({
        targets: drawerRef.current,
        translateX: ['100%', '0%'],
        duration: 600,
        easing: 'easeOutQuart'
      });

      (anime as any)({
        targets: '.mobile-nav-link, .mobile-user-card',
        translateX: [40, 0],
        opacity: [0, 1],
        delay: anime.stagger(80, { start: 200 }),
        easing: 'easeOutQuart'
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    (anime as any)({
      targets: drawerRef.current,
      translateX: '100%',
      duration: 500,
      easing: 'easeInQuart',
      complete: onClose
    });
    (anime as any)({
      targets: backdropRef.current,
      opacity: 0,
      duration: 500,
      easing: 'linear'
    });
  };

  if (!isOpen) return null;

  const links = [
    { name: 'Browse Shop', path: '/catalogue' },
    { name: 'Guides & Blog', path: '/blog' },
    { name: 'TV Mounting', path: '/booking' },
    { name: 'Our Story', path: '/about' },
    { name: 'Help & Contact', path: '/contact' }
  ];

  return (
    <div className="fixed inset-0 z-[150] lg:hidden">
      <div 
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0"
      />

      <div 
        ref={drawerRef}
        className="absolute top-0 right-0 h-full w-[85vw] max-w-sm glass-elevated flex flex-col translate-x-full border-l border-white/10 overflow-hidden"
      >
        <div className="p-8 flex justify-between items-center border-b border-white/5 bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <img src={LOGO_URL} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-playfair text-xl font-black italic text-white tracking-tighter">
              Smart<span className="text-[#C5A059]">Duka</span>
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-10 bg-slate-950/20">
          <div className="mobile-user-card p-8 bg-white/5 rounded-[2.5rem] border border-white/10 mb-6 opacity-0 shadow-2xl">
             {isAuthenticated ? (
               <div className="space-y-8">
                 <div className="flex items-center space-x-6">
                   <div className="w-16 h-16 bg-[#C5A059] rounded-2xl flex items-center justify-center text-slate-950 shadow-xl shadow-[#C5A059]/20 overflow-hidden">
                     {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={32} />}
                   </div>
                   <div className="flex-grow min-w-0">
                     <p className="text-white font-black text-lg truncate leading-none">{user?.name}</p>
                     <p className="text-[9px] text-[#C5A059] font-black uppercase tracking-widest mt-2">{user?.tier} Member</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                   <Link to="/dashboard" onClick={handleClose} className="flex flex-col items-center p-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-slate-950 transition-all">
                     <Package size={20} className="mb-3" />
                     <span>Account</span>
                   </Link>
                   <button onClick={() => { logout(); handleClose(); navigate('/'); }} className="flex flex-col items-center p-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all">
                     <LogOut size={20} className="mb-3" />
                     <span>Logout</span>
                   </button>
                 </div>
               </div>
             ) : (
               <div className="text-center space-y-6 py-4">
                 <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto text-slate-600 mb-2">
                    <User size={24} />
                 </div>
                 <p className="text-sm text-slate-400 font-medium px-4">Sign in to manage your orders and profile.</p>
                 <Link 
                   to="/auth" 
                   onClick={handleClose}
                   className="block w-full bg-[#C5A059] text-slate-950 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-[#C5A059]/10"
                 >
                   Sign In Now
                 </Link>
               </div>
             )}
          </div>

          <div className="space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 block">Navigation</span>
            {links.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                onClick={handleClose}
                className="mobile-nav-link flex items-center justify-between py-5 border-b border-white/5 group opacity-0"
              >
                <span className="font-playfair text-2xl font-black italic text-white group-hover:text-[#C5A059] transition-colors">{link.name}</span>
                <ChevronRight size={18} className="text-slate-700 group-hover:text-[#C5A059] transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-slate-900/40 flex flex-col items-center space-y-6">
           <div className="flex space-x-6">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:text-[#C5A059] transition-colors"><Instagram size={20}/></a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:text-[#C5A059] transition-colors"><Facebook size={20}/></a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:text-[#C5A059] transition-colors"><Youtube size={20}/></a>
           </div>
           <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest italic">Nairobi CBD — Official Partner Shop</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
