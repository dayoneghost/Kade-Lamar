
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Truck, Star, ChevronRight, MessageSquare, Award, Zap,
  ChevronLeft, Play, ExternalLink, Package, Shield, Volume2, X,
  CheckCircle2, Info, MapPin, Heart, BarChart2, Quote, Camera, ArrowRight
} from 'lucide-react';
import { PRODUCTS } from '../constants.tsx';
import { useCartStore } from '../store.ts';
import ProductCard from '../components/ProductCard.tsx';
import anime from 'animejs';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, wishlist, toggleWishlist, compareList, toggleCompare } = useCartStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'support'>('overview');
  const [showVideo, setShowVideo] = useState(false);

  const product = PRODUCTS.find(p => p.id === id || p.slug === id);
  const isWishlisted = product ? wishlist.includes(product.id) : false;
  const isComparing = product ? compareList.includes(product.id) : false;

  const relatedProducts = PRODUCTS.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Smart Duka Kenya`;
      window.scrollTo(0, 0);
      setActiveIndex(0);
      setActiveTab('overview');
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0F172A] pt-40 flex flex-col items-center text-white">
        <h2 className="text-2xl font-black font-playfair italic mb-8 text-slate-400">Product Not Found</h2>
        <button onClick={() => navigate('/')} className="px-10 py-4 bg-[#C5A059] text-slate-900 rounded-full font-black uppercase tracking-widest text-[10px]">Return to Shop</button>
      </div>
    );
  }

  const media = [product.image, ...product.images];
  const whatsappLink = `https://wa.me/254742721309?text=${encodeURIComponent(`I am interested in buying the ${product.name}.`)}`;

  return (
    <div className="min-h-screen bg-[#0F172A] pt-24 pb-40 text-slate-100 selection:bg-[#C5A059] selection:text-slate-950 overflow-x-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <nav className="flex items-center space-x-4 mb-8 md:mb-16 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/catalogue" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-[#C5A059] truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-32 mb-32">
          {/* Media Section */}
          <section className="lg:col-span-7">
            <div className="lg:sticky lg:top-32 space-y-8 md:space-y-12">
              <div className="relative aspect-square md:aspect-[4/5] bg-[#020617] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5">
                <AnimatePresence mode="wait">
                  {!showVideo ? (
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-full flex items-center justify-center p-8 md:p-12"
                    >
                      <img src={media[activeIndex]} className="w-full h-full object-contain" alt={product.name} />
                    </motion.div>
                  ) : (
                    <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full bg-black">
                      <iframe src={`${product.videoUrl}?autoplay=1&muted=1&background=1`} className="w-full h-full border-none" allow="autoplay; fullscreen" />
                      <button onClick={() => setShowVideo(false)} className="absolute top-6 right-6 md:top-10 md:right-10 bg-white/10 backdrop-blur-3xl p-3 rounded-full text-white transition-all z-50 hover:bg-red-500/20"><X size={20} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-6 md:bottom-12 left-0 right-0 z-30 flex justify-center space-x-2 md:space-x-3">
                   {media.map((_, i) => (
                     <button key={i} onClick={() => { setActiveIndex(i); setShowVideo(false); }} className={`h-1.5 transition-all duration-700 rounded-full ${activeIndex === i ? 'w-8 md:w-10 bg-[#C5A059]' : 'w-2 bg-white/20'}`} />
                   ))}
                </div>

                <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
                  <div className="bg-[#020617]/80 backdrop-blur-xl border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl flex items-center space-x-2 text-white">
                    <ShieldCheck size={14} className="text-[#C5A059]" />
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Genuine Stock</span>
                  </div>
                </div>

                {product.videoUrl && !showVideo && (
                  <button onClick={() => setShowVideo(true)} className="absolute top-6 right-6 md:top-10 md:right-10 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/5 backdrop-blur-3xl text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-[#C5A059] hover:text-slate-950 transition-all shadow-2xl"><Play size={20} fill="currentColor" /></button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 md:gap-4 px-2">
                 {media.map((img, i) => (
                   <button key={i} onClick={() => { setActiveIndex(i); setShowVideo(false); }} className={`aspect-square rounded-xl md:rounded-3xl overflow-hidden border-2 transition-all p-2 bg-white/5 ${activeIndex === i ? 'border-[#C5A059] scale-105' : 'border-transparent opacity-40'}`}><img src={img} className="w-full h-full object-contain" /></button>
                 ))}
              </div>
            </div>
          </section>

          {/* Details Section */}
          <aside className="lg:col-span-5 space-y-12 md:space-y-16">
            <header className="space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[#C5A059] font-black text-[9px] md:text-[10px] uppercase tracking-[0.5em]">{product.brand} Brand</span>
                <div className="flex items-center space-x-2 text-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 rounded-full border border-[#C5A059]/20">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[9px] font-black tracking-widest uppercase">Best Seller</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black font-playfair italic tracking-tighter leading-[0.9] text-white">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-4 pt-4 border-b border-white/5 pb-8">
                <span className="text-4xl md:text-6xl font-black text-[#C5A059] tracking-tighter">KSh {product.price.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-500 line-through">KSh {(product.price * 1.12).toLocaleString()}</span>
              </div>
            </header>

            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center justify-center space-x-3 py-4 md:py-6 rounded-2xl border transition-all font-black uppercase text-[10px] tracking-widest ${isWishlisted ? 'bg-[#C5A059] border-[#C5A059] text-slate-950 shadow-xl shadow-[#C5A059]/20' : 'bg-white/5 border-white/10 text-white'}`}
                >
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
                <button 
                  onClick={() => toggleCompare(product.id)}
                  className={`flex items-center justify-center space-x-3 py-4 md:py-6 rounded-2xl border transition-all font-black uppercase text-[10px] tracking-widest ${isComparing ? 'bg-[#C5A059] border-[#C5A059] text-slate-950 shadow-xl shadow-[#C5A059]/20' : 'bg-white/5 border-white/10 text-white'}`}
                >
                  <BarChart2 size={16} />
                  <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                </button>
              </div>

              <div className="space-y-6 bg-[#C5A059] p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] text-slate-950 shadow-[0_30px_70px_rgba(197,160,89,0.3)]">
                <div className="flex items-center justify-between mb-6">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Inventory Check</span>
                   <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-950 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">In Stock - Nairobi CBD</span>
                   </div>
                </div>
                <button onClick={() => addItem(product)} className="w-full bg-slate-950 text-white py-6 md:py-8 rounded-xl md:rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] transition-all hover:bg-white hover:text-slate-950 shadow-2xl">Add to Cart</button>
                <a href={whatsappLink} target="_blank" className="flex items-center justify-center space-x-3 w-full border border-slate-950/20 py-4 md:py-6 rounded-xl text-slate-950 hover:bg-slate-950 hover:text-white transition-all"><MessageSquare size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Ask a Question</span></a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                 <Truck className="text-[#C5A059]" size={20} />
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Same-Day Delivery</p>
                 <p className="text-xs font-bold text-white">Nairobi Metro Area</p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                 <ShieldCheck className="text-[#C5A059]" size={20} />
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Warranty</p>
                 <p className="text-xs font-bold text-white">{product.warrantyInfo}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Detailed Tabs Section */}
        <section className="mb-32">
          <div className="flex space-x-8 md:space-x-12 border-b border-white/5 mb-12 overflow-x-auto hide-scrollbar">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Technical Specs' },
              { id: 'support', label: 'Support & Warranty' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#C5A059]' : 'text-slate-500 hover:text-white'}`}
              >
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="grid lg:grid-cols-2 gap-20 items-center"
                >
                   <div className="space-y-8">
                      <h3 className="text-3xl md:text-5xl font-black font-playfair italic text-white tracking-tighter leading-tight">Masterfully Crafted <br/>for Pure Performance.</h3>
                      <p className="text-lg text-slate-400 font-medium leading-relaxed">{product.description}</p>
                      <ul className="grid grid-cols-1 gap-4">
                        {product.keyFeatures.map((f, i) => (
                          <li key={i} className="flex items-center space-x-6">
                            <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                            <span className="text-sm font-bold text-slate-200">{f}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                   <div className="relative aspect-video bg-slate-900 rounded-[3rem] overflow-hidden border border-white/5">
                      <img src={media[activeIndex]} className="w-full h-full object-cover opacity-40 blur-xl scale-110" alt="Context" />
                      <div className="absolute inset-0 flex items-center justify-center p-12">
                         <img src={media[activeIndex]} className="max-w-full max-h-full object-contain drop-shadow-2xl" alt="Product Zoom" />
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div 
                  key="specs"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden"
                >
                   <div className="p-8 md:p-12 space-y-0">
                      {Object.entries(product.technicalSpecs).map(([key, value], idx) => (
                        <div key={key} className={`grid grid-cols-2 py-6 border-b border-white/5 last:border-0 ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''} px-8 -mx-8`}>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{key}</span>
                           <span className="text-sm font-bold text-slate-200">{value}</span>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div 
                  key="support"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="grid md:grid-cols-2 gap-10"
                >
                   <div className="p-10 md:p-12 bg-white/5 rounded-[3rem] border border-white/10 space-y-8">
                      <Shield className="text-[#C5A059]" size={32} />
                      <h4 className="text-2xl font-black font-playfair italic text-white">Official Warranty</h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{product.warrantyInfo}. Our products are sourced through official brand distributors in East Africa, ensuring you receive local service support and authentic replacement parts if needed.</p>
                   </div>
                   <div className="p-10 md:p-12 bg-white/5 rounded-[3rem] border border-white/10 space-y-8">
                      <Truck className="text-[#C5A059]" size={32} />
                      <h4 className="text-2xl font-black font-playfair italic text-white">White-Glove Delivery</h4>
                      <p className="text-slate-400 font-medium leading-relaxed">We provide specialized transport for fragile electronics. For TVs, our delivery includes basic unboxing and testing at your residence to ensure zero-defect arrivals.</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Real Work Pictorials */}
        {product.realWorkImages.length > 0 && (
          <section className="mb-32">
             <div className="flex items-center space-x-6 mb-12">
                <Camera className="text-[#C5A059]" size={28} />
                <h2 className="text-3xl md:text-5xl font-black font-playfair italic text-white tracking-tighter">Real <span className="text-slate-500">Installations.</span></h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {product.realWorkImages.map((img, idx) => (
                  <div key={idx} className="aspect-video bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/5 relative group">
                     <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" alt="Work sample" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                     <div className="absolute bottom-10 left-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-2">Verified Professional Mounting</p>
                        <p className="text-white font-bold text-lg">Completed in {idx % 2 === 0 ? 'Kilimani' : 'Lavington'}, Nairobi</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <section className="mb-32">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
              <div className="flex items-center space-x-6">
                <Quote className="text-[#C5A059]" size={28} />
                <h2 className="text-3xl md:text-5xl font-black font-playfair italic text-white tracking-tighter">Buyer <span className="text-slate-500">Vault.</span></h2>
              </div>
              <div className="flex items-center space-x-4 bg-white/5 px-8 py-4 rounded-full border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">2,400+ Total Sales</span>
                <CheckCircle2 size={14} className="text-green-500" />
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { user: 'Kevin M.', text: 'The display quality on this model is unmatched for the price. Delivery to Westlands took only 3 hours.', rating: 5, date: '2 days ago' },
                { user: 'Sonia K.', text: 'Authentic unit. I verified the serial number on the Hisense portal and it checked out. Great service.', rating: 5, date: '1 week ago' },
                { user: 'David O.', text: 'Smooth M-Pesa transaction. The technician who delivered it was very helpful with the initial setup.', rating: 5, date: '3 days ago' }
              ].map((rev, idx) => (
                <div key={idx} className="bg-white/5 p-8 md:p-10 rounded-[2.5rem] border border-white/5 space-y-6 relative group overflow-hidden">
                   <div className="flex space-x-1">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="#C5A059" className="text-[#C5A059]" />)}
                   </div>
                   <p className="text-base text-slate-300 font-medium leading-relaxed italic">"{rev.text}"</p>
                   <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-sm">{rev.user}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{rev.date}</p>
                      </div>
                      <ShieldCheck size={16} className="text-[#C5A059]" />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section>
             <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl md:text-5xl font-black font-playfair italic text-white tracking-tighter">Suggested <span className="text-slate-500">Masterpieces.</span></h2>
                <Link to="/catalogue" className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:underline flex items-center gap-2">Explore All <ArrowRight size={14} /></Link>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
             </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
