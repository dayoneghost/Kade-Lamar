import React from 'react';
import { Link } from 'react-router-dom';
import { DOMAIN, SITE_NAME, EMAIL_SUPPORT, LOGO_URL } from '../constants';
import { ShieldCheck, Check } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-10 group">
              <img src={LOGO_URL} alt="Logo" className="w-12 h-12 object-contain" />
              <span className="font-black text-3xl tracking-tighter uppercase italic">
                Smart<span className="text-[#C5A059]">Duka</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs font-medium">
              The premier hub for genuine electronics in Nairobi. Specializing in high-end Hisense, Apple, and sound solutions for modern Kenyan living.
            </p>
            <div className="flex space-x-5">
              <a href="https://tiktok.com/@smart_duka_electronics" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all hover:-translate-y-2 group">
                <i className="fab fa-tiktok group-hover:scale-110 transition-transform"></i>
              </a>
              <a href="https://youtube.com/@smart_duka" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all hover:-translate-y-2 group">
                <i className="fab fa-youtube group-hover:scale-110 transition-transform"></i>
              </a>
              <a href="https://share.google/6JOgBWtHDWlcHOIPr" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all hover:-translate-y-2 group">
                <i className="fab fa-google group-hover:scale-110 transition-transform"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.4em] text-[#C5A059] mb-10">Customer Service</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li><Link to="/catalogue" className="text-gray-400 hover:text-white transition-colors">4K TV Collections</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition-colors">Professional Installation</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Buying Guides</Link></li>
              <li><Link to="/catalogue" className="text-gray-400 hover:text-white transition-colors">Home Appliances</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Track My Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.4em] text-[#C5A059] mb-10">Nairobi Showroom</h4>
            <ul className="space-y-8 text-sm">
              <li className="flex items-start space-x-5">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                  <i className="fas fa-map-pin"></i>
                </div>
                <span className="text-gray-400 font-medium pt-2">Smart House, 4th Floor,<br/>Kimathi Street, Nairobi CBD</span>
              </li>
              <li className="flex items-center space-x-5">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                  <i className="fas fa-headset"></i>
                </div>
                <span className="text-gray-400 font-medium">+254 742 721 309</span>
              </li>
              <li className="flex items-center space-x-5">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                  <i className="fas fa-at"></i>
                </div>
                <span className="text-gray-400 font-medium">{EMAIL_SUPPORT}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.4em] text-[#C5A059] mb-10">Our Guarantee</h4>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed font-medium mb-6">
                Smart Duka Electronics is a premium authorized dealer. We guarantee the authenticity of every product and provide full local support.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 relative">
                  <ShieldCheck size={16} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black flex items-center justify-center shadow-lg">
                    <Check size={8} className="text-white" strokeWidth={4} />
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Retailer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Kenyan Retail Excellence.</p>
          <div className="flex space-x-8 mt-6 md:mt-0 items-center">
            <a href={`https://${DOMAIN}`} className="hover:text-white transition-colors">{DOMAIN}</a>
            <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></div>
            <span className="text-white">Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;