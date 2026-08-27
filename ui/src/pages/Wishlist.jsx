import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Heart, Loader } from 'lucide-react';
import api from '../utils/api';

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (authLoading) return;

      if (user && user.role !== 'guest') {
        const populated = user.wishlist.filter(item => typeof item === 'object');
        setWishlistProducts(populated);
        setLoading(false);
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        if (guestWishlist.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        try {
          const { data } = await api.get('/api/products');
          const filtered = data.filter(p => guestWishlist.includes(p._id));
          setWishlistProducts(filtered);
        } catch (err) {
          console.error('Failed to load guest wishlist items', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWishlist();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-gray">
        <Loader className="w-8 h-8 text-accent animate-spin mb-3 text-accent" />
        <p className="text-[10px] uppercase font-bold tracking-widest">Loading Wishlist...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-24 max-w-7xl mx-auto px-6 md:px-12 pt-10 fade-in">
      <div className="border-b border-white/10 pb-6 mb-8">
        <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase font-display">My Favorites</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-platinum uppercase tracking-tight font-display mt-1">
          YOUR WISHLIST
        </h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 text-slate-gray font-sans">
          <Heart className="w-12 h-12 mb-4 mx-auto text-white/10" />
          <p className="text-sm font-semibold mb-2 text-platinum">Your wishlist is empty</p>
          <p className="text-xs">Tap the heart icon on any product to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
