import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/products?search=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (error) {
        console.error('Error searching products', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleProductClick = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-surface border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl"
        >
          <div className="relative flex items-center p-4 border-b border-white/10">
            <Search className="w-5 h-5 text-slate-gray mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search oversized tees, linen shirts, cargos..."
              className="w-full bg-transparent text-platinum outline-none placeholder-slate-gray text-base md:text-lg"
            />
            {loading ? (
              <Loader className="w-5 h-5 text-accent animate-spin mr-3" />
            ) : query ? (
              <button onClick={() => setQuery('')} className="p-1 hover:text-accent mr-2 text-slate-gray">
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button 
              onClick={onClose}
              className="px-2 py-1 text-xs border border-white/20 hover:border-accent hover:text-accent rounded-md transition-colors text-slate-gray cursor-pointer"
            >
              ESC
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin">
            {query.trim() === '' ? (
              <div className="p-8 text-center text-slate-gray text-sm">
                Type something to search the collection.
              </div>
            ) : results.length === 0 && !loading ? (
              <div className="p-8 text-center text-slate-gray text-sm">
                No products found matching "<span className="text-platinum font-semibold">{query}</span>"
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product.slug)}
                  className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-12 h-16 object-cover rounded bg-primary"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-platinum group-hover:text-accent transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-xs text-slate-gray mt-0.5">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-platinum">₹{product.price}</span>
                    {product.discount > 0 && (
                      <div className="text-xs text-accent mt-0.5 font-semibold">
                        -{product.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-primary/40 border-t border-white/5 flex justify-between items-center text-xs text-slate-gray px-4">
            <span>French Club Namakkal - 2026</span>
            <span className="flex items-center gap-1">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> to select
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
