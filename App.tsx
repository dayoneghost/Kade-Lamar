import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Booking from './pages/Booking.tsx';
import Blog from './pages/Blog.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Auth from './pages/Auth.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Checkout from './pages/Checkout.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Catalogue from './pages/Catalogue.tsx';
import OrderTracking from './pages/OrderTracking.tsx';
import BusinessManager from './pages/BusinessManager.tsx';
import FloatingConcierge from './components/FloatingConcierge.tsx';
import CartDrawer from './components/CartDrawer.tsx';
import anime from 'animejs';

const App: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/account/track') ||
                      location.pathname.startsWith('/manager');

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.page-container');
    if (container && typeof anime === 'function') {
      try {
        (anime as any)({
          targets: '.page-container',
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 400,
          easing: 'easeOutSine'
        });
      } catch (e) {
        console.warn("Animation skipped:", e);
      }
    }
  }, [location.pathname, location.search]);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] overflow-x-hidden">
      {!isDashboard && <Navbar />}
      <main className={`flex-grow ${!isDashboard ? 'pt-20 md:pt-24' : 'pt-0'} page-container transition-all duration-300`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manager" element={<BusinessManager />} />
          <Route path="/account/track/:orderId" element={<OrderTracking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
      <CartDrawer />
      {!isDashboard && <FloatingConcierge />}
    </div>
  );
};

export default App;