
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import { 
  Search, SlidersHorizontal, ChevronDown, Plus, 
  ArrowRight, Star, ShieldCheck, Zap, X, Filter, BarChart2,
  Tv, Monitor, CheckCircle2, Heart, Loader2
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../constants.tsx';
import { fetchProducts } from '../lib/api.ts';
import { useCartStore } from '../store.ts';
import ProductSkeleton from '../components/ProductSkeleton.tsx';
import ProductCard from '../components/ProductCard.tsx';
import anime from 'animejs';

const Catalogue: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000); 
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { compareList, toggleCompare, clearCompare, wishlist, toggleWishlist, isAuthenticated } = useCartStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['catalogue_full', selectedCategories, selectedBrands, selectedResolutions, selectedSizes, minPrice, maxPrice, search],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await fetchProducts({ pageParam });
      return {
        ...result,
        data: result.data.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
          const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
          const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
          const matchesResolution = selectedResolutions.length === 0 || (p.technicalSpecs?.['Resolution'] && selectedResolutions.some(res => p.technicalSpecs!['Resolution'].includes(res)));
          const matchesSize = selectedSizes.length === 0 || (p.technicalSpecs?.['Screen Size'] && selectedSizes.some(size => p.technicalSpecs!['Screen Size'].includes(size)));
          const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
          return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesResolution && matchesSize;
        })
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '400px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (status === 'success') {
      (anime as any)({
        targets: '.cat-card',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(40),
        duration: 500,
        easing: 'easeOutQuart'
      });
    }
  }, [data, status]);

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const RESOLUTIONS = ['4K UHD', '8K UHD', 'OLED', 'QLED'];
  const SIZES = ['32', '43', '55', '65', '75', '85', '98'];

  const compareItems = PRODUCTS.filter(p => compareList.includes(p.id));

  const handleCompareClick = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/dashboard?tab=compare');
    } else {
      navigate('/dashboard?tab=compare');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pt-12 md:pt-20 pb-40 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <header className="mb-12 md:mb-20">
          <span className="text-[#C5A059] text-[9px] font-black uppercase tracking-[0.6em] mb-4 block">Store Inventory</span>
          <h1 className="font-playfair text-5xl md:text-8xl font-black italic tracking-tighter leading-none mb-8 text-white">Full <span className="text-slate-400">Vault.</span></h1>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            <div className="relative flex-grow w-full group">
              <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C5A059] transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Find hisense, apple or accessories..."
                className="w-full bg-[#020617] border border-white/5 rounded-xl md:rounded-2xl py-5 md:py-6 pl-14 md:pl-16 pr-6 md:pr-8 text-sm md:text-base text-white font-bold outline-none focus:border-[#C5A059] transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full md:w-auto flex items-center justify-center space-x-3 bg-white/5 px-8 py-5 md:py-6 rounded-xl text-white font-black uppercase text-[10px] tracking-widest border border-white/5 active:scale-95 transition-transform"
            >
              <Filter size={18} />
              <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 relative">
          {/* Responsive Sidebar */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 1024) && (
              <motion.aside 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`${isFilterOpen ? 'block' : 'hidden lg:block'} w-full lg:w-[280px] space-y-12 bg-slate-900/50 lg:bg-transparent p-8 lg:p-0 rounded-[2rem] border border-white/5 lg:border-0`}
              >
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Categories</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat.name)} className={`text-left py-3 px-4 lg:p-0 lg:py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl lg:rounded-none border lg:border-0 ${selectedCategories.includes(cat.name) ? 'text-[#C5A059] bg-[#C5A059]/10 border-[#C5A059]/20' : 'text-slate-500 hover:text-white border-transparent'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Resolution Output</h4>
                   <div className="grid grid-cols-2 gap-2">
                     {RESOLUTIONS.map(res => (
                       <button key={res} onClick={() => toggleFilter(selectedResolutions, setSelectedResolutions, res)} className={`py-3 px-3 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${selectedResolutions.includes(res) ? 'bg-[#C5A059] border-[#C5A059] text-slate-950' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                         {res}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Dimension Scan</h4>
                   <div className="flex flex-wrap gap-2">
                     {SIZES.map(size => (
                       <button key={size} onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)} className={`w-12 h-12 rounded-2xl border text-[10px] font-black flex items-center justify-center transition-all ${selectedSizes.includes(size) ? 'bg-[#C5A059] border-[#C5A059] text-slate-950 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                         {size}"
                       </button>
                     ))}
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-8">
                   <div className="flex justify-between items-end">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Price Ceiling</h4>
                     <span className="text-[#C5A059] font-black text-xs">KSh {maxPrice.toLocaleString()}</span>
                   </div>
                   <input type="range" min="0" max="1000000" step="10000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full gold-slider h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer" />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10">
              {status === 'pending' ? (
                Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.data.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </React.Fragment>
                ))
              )}
            </div>
            <div ref={loadMoreRef} className="h-40 flex items-center justify-center mt-10">
               {isFetchingNextPage && <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin" />}
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-[#0F172A]/95 backdrop-blur-2xl border border-[#C5A059]/40 rounded-[2rem] p-5 z-[200] shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center justify-between gap-4">
               <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex -space-x-3">
                    {compareItems.map(p => (
                      <div key={p.id} className="w-10 h-10 bg-white rounded-full border-2 border-slate-950 p-1.5 shadow-xl"><img src={p.image} className="w-full h-full object-contain" /></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white font-black text-[10px] uppercase tracking-widest">{compareList.length} Units Ready</p>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Technical Cross-Analysis</p>
                  </div>
               </div>
               <div className="flex items-center space-x-3">
                  <button onClick={clearCompare} className="p-3 text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
                  <button 
                    onClick={handleCompareClick}
                    className="bg-[#C5A059] text-slate-950 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl"
                  >
                    Compare
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalogue;
