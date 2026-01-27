
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Zap, Award, Search, Info } from 'lucide-react';
import { PRODUCTS } from '../constants.tsx';
import { useCartStore } from '../store.ts';

const KES_TO_USD = 0.0077; // Roughly 130 KES = 1 USD

const ParallaxCard: React.FC<{ product: any; isFeatured: boolean }> = ({ product, isFeatured }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  // Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 300 };
  const sprRotateX = useSpring(rotateX, springConfig);
  const sprRotateY = useSpring(rotateY, springConfig);

  // For the inner image parallax
  const imgX = useTransform(x, [-100, 100], [-15, 15]);
  const imgY = useTransform(y, [-100, 100], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: sprRotateX,
        rotateY: sprRotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative flex-shrink-0 cursor-pointer perspective-1000 group ${
        isFeatured ? 'w-[420px]' : 'w-[350px]'
      }`}
    >
      {/* Liquid Glass Container */}
      <div 
        className="relative h-[550px] bg-white/[0.03] backdrop-blur-[40px] rounded-[32px] overflow-hidden border border-white/10 transition-shadow duration-500 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
      >
        {/* Diamond-Cut Border Glow Overlay */}
        <div className="absolute inset-0 border border-[#C5A059]/30 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Card Content Bloom */}
        <div className="p-10 h-full flex flex-col justify-between">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[#C5A059] text-[9px] font-black uppercase tracking-[0.4em]">{product.brand}</span>
                {isFeatured && (
                  <div className="flex items-center space-x-2 bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/30">
                    <Award size={10} className="text-[#C5A059]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#C5A059]">Expert Choice</span>
                  </div>
                )}
             </div>
             <h3 className="text-2xl font-black font-playfair italic text-white leading-tight">
               {product.name}
             </h3>
          </div>

          {/* 3D Parallax Image */}
          <div className="relative h-48 flex items-center justify-center pointer-events-none" style={{ transform: "translateZ(50px)" }}>
             <motion.img 
                src={product.image}
                style={{ x: imgX, y: imgY }}
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
             />
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-end">
                <div className="relative h-10 overflow-hidden group/price">
                   <motion.div 
                     animate={{ y: isHovered ? -40 : 0 }}
                     className="transition-transform duration-500"
                   >
                      <p className="text-3xl font-black text-white tracking-tighter h-10 flex items-center">
                        KSh {product.price.toLocaleString()}
                      </p>
                      <p className="text-2xl font-black text-[#C5A059] tracking-tighter h-10 flex items-center">
                        $ {(product.price * KES_TO_USD).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                   </motion.div>
                </div>
                <Link 
                  to={`/product/${product.slug}`}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all"
                >
                   <Info size={18} />
                </Link>
             </div>

             <div className="relative">
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 right-0 pb-4"
                    >
                       <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-3 text-green-500">
                             <Zap size={12} className="fill-current" />
                             <span className="text-[8px] font-black uppercase tracking-widest">In Stock: High</span>
                          </div>
                          <div className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Nairobi Hub Ready</div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={() => addItem(product)}
                  className="w-full bg-[#C5A059] text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-white transition-all transform active:scale-95"
                >
                  Acquire Asset
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CatalogueCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredIds = ['h-u8k-75', 'app-ip15-pro']; // IDs we want to feature (wider)

  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden">
      <div className="container mx-auto px-8 lg:px-12 mb-16 flex justify-between items-end">
         <div className="space-y-4">
            <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.6em] block">Hybrid Horizon</span>
            <h2 className="text-5xl font-black font-playfair italic text-white tracking-tighter">Selected <span className="text-slate-400">Masterpieces.</span></h2>
         </div>
         <Link to="/catalogue" className="hidden md:flex items-center space-x-4 group text-slate-500 hover:text-white transition-colors">
            <span className="text-[10px] font-black uppercase tracking-widest">View Entire Vault</span>
            <div className="w-10 h-[1px] bg-slate-800 group-hover:w-16 group-hover:bg-[#C5A059] transition-all" />
         </Link>
      </div>

      <motion.div 
        ref={containerRef}
        className="flex space-x-10 px-8 lg:px-12 overflow-x-auto hide-scrollbar select-none"
        drag="x"
        dragConstraints={containerRef}
        style={{ cursor: 'grab' }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {PRODUCTS.map((product) => (
          <ParallaxCard 
            key={product.id} 
            product={product} 
            isFeatured={featuredIds.includes(product.id)} 
          />
        ))}
        {/* Duplicating for length if needed, but we have enough products to scroll */}
        {PRODUCTS.map((product) => (
          <ParallaxCard 
            key={`${product.id}-alt`} 
            product={product} 
            isFeatured={featuredIds.includes(product.id)} 
          />
        ))}
      </motion.div>

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  );
};

export default CatalogueCarousel;
