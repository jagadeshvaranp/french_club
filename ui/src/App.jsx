import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MobileDock from './components/MobileDock';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import StoreLocator from './pages/StoreLocator';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

const MainLayout = ({ children, isCartOpen, setIsCartOpen }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && (
        <Navbar 
          onCartTrigger={() => setIsCartOpen(true)} 
        />
      )}

      <main className="flex-grow">
        {children}
      </main>

      {!isAdminPath && (
        <>
          {/* Obsidian Luxury Footer */}
          <footer className="bg-surface border-t border-white/5 py-12 px-6 md:px-12 text-xs text-slate-gray mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 font-sans">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-platinum uppercase font-display tracking-widest">FRENCH CLUB</h3>
                <p className="leading-relaxed">
                  Namakkal's premium menswear destination. Curating high-end linen shirts, drop-shoulder heavy streetwear tees, and baggy cargo fits.
                </p>
                <p className="text-[10px] text-accent font-bold">4.9★ GOOGLE RATED OUTLET</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-platinum uppercase tracking-wider font-display">Collections</h4>
                <ul className="space-y-2">
                  <li><Link to="/shop?category=Shirts" className="hover:text-platinum">Linen Shirts</Link></li>
                  <li><Link to="/shop?category=Tees" className="hover:text-platinum">Streetwear Tees</Link></li>
                  <li><Link to="/shop?category=Bottoms" className="hover:text-platinum">Denim & Cargos</Link></li>
                  <li><Link to="/shop?category=Party Wear" className="hover:text-platinum font-bold text-accent">Night Edits</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-platinum uppercase tracking-wider font-display">Store Info</h4>
                <ul className="space-y-2">
                  <li><Link to="/store" className="hover:text-platinum">Namakkal Outlet</Link></li>
                  <li><span className="block">Daily: 09:30 AM - 09:30 PM</span></li>
                  <li><a href="tel:+917667447576" className="hover:text-platinum">Call: +91 76674 47576</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-platinum uppercase tracking-wider font-display">Locality</h4>
                <p className="leading-relaxed">
                  49, Salem - Namakkal Rd, R.P Pudur, Namakkal, Tamil Nadu 637001
                </p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p>© {new Date().getFullYear()} French Club Clothing Co. All rights reserved.</p>
              <div className="flex gap-4">
                <span className="hover:text-platinum cursor-pointer">Privacy Policy</span>
                <span className="hover:text-platinum cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </footer>

          <MobileDock 
            onSearchTrigger={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true
              });
              window.dispatchEvent(event);
            }}
            onCartTrigger={() => setIsCartOpen(true)}
          />
        </>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout 
            isCartOpen={isCartOpen} 
            setIsCartOpen={setIsCartOpen}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/store" element={<StoreLocator />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </MainLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
