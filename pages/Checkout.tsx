import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store.ts';
import { createOrder, triggerSTKPush } from '../lib/api.ts';
import { INSTALLABLE_CATEGORIES, PRICING_ENGINE } from '../constants.tsx';
import { 
  ShieldCheck, Loader2, Smartphone, 
  ArrowRight, Star, Wallet, CheckCircle2,
  Hammer, Lock, Info, User,
  CreditCard, Utensils
} from 'lucide-react';
import anime from 'animejs';

const Checkout: React.FC = () => {
  const { 
    items, total, user, isAuthenticated, checkoutStep, setCheckoutStep, 
    paymentMethod, setPaymentMethod, addOrderToHistory, clearCart 
  } = useCartStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'pushing' | 'awaiting' | 'success' | 'error'>('idle');
  
  const [tvInstallationTier, setTvInstallationTier] = useState<'basic' | 'stealth' | 'master'>('basic');
  const [kitchenInstallRequired, setKitchenInstallRequired] = useState(false);

  const [formData, setFormData] = useState({ 
    guestName: '',
    phone: user?.phone || '', 
    city: 'Nairobi', 
    address: user?.address_metadata?.estate || '' 
  });

  const hasInstallableTV = useMemo(() => 
    items.some(item => INSTALLABLE_CATEGORIES.TV.includes(item.category)), [items]);
  
  const hasInstallableKitchen = useMemo(() => 
    items.some(item => INSTALLABLE_CATEGORIES.KITCHEN.includes(item.category)), [items]);

  const hasAnyInstallation = hasInstallableTV || hasInstallableKitchen;

  const triggerButtonShake = () => {
    (anime as any)({
      targets: '.checkout-cta',
      translateX: [-10, 10, -10, 10, 0],
      duration: 400,
      easing: 'easeInOutQuad'
    });
  };

  const tvInstallationPrices = { basic: 0, stealth: 3500, master: 8500 };
  const kitchenPrice = kitchenInstallRequired ? PRICING_ENGINE.addons.kitchenInstallation : 0;
  
  const finalTotal = useMemo(() => {
    let addOnTotal = 0;
    if (hasInstallableTV) addOnTotal += tvInstallationPrices[tvInstallationTier];
    if (hasInstallableKitchen) addOnTotal += kitchenPrice;
    return total + addOnTotal;
  }, [total, tvInstallationTier, kitchenInstallRequired, hasInstallableTV, hasInstallableKitchen]);

  useEffect(() => {
    if (orderStatus === 'awaiting') {
      const timer = setTimeout(() => setOrderStatus('success'), 5000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkoutStep === 1) {
      setCheckoutStep(hasAnyInstallation ? 2 : 3);
      return;
    }
    if (checkoutStep === 2) {
      setCheckoutStep(3);
      return;
    }

    if (!formData.phone || (!isAuthenticated && !formData.guestName)) {
      triggerButtonShake();
      return;
    }

    setLoading(true);
    setOrderStatus('pushing');

    try {
      const order = await createOrder({
        user_id: user?.id,
        total_amount: finalTotal,
        status: 'pending',
        delivery_address: { city: formData.city, address: formData.address },
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        notes: `Installation: ${hasInstallableTV ? `TV-${tvInstallationTier}` : 'N/A'}, Kitchen: ${kitchenInstallRequired ? 'Yes' : 'No'}`
      } as any);

      if (paymentMethod === 'mpesa') {
        const formattedPhone = formData.phone.replace(/^\+/, '').replace(/^0/, '254');
        await triggerSTKPush(order.id, formattedPhone, finalTotal);
        setOrderStatus('awaiting');
      } else {
        setTimeout(() => setOrderStatus('success'), 3000);
      }
      addOrderToHistory(order);
    } catch (err: any) {
      setOrderStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && orderStatus !== 'success') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-playfair italic mb-8 text-white">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="px-12 py-5 bg-[#C5A059] text-slate-900 font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all">Continue Shopping</button>
      </div>
    );
  }

  const StepHeader = ({ step, title, current, completed }: any) => (
    <div className={`flex items-center space-x-4 mb-6 transition-all ${current === step ? 'opacity-100' : 'opacity-40'}`}>
       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${completed ? 'bg-[#C5A059] border-[#C5A059] text-slate-950' : current === step ? 'border-[#C5A059] text-[#C5A059]' : 'border-slate-800 text-slate-600'}`}>
          {completed ? <CheckCircle2 size={16} /> : `0${step}`}
       </div>
       <h3 className="font-playfair text-xl font-black italic text-white">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-24 font-inter selection:bg-[#C5A059] selection:text-slate-950 overflow-x-hidden">
      <div className="container mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <motion.section initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-16">
            <header>
              <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em] mb-4 block">Secure Checkout</span>
              <h1 className="font-playfair text-5xl md:text-8xl font-black italic tracking-tighter leading-none mb-4 text-white">Delivery <br/>Details.</h1>
              <p className="text-slate-400 font-medium max-w-md">Finalize your purchase and professional setup.</p>
            </header>

            <form onSubmit={handleCheckout} className="space-y-8">
              <div className={`glass-elevated rounded-[3rem] p-10 border-2 transition-all duration-700 ${checkoutStep === 1 ? 'border-[#C5A059]/50 shadow-[0_0_50px_rgba(197,160,89,0.1)]' : 'border-white/5 opacity-50'}`}>
                <StepHeader step={1} title="Shipping Information" current={checkoutStep} completed={checkoutStep > 1} />
                <AnimatePresence>
                  {checkoutStep === 1 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-8 pt-4 overflow-hidden">
                      {!isAuthenticated && (
                        <div className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-4 flex items-center gap-2"><User size={12}/> Contact Name</p>
                          <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none" placeholder="Full Name" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[9px] uppercase font-black tracking-widest text-[#C5A059]">County / Region</label>
                            <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                               <option>Nairobi</option><option>Kiambu</option><option>Machakos</option>
                            </select>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[9px] uppercase font-black tracking-widest text-[#C5A059]">M-Pesa Number</label>
                            <input required type="tel" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none" placeholder="07XX XXX XXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[9px] uppercase font-black tracking-widest text-[#C5A059]">Street Address / Building</label>
                         <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none" placeholder="e.g. Westlands, Apartment 4B..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                      </div>
                      <button type="button" onClick={() => setCheckoutStep(hasAnyInstallation ? 2 : 3)} className="w-full bg-white/5 hover:bg-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        {hasAnyInstallation ? 'Configure Installation' : 'Proceed to Payment'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {hasAnyInstallation && (
                <div className={`glass-elevated rounded-[3rem] p-10 border-2 transition-all duration-700 ${checkoutStep === 2 ? 'border-[#C5A059]/50 shadow-[0_0_50px_rgba(197,160,89,0.1)]' : 'border-white/5 opacity-50'}`}>
                  <StepHeader step={2} title="Professional Installation" current={checkoutStep} completed={checkoutStep > 2} />
                  <AnimatePresence>
                    {checkoutStep === 2 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-8 pt-4 overflow-hidden">
                        {hasInstallableTV && (
                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">TV Setup Options</h4>
                            {[
                              { id: 'basic', label: 'Standard Wall Mount', price: 'Free', desc: 'Secure mounting on standard wall types.' },
                              { id: 'stealth', label: 'Hidden Cable Setup', price: 'KSh 3,500', desc: 'Full cable concealing for a minimalist look.' },
                              { id: 'master', label: 'Home Theater Setup', price: 'KSh 8,500', desc: 'Audio calibration and full device integration.' }
                            ].map((opt) => (
                              <button key={opt.id} type="button" onClick={() => setTvInstallationTier(opt.id as any)} className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${tvInstallationTier === opt.id ? 'bg-[#C5A059]/10 border-[#C5A059] text-white' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}>
                                  <div className="flex items-center space-x-6 text-left">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tvInstallationTier === opt.id ? 'bg-[#C5A059] text-slate-950' : 'bg-white/5'}`}><Hammer size={20}/></div>
                                    <div><p className="font-bold text-sm">{opt.label}</p><p className="text-[10px] opacity-60 mt-1">{opt.desc}</p></div>
                                  </div>
                                  <span className="font-black text-xs text-[#C5A059]">{opt.price}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {hasInstallableKitchen && (
                          <div className="space-y-6 pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Appliance Integration</h4>
                            <button 
                              type="button" 
                              onClick={() => setKitchenInstallRequired(!kitchenInstallRequired)} 
                              className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${kitchenInstallRequired ? 'bg-[#C5A059]/10 border-[#C5A059] text-white' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}
                            >
                                <div className="flex items-center space-x-6 text-left">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kitchenInstallRequired ? 'bg-[#C5A059] text-slate-950' : 'bg-white/5'}`}><Utensils size={20}/></div>
                                  <div><p className="font-bold text-sm">Built-in Kitchen Installation</p><p className="text-[10px] opacity-60 mt-1">Professional fitment by authorized engineers.</p></div>
                                </div>
                                <span className="font-black text-xs text-[#C5A059]">KSh 3,500</span>
                            </button>
                          </div>
                        )}

                        <button type="button" onClick={() => setCheckoutStep(3)} className="w-full bg-white/5 hover:bg-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Proceed to Payment</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className={`glass-elevated rounded-[3rem] p-10 border-2 transition-all duration-700 ${checkoutStep === 3 ? 'border-[#C5A059]/50 shadow-[0_0_50px_rgba(197,160,89,0.1)]' : 'border-white/5 opacity-50'}`}>
                <StepHeader step={3} title="Secure Payment" current={checkoutStep} completed={checkoutStep > 3} />
                <AnimatePresence>
                  {checkoutStep === 3 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-10 pt-4 overflow-hidden">
                       <div className="grid grid-cols-3 gap-4">
                          {[{ id: 'mpesa', icon: Smartphone, label: 'M-Pesa' }, { id: 'card', icon: CreditCard, label: 'Card' }, { id: 'paypal', icon: Wallet, label: 'PayPal' }].map(m => (
                            <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id as any)} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === m.id ? 'bg-[#C5A059]/10 border-[#C5A059] text-white' : 'bg-slate-950 border-white/5 text-slate-500'}`}>
                               <m.icon size={24} className="mb-2" /><span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                            </button>
                          ))}
                       </div>
                       {paymentMethod === 'mpesa' && (
                         <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/10 space-y-6">
                            <p className="text-xs text-slate-400">Please confirm your M-Pesa number:</p>
                            <input required type="tel" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-xl font-black text-white outline-none focus:border-[#C5A059]" placeholder="2547XX XXX XXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                         </div>
                       )}
                       <button type="submit" disabled={loading} className="checkout-cta w-full bg-[#C5A059] text-slate-950 py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[10px] flex items-center justify-center space-x-4 shadow-2xl transition-all hover:bg-white active:scale-95">
                         {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
                         <span>{loading ? 'Processing...' : `Complete Purchase — KSh ${finalTotal.toLocaleString()}`}</span>
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.section>

          <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 sticky top-32">
            <div className="glass-elevated bg-white/5 rounded-[4rem] p-12 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 space-y-12">
                  <header className="flex justify-between items-center border-b border-white/5 pb-8">
                     <h2 className="font-playfair text-3xl font-black italic text-white">Cart Summary</h2>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{items.length} Products</span>
                  </header>
                  <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 hide-scrollbar">
                     {items.map((item) => (
                       <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center space-x-6">
                             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-3 border border-white/5"><img src={item.image} className="max-w-full max-h-full object-contain" /></div>
                             <div><p className="text-white font-bold text-sm line-clamp-1">{item.name}</p><p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">KSh {item.price.toLocaleString()} × {item.quantity}</p></div>
                          </div>
                          <span className="font-black text-slate-200">KSh {(item.price * item.quantity).toLocaleString()}</span>
                       </div>
                     ))}
                  </div>
                  <div className="space-y-4 pt-10 border-t border-white/5">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Product Subtotal</span><span>KSh {total.toLocaleString()}</span></div>
                     
                     {hasInstallableTV && (
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Installation Choice</span>
                          <span className="text-[#C5A059]">+ KSh {tvInstallationPrices[tvInstallationTier].toLocaleString()}</span>
                       </div>
                     )}
                     
                     {hasInstallableKitchen && kitchenInstallRequired && (
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Appliance Fitment</span>
                          <span className="text-[#C5A059]">+ KSh {PRICING_ENGINE.addons.kitchenInstallation.toLocaleString()}</span>
                       </div>
                     )}

                     <div className="flex justify-between items-end pt-6 border-t border-white/5">
                        <span className="font-playfair text-2xl font-black italic text-white leading-none">Total Payment</span>
                        <span className="text-5xl font-black text-[#C5A059] tracking-tighter leading-none">KSh {finalTotal.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <AnimatePresence>
        {orderStatus === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[500] flex flex-col items-center justify-center text-center p-8">
             <div className="w-32 h-32 bg-[#C5A059] rounded-full flex items-center justify-center mb-12 shadow-[0_0_150px_rgba(197,160,89,0.4)]"><CheckCircle2 size={64} className="text-slate-950" /></div>
             <h2 className="font-playfair text-7xl font-black italic mb-8 tracking-tighter text-white">Order <br/><span className="text-[#C5A059]">Placed!</span></h2>
             <p className="text-slate-400 text-xl font-medium max-w-xl mb-12">Thank you for shopping with Smart Duka. Your order is being processed for same-day delivery.</p>
             <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => { clearCart(); navigate('/dashboard?tab=track'); }} className="px-12 py-6 bg-white text-slate-950 font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-[#C5A059] transition-all flex items-center space-x-4 shadow-2xl"><span>Track Delivery</span><ArrowRight size={14} /></button>
                <button onClick={() => { clearCart(); navigate('/dashboard?tab=overview'); }} className="px-12 py-6 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-white/5 transition-all">My Account</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;