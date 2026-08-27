import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchModal from './SearchModal';

const Navbar = ({ onCartTrigger }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [announcement] = useState('FREE DELIVERY ON ORDERS OVER ₹2,999! • PHYSICAL OUTLET AT RP PUDUR, NAMAKKAL • SHOP ONLINE NOW');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Marquee Announcement Bar */}
        <div className="bg-accent text-primary text-xs font-bold py-2 overflow-hidden relative w-full border-b border-black/5 select-none">
          <div className="whitespace-nowrap inline-block animate-[marquee_25s_linear_infinite] pl-[100%]">
            <span className="mx-4">{announcement}</span>
            <span className="mx-4">{announcement}</span>
            <span className="mx-4">{announcement}</span>
          </div>
        </div>

        {/* Primary Navbar */}
        <nav className="glassmorphic-dark w-full px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-widest text-platinum hover:text-accent transition-colors font-display">
            FRENCH CLUB
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wider text-slate-gray">
            <Link to="/shop" className="hover:text-platinum transition-colors">NEW IN</Link>
            <Link to="/shop?category=Shirts" className="hover:text-platinum transition-colors">SHIRTS</Link>
            <Link to="/shop?category=Tees" className="hover:text-platinum transition-colors">TEES</Link>
            <Link to="/shop?category=Bottoms" className="hover:text-platinum transition-colors">BOTTOMS</Link>
            <Link to="/shop?category=Party Wear" className="hover:text-platinum transition-colors font-bold text-accent">PARTY WEAR</Link>
            <Link to="/store" className="hover:text-platinum transition-colors">STORE INFO</Link>
          </div>

          <div className="flex items-center gap-4 md:gap-6 text-platinum">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 p-1.5 hover:text-accent transition-colors group cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-gray group-hover:text-accent" />
              <span className="hidden md:inline text-xs text-slate-gray/70 px-1.5 py-0.5 border border-white/10 rounded group-hover:border-accent group-hover:text-accent font-medium">
                Ctrl K
              </span>
            </button>

            <Link to="/wishlist" className="relative p-1.5 hover:text-accent transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-[9px] font-extrabold text-primary flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button 
              onClick={onCartTrigger}
              className="relative p-1.5 hover:text-accent transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-[9px] font-extrabold text-primary flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="p-1.5 hover:text-accent transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-surface border border-white/10 rounded-lg py-2 shadow-2xl z-50">
                  {user && user.role !== 'guest' ? (
                    <>
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-slate-gray">Logged in as</p>
                        <p className="text-sm font-semibold truncate text-platinum">{user.name}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link 
                          to="/admin/dashboard" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-gray hover:text-accent hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Console
                        </Link>
                      )}

                      <Link 
                        to="/wishlist"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-gray hover:text-accent hover:bg-white/5 transition-colors"
                      >
                        <Heart className="w-4 h-4" /> My Wishlist
                      </Link>

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-slate-gray hover:text-accent hover:bg-white/5 transition-colors border-t border-white/5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-gray hover:text-accent hover:bg-white/5 transition-colors"
                      >
                        Log In
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-gray hover:text-accent hover:bg-white/5 transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
