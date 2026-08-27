import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileDock = ({ onSearchTrigger, onCartTrigger }) => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();
  
  const wishlistCount = user?.wishlist?.length || 0;
  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-primary/80 backdrop-blur-lg border-t border-white/10 px-6 py-2 pb-5 flex items-center justify-between shadow-2xl">
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/') ? 'text-accent' : 'text-slate-gray hover:text-platinum'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-wider">SHOP</span>
      </Link>

      <button 
        onClick={onSearchTrigger}
        className="flex flex-col items-center gap-1 text-slate-gray hover:text-accent transition-colors cursor-pointer"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-wider">SEARCH</span>
      </button>

      <Link 
        to="/wishlist" 
        className={`relative flex flex-col items-center gap-1 transition-colors ${
          isActive('/wishlist') ? 'text-accent' : 'text-slate-gray hover:text-platinum'
        }`}
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 bg-accent text-[9px] font-extrabold text-primary flex items-center justify-center rounded-full">
            {wishlistCount}
          </span>
        )}
        <span className="text-[10px] font-bold tracking-wider">WISHLIST</span>
      </Link>

      <button 
        onClick={onCartTrigger}
        className="relative flex flex-col items-center gap-1 text-slate-gray hover:text-accent transition-colors cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 right-1.5 w-4 h-4 bg-accent text-[9px] font-extrabold text-primary flex items-center justify-center rounded-full animate-bounce">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-bold tracking-wider">BAG</span>
      </button>
    </div>
  );
};

export default MobileDock;
