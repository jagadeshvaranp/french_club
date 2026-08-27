import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useAuth();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [addingSuccess, setAddingSuccess] = useState(false);

  const isWishlisted = isInWishlist(product._id);
  const hasDiscount = product.discount > 0;

  const handleQuickAdd = (size) => {
    addToCart(product, size);
    setAddingSuccess(true);
    setTimeout(() => {
      setAddingSuccess(false);
      setShowSizes(false);
    }, 1500);
  };

  const badgeText = product.tags?.[0] || (product.isTrending ? 'Trending' : product.isFeatured ? 'Featured' : null);

  return (
    <div 
      className="relative flex flex-col bg-surface rounded-xl overflow-hidden border border-white/5 group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizes(false);
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-primary w-full">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:border-accent text-platinum hover:text-accent transition-all cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
        </button>

        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {badgeText && (
            <span className="bg-black/80 backdrop-blur-sm border border-white/15 text-platinum text-[9px] font-extrabold px-2.5 py-1 rounded tracking-wider uppercase font-display">
              {badgeText}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-accent text-primary text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider font-display">
              {product.discount}% OFF
            </span>
          )}
        </div>

        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${
              isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.title} Alternate`}
              className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Quick Size Slide Up Selector */}
        <div 
          className={`absolute bottom-0 left-0 right-0 z-20 p-3 bg-black/90 backdrop-blur-md border-t border-white/10 transition-transform duration-300 transform ${
            showSizes || isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {addingSuccess ? (
            <div className="text-center text-accent text-xs font-bold py-1.5 tracking-wider uppercase font-display flex items-center justify-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 animate-bounce" /> Added to bag!
            </div>
          ) : !showSizes ? (
            <button 
              onClick={() => setShowSizes(true)}
              className="w-full bg-platinum hover:bg-accent text-primary text-[10px] font-bold py-2 rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-display"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
            </button>
          ) : (
            <div>
              <p className="text-[9px] text-slate-gray font-bold text-center uppercase mb-2 tracking-wider">Select Size</p>
              <div className="flex justify-center gap-1.5">
                {product.sizes.map((s) => {
                  const outOfStock = s.stock <= 0;
                  return (
                    <button
                      key={s.size}
                      disabled={outOfStock}
                      onClick={() => handleQuickAdd(s.size)}
                      className={`w-8 h-8 rounded text-xs font-bold transition-all flex items-center justify-center border ${
                        outOfStock 
                          ? 'border-white/5 text-white/20 line-through cursor-not-allowed'
                          : 'border-white/15 hover:border-accent text-platinum hover:text-accent hover:scale-105 cursor-pointer'
                      }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <Link to={`/product/${product.slug}`} className="group/title block">
          <h3 className="text-sm font-semibold tracking-wide text-platinum truncate group-hover/title:text-accent transition-colors font-sans">
            {product.title}
          </h3>
          <p className="text-[10px] text-slate-gray mt-0.5 uppercase tracking-wider">{product.category}</p>
        </Link>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-platinum">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-gray line-through">₹{product.mrp}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-accent">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
