
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../constants.tsx';

const CategoryCard: React.FC<{ category: any; isFeatured: boolean }> = ({ category, isFeatured }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const springConfig = { damping: 25, stiffness: 400 };
  const sprRotateX = useSpring(rotateX, springConfig);
  const sprRotateY = useSpring(rotateY, springConfig);

  const imgX = useTransform(x, [-100, 100], [-20, 20]);
  const imgY = useTransform(y, [-100, 100], [-20, 20]);

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
        isFeatured ? 'w-[450px]' : 'w-[320px]'
      }`}
    >
      <Link to="/catalogue">
        <div 
          className="relative h-[480px] bg-white/[0.03] backdrop-blur-[40px] rounded-[32px] overflow-hidden border border-white/10 transition-shadow duration-700 group-hover:shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
        >
          {/* Shimmer Border */}
          <div className="absolute inset-0 border border-[#C5A059]/20 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="p-10 h-full flex flex-col justify-between relative z-10">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[#C5A059] text-[9px] font-black uppercase tracking-[0.6em]">Department</span>
                  {isFeatured && <Sparkles size={14} className="text-[#C5A059]" />}
               </div>
               <h3 className="text-3xl md:text-4xl font-black font-playfair italic text-white leading-tight">
                 {category.name}
               </h3>
            </div>

            {/* Parallax Depth Image */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000">
               <motion.img 
                  src={category.image}
                  style={{ x: imgX, y: imgY, scale: 1.2 }}
                  className="w-full h-full object-cover"
               />
            </div>

            <div className="space-y-6">
               <div className="flex items-center space-x-4">
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]"
                      >
                        Browse Collection
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#C5A059] group-hover:text-slate-950 transition-all">
                     <ArrowRight size={18} />
                  </div>
               </div>
            </div>
          </div>
          
          {/* Expressive Bloom metadata */}
          <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-full group-hover:translate-y-0 transition-transform duration-700 bg-gradient-to-t from-slate-950 to-transparent">
             <div className="flex items-center space-x-4">
                <Zap size={14} className="text-[#C5A059]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">40+ Premium Assets</span>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CategoryCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuredNames = ["OLED & QLED TVs", "Smart Appliances"];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-8 lg:px-12 mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
         <div className="space-y-4">
            <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em] block">Hybrid Horizon</span>
            <h2 className="text-5xl md:text-7xl font-black font-playfair italic text-white tracking-tighter">
              Bespoke <span className="text-slate-500">Categories.</span>
            </h2>
         </div>
         
         {/* Navigation Controls */}
         <div className="flex items-center space-x-4">
            <button 
              onClick={() => scroll('left')}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all active:scale-90"
            >
               <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all active:scale-90"
            >
               <ChevronRight size={24} />
            </button>
            <div className="w-10 h-[1px] bg-white/10 ml-6 hidden md:block" />
            <Link to="/catalogue" className="hidden md:flex items-center space-x-4 group text-slate-500 hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest ml-4">Explore Vault</span>
            </Link>
         </div>
      </div>

      <motion.div 
        ref={scrollRef}
        className="flex space-x-12 px-8 lg:px-12 overflow-x-auto hide-scrollbar select-none py-4"
        drag="x"
        dragConstraints={{ left: -1500, right: 0 }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            isFeatured={featuredNames.includes(cat.name)} 
          />
        ))}
        {/* Fill the track for visual depth */}
        {CATEGORIES.map((cat) => (
          <CategoryCard 
            key={`${cat.id}-alt`} 
            category={cat} 
            isFeatured={featuredNames.includes(cat.name)} 
          />
        ))}
      </motion.div>

      {/* Ambiance Lighting */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
};

export default CategoryCarousel;
