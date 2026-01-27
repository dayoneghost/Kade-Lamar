import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CAROUSEL_DATA, PRODUCTS, REVIEWS } from '../constants.tsx';
import { useCartStore } from '../store.ts';
import { 
  Plus, ArrowRight, ShieldCheck, Truck, Award, Zap, 
  ChevronLeft, ChevronRight, Star, MapPin, ExternalLink, Shield, CheckCircle2, Quote, Phone
} from 'lucide-react';
import anime from 'animejs';
import CategoryCarousel from '../components/CategoryCarousel.tsx';
import ProductCard from '../components/ProductCard.tsx';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  const homeGridProducts = Array.from({ length: 50 }, (_, i) => ({
    ...PRODUCTS[i % PRODUCTS.length],
    id: `home-p-${i}`
  }));

  const bestOf10 = PRODUCTS.slice(0, 4).map((p, i) => ({
    ...p,
    rank: `0${i + 1}`,
    specs: Object.entries(p.technicalSpecs).slice(0, 3).map(([k, v]) => ({ label: k, value: v }))
  }));

  const [activeSpotlight, setActiveSpotlight] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % CAROUSEL_DATA.length), 10000);
    
    (anime as any)({
      targets: '.product-card',
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: anime.stagger(60, { grid: [4, 13], from: 'center' }),
      duration: 800,
      easing: 'easeOutQuart'
    });

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_DATA.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_DATA.length) % CAROUSEL_DATA.length);

  return (
    <div className="flex flex-col w-full bg-[#0F172A]">
      <section className="relative w-full h-screen bg-[#020617] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img 
              src={CAROUSEL_DATA[currentSlide].image} 
              className="w-full h-full object-cover opacity-40"
              alt={CAROUSEL_DATA[currentSlide].title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl space-y-8 md:space-y-10">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em] mb-6 md:mb-8 block">
                  {CAROUSEL_DATA[currentSlide].subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white font-playfair italic mb-6 md:mb-8 leading-[0.9] tracking-tighter">
                  {CAROUSEL_DATA[currentSlide].title}
                </h1>
                <p className="text-slate-300 text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 leading-relaxed max-w-2xl font-medium">
                  {CAROUSEL_DATA[currentSlide].desc}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
                  <Link to="/catalogue" className="w-full sm:w-auto bg-[#C5A059] text-slate-900 px-12 md:px-14 py-5 md:py-6 rounded-full flex items-center justify-center font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:scale-105 transition-all shadow-2xl active:scale-95">
                    Explore Shop
                  </Link>
                  <button className="group flex items-center space-x-4 text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Our Story</span>
                    <div className="w-12 h-[1px] bg-white/30 group-hover:w-20 group-hover:bg-[#C5A059] transition-all"></div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-6 md:bottom-16 md:right-16 z-30 flex items-center space-x-4 md:space-x-6">
          <button onClick={prevSlide} className="w-12 h-12 md:w-16 md:h-16 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div className="flex space-x-2 md:space-x-3">
            {CAROUSEL_DATA.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-700 rounded-full ${i === currentSlide ? 'w-10 md:w-16 bg-[#C5A059]' : 'w-3 md:w-4 bg-white/20'}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="w-12 h-12 md:w-16 md:h-16 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-90">
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <CategoryCarousel />

      <section id="catalogue" className="py-24 md:py-40 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#020617] to-transparent opacity-50" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-32">
            <div className="max-w-3xl mb-8 md:mb-0">
              <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Our Collection</span>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 font-playfair italic leading-none text-white">Latest <br/><span className="text-slate-400">Inventory.</span></h2>
              <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl">Browse over 2,200 authentic electronics for your home and office in Kenya.</p>
            </div>
            <Link to="/catalogue" className="pb-4 group flex items-center space-x-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Full Collection</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-[#C5A059]" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-12 md:gap-y-24">
            {homeGridProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section ref={spotlightRef} className="py-24 md:py-32 bg-[#0F172A] relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row min-h-[60vh] lg:min-h-[80vh] bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] border border-white/10 overflow-hidden">
             <div className="w-full lg:w-[70%] relative flex items-center justify-center p-12 md:p-20 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpotlight}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                  >
                    <img 
                      src={bestOf10[activeSpotlight].image} 
                      className="max-w-full max-h-[40vh] md:max-h-[60vh] object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                      alt={bestOf10[activeSpotlight].name}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] md:opacity-5">
                   <span className="text-[10rem] md:text-[20rem] font-black uppercase text-[#C5A059] font-playfair">{bestOf10[activeSpotlight].brand}</span>
                </div>
                <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex space-x-4 md:space-x-6">
                  <button 
                    onClick={() => setActiveSpotlight(prev => (prev - 1 + bestOf10.length) % bestOf10.length)}
                    className="w-12 h-12 md:w-16 md:h-16 border border-[#C5A059] rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-slate-900 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveSpotlight(prev => (prev + 1) % bestOf10.length)}
                    className="w-12 h-12 md:w-16 md:h-16 border border-[#C5A059] rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-slate-900 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
             </div>
             <div className="w-full lg:w-[30%] p-10 md:p-16 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/5 space-y-8 md:space-y-12">
               <motion.div
                 key={`data-${activeSpotlight}`}
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="space-y-6 md:space-y-10"
               >
                 <span className="text-[#C5A059] font-mono text-[10px] tracking-[0.5em] block">{bestOf10[activeSpotlight].rank} / FEATURED ITEM</span>
                 <h3 className="text-3xl md:text-5xl font-black font-playfair italic text-white tracking-tighter leading-tight">
                   {bestOf10[activeSpotlight].name}
                 </h3>
                 <button 
                    onClick={() => { addItem(bestOf10[activeSpotlight]); navigate('/checkout'); }}
                    className="w-full bg-[#C5A059] text-slate-900 py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all shadow-2xl"
                 >
                   Buy Now
                 </button>
               </motion.div>
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-[#020617] border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
             <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em] mb-6 block">Customer Reviews</span>
             <h2 className="text-5xl md:text-7xl font-black font-playfair italic text-white tracking-tighter leading-none">Verified Buyers.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-white/5 p-10 md:p-12 rounded-[3rem] border border-white/5 space-y-8 relative overflow-hidden group">
                <Quote className="absolute top-10 right-10 text-[#C5A059] opacity-10 group-hover:opacity-20 transition-opacity" size={60} />
                <div className="flex space-x-1">
                   {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#C5A059" className="text-[#C5A059]" />)}
                </div>
                <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed italic">"{rev.text}"</p>
                <div className="flex items-center space-x-4 pt-8 border-t border-white/5">
                  <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center font-black text-slate-900">{rev.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-white">{rev.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{rev.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
             <a href="https://share.google/6JOgBWtHDWlcHOIPr" target="_blank" className="flex items-center space-x-4 bg-white/5 px-10 py-5 rounded-full border border-white/5 hover:bg-white/10 transition-all group">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">View Google Reviews</span>
                <ExternalLink size={14} className="text-[#C5A059] group-hover:translate-x-1 transition-transform" />
             </a>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-[#0F172A] relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 reveal-item">
               <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em]">Visit Us</span>
               <h2 className="text-5xl md:text-8xl font-black font-playfair italic text-white tracking-tighter leading-none">Flagship <br/><span className="text-slate-400">Showroom.</span></h2>
               <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059] flex-shrink-0"><MapPin size={24}/></div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Smart House, 4th Floor</h4>
                      <p className="text-slate-400 font-medium">Kimathi Street, Nairobi CBD. Conveniently located for all your electronic needs.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059] flex-shrink-0"><MapPin size={24}/></div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Easy Access</h4>
                      <p className="text-slate-400 font-medium">Visit us for live product demos and expert advice on the best setups for your home.</p>
                    </div>
                  </div>
               </div>
               <div className="pt-8 flex flex-col sm:flex-row gap-6">
                  <a href="https://maps.app.goo.gl/yY7xYjS9vP8u6A8y7" target="_blank" className="bg-white text-slate-900 px-12 py-5 rounded-full flex items-center justify-center font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#C5A059] transition-all shadow-2xl">
                    Get Directions
                  </a>
                  <a href="tel:0742721309" className="border border-white/10 px-12 py-5 rounded-full flex items-center justify-center font-black uppercase tracking-[0.3em] text-[10px] text-white hover:bg-white/5 transition-all group">
                    <Phone size={14} className="mr-3 text-[#C5A059] group-hover:scale-110 transition-transform" />
                    Call Showroom
                  </a>
               </div>
            </div>
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-slate-900 rounded-[4rem] overflow-hidden border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m1!1s0x182f10d616853285:0xbd910609339e38e!2sSmart%20Duka%20Electronics!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske&dark_mode=true" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-1000"
               />
               <div className="absolute inset-0 pointer-events-none border-[20px] border-[#0F172A]" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-[#0F172A] border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 text-center">
           <div className="max-w-3xl mx-auto space-y-12">
             <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em]">Genuine Electronics</span>
             <h2 className="text-4xl md:text-6xl font-black font-playfair italic text-white tracking-tighter">Authorized Partner Shop.</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-10">
                <div className="flex flex-col items-center space-y-4 opacity-40 hover:opacity-100 transition-opacity">
                   <Shield size={48} className="text-[#C5A059]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">GENUINE PRODUCTS</span>
                </div>
                <div className="flex col-span-1 items-center space-y-4 opacity-40 hover:opacity-100 transition-opacity">
                   <Award size={48} className="text-[#C5A059]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">LOCAL WARRANTY</span>
                </div>
                <div className="flex flex-col items-center space-y-4 opacity-40 hover:opacity-100 transition-opacity">
                   <Zap size={48} className="text-[#C5A059]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">FAST DELIVERY</span>
                </div>
                <div className="flex flex-col items-center space-y-4 opacity-40 hover:opacity-100 transition-opacity">
                   <CheckCircle2 size={48} className="text-[#C5A059]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">VERIFIED SHOP</span>
                </div>
             </div>
           </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-[#0F172A] text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-[#C5A059]/5 via-transparent to-transparent opacity-30" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Award size={40} className="text-[#C5A059] mx-auto mb-10 md:mb-12" />
          <p className="text-2xl md:text-4xl font-playfair italic leading-relaxed text-slate-200">
            "We are committed to bringing authentic, high-quality electronics to the Kenyan market with professional service you can trust."
          </p>
          <div className="mt-20 pt-10 border-t border-white/5">
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500">Established 2018 — Nairobi, Kenya</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;