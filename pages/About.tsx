
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, History, Shield, Headphones } from 'lucide-react';

const About: React.FC = () => {
  const horizontalRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: horizontalRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.6%"]);

  return (
    <div className="bg-slate-950 text-white selection:bg-[#C5A059] selection:text-slate-950">
      {/* 1. Cinematic Intro */}
      <section className="h-[90vh] flex flex-col items-center justify-center relative px-8">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Nairobi Elite Setup"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em] mb-8 block"
          >
            Nairobi's Tech Curator
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black font-playfair italic tracking-tighter leading-none mb-12"
          >
            Excellence <br/>is not a <span className="text-[#C5A059]">Choice.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Smart Duka was not built to sell screens. It was built to refine how Nairobi watches. We curate the world’s most precise optics for the discerning Kenyan home.
          </motion.p>
        </div>
      </section>

      {/* 2. The Atelier Section */}
      <section className="py-40 bg-white text-slate-950">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em] block">The Atelier</span>
              <h2 className="text-5xl md:text-7xl font-black font-playfair italic tracking-tighter leading-none">
                Curating <br/>Legacy in <br/>Karen & Runda.
              </h2>
              <div className="space-y-8 text-lg text-slate-600 leading-relaxed font-medium">
                <p>
                  Every installation is a signature. We don't just mount TVs; we design sensory experiences. Our technicians are artisans, trained to respect the architecture of your home.
                </p>
                <p>
                  Since 2018, we have evolved from a specialist boutique into Kenya's premier hub for genuine Hisense and Apple assets.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=600" className="rounded-3xl grayscale" />
                <img src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=600" className="rounded-3xl" />
              </div>
              <div className="space-y-6 pt-12">
                <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600" className="rounded-3xl" />
                <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600" className="rounded-3xl grayscale" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Pillar Scroll Section */}
      <div ref={horizontalRef} className="h-[300vh] relative bg-slate-900">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <motion.div style={{ x }} className="flex w-[300vw]">
            {/* Pillar 1: Craftsmanship */}
            <div className="w-screen h-screen flex items-center px-24">
              <div className="grid lg:grid-cols-2 gap-24 items-center w-full">
                <div className="space-y-8">
                  <div className="w-20 h-20 bg-[#C5A059] rounded-3xl flex items-center justify-center">
                    <History size={32} className="text-slate-950" />
                  </div>
                  <h3 className="text-7xl font-black font-playfair italic">01 Craftsmanship</h3>
                  <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                    Precision is our baseline. From cable management that disappears into your walls to acoustic calibration for your specific room dimensions.
                  </p>
                </div>
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" className="rounded-[4rem] aspect-video object-cover" />
              </div>
            </div>

            {/* Pillar 2: Authenticity */}
            <div className="w-screen h-screen flex items-center px-24 bg-slate-950">
              <div className="grid lg:grid-cols-2 gap-24 items-center w-full">
                <div className="space-y-8">
                  <div className="w-20 h-20 bg-[#C5A059] rounded-3xl flex items-center justify-center">
                    <Shield size={32} className="text-slate-950" />
                  </div>
                  <h3 className="text-7xl font-black font-playfair italic">02 Authenticity</h3>
                  <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                    In a market of imitations, we are the exception. Every serial number we sell is verified, registered, and protected by local official warranties.
                  </p>
                </div>
                <img src="https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&q=80&w=1200" className="rounded-[4rem] aspect-video object-cover" />
              </div>
            </div>

            {/* Pillar 3: Aftercare */}
            <div className="w-screen h-screen flex items-center px-24">
              <div className="grid lg:grid-cols-2 gap-24 items-center w-full">
                <div className="space-y-8">
                  <div className="w-20 h-20 bg-[#C5A059] rounded-3xl flex items-center justify-center">
                    <Headphones size={32} className="text-slate-950" />
                  </div>
                  <h3 className="text-7xl font-black font-playfair italic">03 Aftercare</h3>
                  <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                    The transaction is just the beginning. Our Concierge team remains at your disposal for life, ensuring your assets perform at their peak.
                  </p>
                </div>
                <img src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1200" className="rounded-[4rem] aspect-video object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Final CTA */}
      <section className="py-60 flex flex-col items-center justify-center text-center bg-slate-950 px-8">
        <Sparkles className="text-[#C5A059] mb-12" size={48} />
        <h2 className="text-6xl md:text-8xl font-black font-playfair italic mb-12">Your Vision, <br/>Refined.</h2>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-sm">Est. 2018 — Nairobi, Kenya</p>
      </section>
    </div>
  );
};

export default About;
