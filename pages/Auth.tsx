
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Mail, Lock, User, ArrowRight, Chrome, 
  Apple, Sparkles, Tv, Smartphone, Shield, Zap, CheckCircle2, 
  Eye, EyeOff, LockKeyhole
} from 'lucide-react';
import anime from 'animejs';
import { useCartStore } from '../store.ts';
import { supabase } from '../lib/api.ts';
import { LOGO_URL } from '../constants.tsx';

const Auth: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  
  const setUser = useCartStore(state => state.setUser);
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kinetic Background Animation
    (anime as any)({
      targets: '.auth-bg-icon',
      translateY: () => anime.random(-30, 30),
      translateX: () => anime.random(-20, 20),
      rotate: () => anime.random(-15, 15),
      duration: 5000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }, []);

  const handleToggle = () => {
    (anime as any)({
      targets: formRef.current,
      translateX: isSignIn ? [0, -40, 0] : [0, 40, 0],
      opacity: [1, 0, 1],
      duration: 600,
      easing: 'easeInOutQuart',
      complete: () => setIsSignIn(!isSignIn)
    });
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error(`${provider} Login Error:`, err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulated Authentication Logic for High-Fidelity Preview
    setTimeout(() => {
      if (email.includes('error')) {
        setError(true);
      } else {
        setUser({
          id: 'u_778',
          name: name || 'Valued Customer',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
          tier: 'Gold VIP',
          is_verified: true
        });
        
        const redirectUrl = searchParams.get('redirect') || '/dashboard';
        navigate(redirectUrl);
      }
      setLoading(false);
    }, 1500);
  };

  const benefits = [
    { icon: <Shield size={14} />, text: "Lifetime Warranty Ledger" },
    { icon: <Zap size={14} />, text: "Priority Technical Support" },
    { icon: <CheckCircle2 size={14} />, text: "Exclusive Member Pricing" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Assets */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="auth-bg-icon absolute top-[15%] left-[10%] text-[#C5A059] opacity-10">
            <Tv size={120} />
         </div>
         <div className="auth-bg-icon absolute bottom-[10%] right-[15%] text-[#C5A059] opacity-5">
            <Smartphone size={160} />
         </div>
         <div className="auth-bg-icon absolute top-[40%] right-[5%] text-[#C5A059] opacity-10 rotate-12">
            <Shield size={80} />
         </div>
         <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020617]/80 to-[#020617]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card relative z-10 w-full max-w-4xl grid lg:grid-cols-2 glass-elevated rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
      >
        {/* Left Side: Membership Branding */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0F172A]/50 border-r border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
           
           <div className="space-y-12 relative z-10">
              <Link to="/" className="flex items-center space-x-4 group">
                <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" />
                <span className="font-playfair text-xl font-black text-white tracking-tighter uppercase italic">SmartDuka</span>
              </Link>

              <div className="space-y-6">
                <h2 className="text-5xl font-black font-playfair italic leading-tight text-white tracking-tighter">
                   The Digital <br/><span className="text-[#C5A059]">Lounge.</span>
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
                   Unlock Nairobi's most sophisticated fulfillment ecosystem. Genuine assets, professional deployment.
                </p>
              </div>

              <div className="space-y-4">
                 {benefits.map((b, i) => (
                   <div key={i} className="flex items-center space-x-4 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059]">
                         {b.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{b.text}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="pt-12 border-t border-white/5 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-green-500">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Secured Gateway</p>
                 <p className="text-[10px] font-bold text-white uppercase">256-Bit SSL Protection</p>
              </div>
           </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div ref={formRef} className="p-10 md:p-16 space-y-10 bg-slate-950/40">
          <header className="text-center lg:text-left space-y-4">
             <h1 className="text-3xl md:text-4xl font-playfair font-black italic tracking-tighter text-white">
                {isSignIn ? 'Welcome Back' : 'Claim Your Profile'}
             </h1>
             <p className="text-slate-400 text-sm font-medium">Authorized Shop — Nairobi, Kenya</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isSignIn && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-2">Client Identity</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                    <input 
                      type="text" required placeholder="Full Name"
                      className="w-full bg-[#0F172A] border border-white/5 rounded-2xl py-4 md:py-5 pl-16 pr-8 text-white outline-none focus:border-[#C5A059] transition-all"
                      value={name} onChange={e => setName(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-2">Access Credentials</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                <input 
                  type="email" required placeholder="Secure Email"
                  className={`w-full bg-[#0F172A] border rounded-2xl py-4 md:py-5 pl-16 pr-8 text-white outline-none transition-all ${error ? 'border-red-500' : 'border-white/5 focus:border-[#C5A059]'}`}
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Security Vault Key</label>
              </div>
              <div className="relative group">
                <LockKeyhole className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required placeholder="Password"
                  className="w-full bg-[#0F172A] border border-white/5 rounded-2xl py-4 md:py-5 pl-16 pr-14 text-white outline-none focus:border-[#C5A059] transition-all"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isSignIn && (
                <div className="text-right pt-2 px-2">
                  <button type="button" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-[#C5A059] transition-colors">Forgot Security Key?</button>
                </div>
              )}
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#C5A059] text-slate-950 py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-4 shadow-2xl hover:bg-white transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : (
                <><span>{isSignIn ? 'Secure Entry' : 'Register Identity'}</span><ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="bg-[#020617] px-6 text-slate-600">Secure Direct Connect</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => handleSocialLogin('google')}
               className="flex items-center justify-center space-x-3 py-4 rounded-2xl border border-white/5 bg-white/5 text-white hover:bg-white/10 transition-all font-black uppercase text-[9px] tracking-widest"
             >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0" alt="G" />
                <span>Google</span>
             </button>
             <button 
               onClick={() => handleSocialLogin('apple')}
               className="flex items-center justify-center space-x-3 py-4 rounded-2xl border border-[#C5A059]/20 bg-[#C5A059]/5 text-white hover:bg-[#C5A059]/10 transition-all font-black uppercase text-[9px] tracking-widest"
             >
                <Apple size={16} /><span>Apple ID</span>
             </button>
          </div>

          <footer className="text-center pt-4">
             <button onClick={handleToggle} className="group flex flex-col items-center space-y-2 mx-auto">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 transition-colors group-hover:text-slate-300">
                  {isSignIn ? "New to the Smart Duka Ecosystem?" : "Already possess a registered identity?"}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] border-b border-[#C5A059]/30 pb-1 group-hover:border-[#C5A059] transition-all">
                  {isSignIn ? 'Establish Profile' : 'Navigate to Login'}
                </span>
             </button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
