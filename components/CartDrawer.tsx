
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store.ts';

const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total } = useCartStore();
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg glass-elevated text-white z-[201] flex flex-col"
            >
              <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <ShoppingBag size={22} className="text-[#C5A059]" />
                  <h2 className="font-playfair text-xl md:text-2xl font-bold italic">Selected Items</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:text-[#C5A059] transition-all hover:scale-125">
                  <X size={28} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 md:p-10 space-y-10 hide-scrollbar">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <ShoppingBag size={64} strokeWidth={1} className="mb-6" />
                    <p className="font-inter text-xs uppercase tracking-[0.4em] font-black">Your selection is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex space-x-6 md:space-x-8 items-center group">
                      <div className="w-20 h-20 md:w-28 md:h-28 bg-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-center justify-center border border-white/5 overflow-hidden shadow-inner">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xs md:text-sm font-bold line-clamp-2 max-w-[150px] md:max-w-[200px] leading-relaxed">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-slate-600 hover:text-[#C5A059] transition-all opacity-0 group-hover:opacity-100 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-[#C5A059] font-black text-base md:text-lg tracking-tighter">KSh {item.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-6 pt-2">
                          <div className="flex items-center bg-white/5 rounded-xl px-3 py-1.5 space-x-4 border border-white/5">
                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-[#C5A059] transition-colors"><Minus size={14}/></button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-[#C5A059] transition-colors"><Plus size={14}/></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 md:p-10 border-t border-white/5 bg-slate-950/40 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Order Subtotal</span>
                    <div className="flex items-center space-x-2 text-[#C5A059]">
                      <ShieldCheck size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Authorized Warranty Included</span>
                    </div>
                  </div>
                  <p className="text-3xl md:text-4xl font-black tracking-tighter">KSh {total.toLocaleString()}</p>
                </div>
                <button 
                  onClick={handleCheckoutRedirect}
                  className="w-full bg-[#C5A059] text-slate-900 py-6 md:py-7 rounded-[1.25rem] md:rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(197,160,89,0.2)] disabled:opacity-20 disabled:grayscale flex items-center justify-center space-x-4"
                  disabled={items.length === 0}
                >
                  <span>Complete Purchase</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
