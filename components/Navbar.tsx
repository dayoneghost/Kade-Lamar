import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, FileText, Package, Settings, ChevronDown, Shield } from 'lucide-react';
import { useCartStore } from '../store.ts';
import { useMobileNav } from '../hooks/useMobileNav.ts';
import MobileMenu from './MobileMenu.tsx';
import { LOGO_URL } from '../constants.tsx';
import anime from 'animejs';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { items, setIsOpen: openCart, isAuthenticated, logout, user } = useCartStore();
  const { isMobileMenuOpen, toggleMenu, closeMenu } = useMobileNav();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      if (window.innerWidth >= 1024) {
        setShowUserDropdown(prev => !prev);
      } else {
        navigate('/dashboard');
      }
    }
  };

  useEffect(() => {
    if (showUserDropdown && dropdownRef.current) {
      (anime as any)({
        targets: dropdownRef.current,
        opacity: [0, 1],
        scaleY: [0, 1],
        easing: 'easeOutExpo',
        duration: 400
      });
    }
  }, [showUserDropdown]);

  useEffect(() => {
    const handleClickOutside = () => setShowUserDropdown(false);
    if (showUserDropdown) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showUserDropdown]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-500 px-6 lg:px-12 bg-[#020617] border-b border-white/5 ${
          scrolled ? 'py-3 shadow-2xl bg-opacity-95 backdrop-blur-xl' : 'py-5'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative h-12 md:h-16 w-auto flex items-center justify-center">
                <img 
                  src={LOGO_URL} 
                  alt="Smart Duka Electronics" 
                  className="h-full w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-[0_2px_10px_rgba(197,160,89,0.3)]"
                  style={{ minWidth: '48px' }}
                />
              </div>
              <div className="ml-3 flex flex-col justify-center">
                <span className="font-playfair text-xl md:text-2xl font-black italic text-white tracking-tighter uppercase leading-none whitespace-nowrap">
                  Smart<span className="text-[#C5A059]">Duka</span>
                </span>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059] mt-1 hidden sm:block">
                  Premium Shopping.
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex flex-grow justify-center items-center space-x-10">
            {[
              { name: 'Shop All', path: '/catalogue' },
              { name: 'Installation', path: '/booking' },
              { name: 'Blog', path: '/blog' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact', path: '/contact' }
            ].map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="relative text-[10px] uppercase tracking-[0.3em] font-black text-slate-300 hover:text-[#C5A059] transition-all group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C5A059] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 md:space-x-8">
            <button 
              onClick={() => openCart(true)}
              className="relative p-2 text-white hover:text-[#C5A059] transition-all active:scale-90"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-slate-900 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {itemCount}
                </span>
              )}
            </button>
            
            <div className="relative">
              <button 
                onClick={handleUserClick}
                className="flex items-center space-x-3 group p-2 outline-none focus:ring-0"
              >
                {isAuthenticated && user?.avatar ? (
                  <div className="relative">
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-[#C5A059] group-hover:scale-110 transition-transform" />
                  </div>
                ) : (
                  <div className={`transition-all hover:scale-110 ${isAuthenticated ? 'text-[#C5A059]' : 'text-white hover:text-[#C5A059]'}`}>
                    <User size={22} />
                  </div>
                )}
                {isAuthenticated && <ChevronDown size={14} className={`hidden lg:block text-slate-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />}
              </button>

              {showUserDropdown && isAuthenticated && (
                <div 
                  ref={dropdownRef}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full pt-4 w-72 z-[200] origin-top hidden lg:block"
                >
                  <div className="glass-elevated rounded-[2.5rem] p-8 space-y-6 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 bg-[#0F172A]">
                    <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
                       <img src={user?.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
                       <div className="min-w-0">
                          <p className="text-sm font-black text-white truncate mb-2">{user?.name}</p>
                          <div className="flex items-center space-x-2 text-[#C5A059]">
                             <Shield size={10} />
                             <span className="text-[9px] font-black uppercase tracking-widest">{user?.tier}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                      <Link to="/dashboard?tab=track" onClick={() => setShowUserDropdown(false)} className="flex items-center space-x-4 text-xs font-bold text-slate-300 hover:text-[#C5A059] transition-all p-3 rounded-2xl hover:bg-white/5">
                        <Package size={16} /><span>Track Orders</span>
                      </Link>
                      <Link to="/dashboard?tab=ledger" onClick={() => setShowUserDropdown(false)} className="flex items-center space-x-4 text-xs font-bold text-slate-300 hover:text-[#C5A059] transition-all p-3 rounded-2xl hover:bg-white/5">
                        <FileText size={16} /><span>Order History</span>
                      </Link>
                      <Link to="/dashboard?tab=security" onClick={() => setShowUserDropdown(false)} className="flex items-center space-x-4 text-xs font-bold text-slate-300 hover:text-[#C5A059] transition-all p-3 rounded-2xl hover:bg-white/5">
                        <Settings size={16} /><span>Account Settings</span>
                      </Link>
                    </div>

                    <button 
                      onClick={() => { logout(); navigate('/'); setShowUserDropdown(false); }}
                      className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-red-400 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10 mt-2"
                    >
                      <span>Sign Out</span>
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={toggleMenu} className="lg:hidden p-2 text-white active:scale-90 transition-transform">
               {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMenu} />
    </>
  );
};

export default Navbar;