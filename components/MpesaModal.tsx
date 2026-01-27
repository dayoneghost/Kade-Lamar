
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerSTKPush, supabase } from '../lib/api.ts';
import { Smartphone, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import anime from 'animejs';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  productName: string;
  orderId: string;
}

const MpesaModal: React.FC<MpesaModalProps> = ({ isOpen, onClose, amount, productName, orderId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'awaiting_pin' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // 2.5 Realtime Subscription: Listen for Order status change
  useEffect(() => {
    if (!orderId || status !== 'awaiting_pin') return;

    const channel = supabase
      .channel(`order_updates_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          if (newStatus === 'Paid') {
            setStatus('success');
            triggerSuccessAnimation();
          } else if (newStatus === 'Payment Failed') {
            setStatus('error');
            setErrorMessage(payload.new.notes || 'Transaction cancelled or failed.');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, status]);

  const triggerSuccessAnimation = () => {
    (anime as any)({
      targets: '.success-icon',
      scale: [0.5, 1.2, 1],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutElastic(1, .5)'
    });
  };

  const handleSTKPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    // 4. Phone Formatting: Sanitizing for Safaricom 254...
    const sanitizedPhone = phoneNumber.replace(/^\+/, '').replace(/^0/, '254');
    
    setStatus('processing');
    try {
      await triggerSTKPush(orderId, sanitizedPhone, amount);
      setStatus('awaiting_pin');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to trigger M-Pesa. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
      >
        <div className="bg-[#49B642] py-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="w-20 h-20 bg-white rounded-[1.5rem] mx-auto flex items-center justify-center text-[#49B642] mb-6 shadow-xl">
            <Smartphone size={32} />
          </div>
          <h2 className="text-3xl font-black font-playfair italic">Lipa na M-Pesa</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mt-2">Nairobi Secure Gateway</p>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSTKPush}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Details</span>
                  <p className="font-bold text-slate-900 mt-2 line-clamp-1">{productName}</p>
                  <p className="text-4xl font-black text-slate-950 tracking-tighter mt-2">KSh {amount.toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">M-Pesa Number</label>
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-[#49B642] outline-none font-bold text-lg transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#49B642] text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-green-600 transition-all shadow-xl shadow-green-100"
                >
                  Request Secure STK Push
                </button>
              </motion.form>
            )}

            {(status === 'processing' || status === 'awaiting_pin') && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12 space-y-8"
              >
                <div className="relative inline-block">
                  <Loader2 className="w-16 h-16 text-[#49B642] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#49B642] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {status === 'processing' ? 'Encrypting Request...' : 'Awaiting Your PIN'}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-3 leading-relaxed">
                    {status === 'processing' 
                      ? 'Establishing a secure line to Safaricom Daraja.' 
                      : 'Please check your phone. A secure prompt is arriving in Muthaiga/Nairobi hubs.'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-center space-x-3">
                   <ShieldCheck size={16} className="text-[#49B642]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">256-Bit SSL Protection</span>
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-8"
              >
                <div className="success-icon w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center text-[#49B642]">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950">Payment Confirmed.</h3>
                  <p className="text-sm text-slate-500 font-medium mt-3 px-4">
                    Your assets are now being prepared for White-Glove delivery. A receipt has been generated.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                  View Order Status
                </button>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-10 space-y-8"
              >
                <div className="w-24 h-24 bg-red-50 rounded-full mx-auto flex items-center justify-center text-red-500">
                  <AlertCircle size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950">Vault Error.</h3>
                  <p className="text-sm text-slate-400 font-medium mt-3">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="w-full border-2 border-slate-200 text-slate-900 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                  Retry Transaction
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MpesaModal;
