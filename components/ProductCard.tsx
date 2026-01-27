import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Zap, Heart, BarChart2 } from 'lucide-react';
import { useCartStore } from '../store.ts';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addItem, updateQuantity, removeItem, wishlist, toggleWishlist, compareList, toggleCompare } = useCartStore();
  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isWishlisted = wishlist.includes(product.id);
  const isComparing = compareList.includes(product.id);

  const buttonVariants = {
    idle: { width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)' },
    active: { width: '100%', backgroundColor: 'rgba(197, 160, 89, 1)' }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, -1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product.id);
  };

  return (
    <Link 
      to={`/product/${product.slug}`}
      className={`product-card cat-card group flex flex-col transition-all duration-700 block ${quantity > 0 ? 'shadow-[0_0_25px_rgba(197,160,89,0.2)]' : ''}`}
    >
      <div className="relative aspect-[4/5] bg-[#020617] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 mb-6 md:mb-8 overflow-hidden flex items-center justify-center border border-white/5 transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] group-hover:-translate-y-2">
        
        {/* ACTION BUTTONS (TOP) */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6 z-30 flex flex-col space-y-3">
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border backdrop-blur-xl transition-all ${isWishlisted ? 'bg-[#C5A059] border-[#C5A059] text-slate-950 shadow-xl shadow-[#C5A059]/30' : 'bg-white/5 border-white/10 text-white'}`}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={handleCompare}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border backdrop-blur-xl transition-all ${isComparing ? 'bg-[#C5A059] border-[#C5A059] text-slate-950 shadow-xl shadow-[#C5A059]/30' : 'bg-white/5 border-white/10 text-white'}`}
          >
            <BarChart2 size={16} />
          </motion.button>
        </div>

        <motion.img 
          src={product.image} 
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-1000 z-20" 
          alt={product.name} 
        />

        <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 z-30 flex items-center justify-center">
          <motion.div
            layout
            initial="idle"
            animate={quantity > 0 ? "active" : "idle"}
            variants={buttonVariants}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="h-12 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center"
          >
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="idle-btn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={handleIncrement}
                  className="w-full h-full flex items-center justify-center space-x-2 md:space-x-3 text-white px-4 md:px-6 group/btn"
                >
                  <Plus size={14} className="text-[#C5A059]" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Purchase Asset</span>
                </motion.button>
              ) : (
                <motion.div
                  key="active-stepper"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-between px-4 md:px-6 text-slate-950"
                >
                  <button onClick={handleDecrement} className="p-1 md:p-2 hover:bg-black/5 rounded-lg transition-colors"><Minus size={16} strokeWidth={3} /></button>
                  <span className="text-sm md:text-lg font-black">{quantity}</span>
                  <button onClick={handleIncrement} className="p-1 md:p-2 hover:bg-black/5 rounded-lg transition-colors"><Plus size={16} strokeWidth={3} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="px-2 md:px-6 space-y-1 md:space-y-2">
        <div className="flex items-center space-x-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>{product.brand}</span>
          <div className="w-1 h-1 bg-[#C5A059]/40 rounded-full" />
          <span className={`${quantity > 0 ? 'text-[#C5A059]' : 'text-slate-600'}`}>Official Unit</span>
        </div>
        <h3 className="font-bold text-sm md:text-lg line-clamp-1 text-white group-hover:text-[#C5A059] transition-colors">{product.name}</h3>
        <p className="text-xl md:text-2xl font-black text-white tracking-tighter">KSh {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
};

export default ProductCard;