import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Truck, Check, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/api/products/${slug}`);
        setProduct(data.product);
        setRelatedProducts(data.related);
        setSelectedImage(data.product.images[0]);
        const firstAvailable = data.product.sizes.find(s => s.stock > 0);
        setSelectedSize(firstAvailable ? firstAvailable.size : '');
      } catch (err) {
        console.error(err);
        setError('Failed to load product. It might not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-gray">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest">Loading Catalog Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-gray p-6 text-center">
        <p className="text-sm font-semibold mb-4 text-platinum">{error || 'Product not found'}</p>
        <Link to="/" className="px-6 py-2 bg-platinum text-primary text-xs font-bold uppercase rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    addToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectWhatsAppOrder = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    const storeNumber = '917667447576';
    const text = `Hi French Club! 🔥\n\nI want to order this directly:\n- Product: ${product.title}\n- Size: ${selectedSize}\n- Price: ₹${product.price}\n- Link: ${window.location.href}\n\nPlease share availability and payment details. Thanks!`;
    const whatsappLink = `https://wa.me/${storeNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus({
        success: false,
        message: 'Invalid pincode. Enter 6 digits.'
      });
      return;
    }

    if (pincode.startsWith('637')) {
      setPincodeStatus({
        success: true,
        local: true,
        message: '🚀 FAST LOCAL DELIVERY (1-2 Days) • Shipped from RP Pudur Namakkal Store'
      });
    } else {
      setPincodeStatus({
        success: true,
        local: false,
        message: '🚚 Standard Shipping (3-5 Days) • Nationwide Courier Dispatch'
      });
    }
  };

  const isWishlisted = isInWishlist(product._id);
  const discountPercent = product.discount || 0;

  return (
    <div className="w-full min-h-screen pb-24 max-w-7xl mx-auto px-6 md:px-12 pt-6 md:pt-10 fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-gray font-semibold mb-8 uppercase tracking-wider select-none">
        <Link to="/" className="hover:text-platinum">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-platinum">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-platinum truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          <div className="flex-1 aspect-[3/4] bg-surface border border-white/5 rounded-2xl overflow-hidden relative shadow-lg">
            <img 
              src={selectedImage} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            {product.tags?.[0] && (
              <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 text-platinum text-[9px] font-extrabold px-3 py-1 rounded tracking-wider uppercase font-display z-10">
                {product.tags[0]}
              </span>
            )}
          </div>

          <div className="flex md:flex-col gap-3.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 select-none scrollbar-hide">
            {product.images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border cursor-pointer bg-surface flex-shrink-0 transition-all ${
                  selectedImage === img ? 'border-accent shadow-md scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="border-b border-white/10 pb-6 mb-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] text-accent font-extrabold tracking-[0.25em] uppercase font-display">FRENCH CLUB</span>
                <h1 className="text-2xl md:text-3.5xl font-extrabold text-platinum tracking-tight uppercase font-display mt-1">
                  {product.title}
                </h1>
              </div>
              <button 
                onClick={() => toggleWishlist(product._id)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-accent text-platinum hover:text-accent transition-colors flex-shrink-0 cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-xs font-bold text-accent">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span>{product.rating}</span>
              </div>
              <span className="text-white/20">|</span>
              <span className="text-xs text-slate-gray font-semibold">
                {product.reviewsCount} verified reviews
              </span>
            </div>

            <div className="mt-5 flex items-end gap-3.5">
              <span className="text-2xl md:text-3.5xl font-extrabold text-platinum">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-base text-slate-gray line-through pb-1">₹{product.mrp}</span>
                  <span className="text-xs font-extrabold text-accent border border-accent/25 rounded px-2 py-0.5 mb-1.5 uppercase font-display">
                    -{discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-gray font-bold uppercase tracking-wider">Select Size</span>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-accent hover:text-accent-hover font-bold tracking-wider uppercase cursor-pointer"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => {
                const outOfStock = s.stock <= 0;
                return (
                  <button
                    key={s.size}
                    disabled={outOfStock}
                    onClick={() => setSelectedSize(s.size)}
                    className={`min-w-[48px] h-11 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                      outOfStock
                        ? 'border-white/5 text-white/20 line-through cursor-not-allowed'
                        : selectedSize === s.size
                          ? 'border-accent bg-accent text-primary scale-105 shadow-md shadow-accent/15'
                          : 'border-white/10 hover:border-accent text-platinum hover:text-accent cursor-pointer'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 mb-8 border-b border-white/10 pb-8">
            <button 
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer font-display ${
                isAdded 
                  ? 'bg-accent text-primary' 
                  : 'bg-platinum hover:bg-white text-primary'
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : null}
              {isAdded ? 'Added to Bag!' : 'Add to Bag'}
            </button>

            <button 
              onClick={handleDirectWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-3.5 rounded-xl text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer font-display"
            >
              Order via WhatsApp
            </button>
          </div>

          <div className="mb-8 border-b border-white/10 pb-8">
            <h3 className="text-xs text-slate-gray font-bold uppercase tracking-wider mb-3">Delivery Checker</h3>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input 
                type="text" 
                maxLength="6"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit pincode (e.g. 637001)"
                className="flex-1 bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-platinum outline-none placeholder-slate-gray focus:border-accent"
              />
              <button 
                type="submit" 
                className="bg-white/5 hover:bg-accent hover:text-primary border border-white/15 hover:border-accent text-xs font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer text-slate-gray"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className={`text-[10px] font-bold mt-2.5 flex items-center gap-1.5 ${
                pincodeStatus.success ? 'text-accent' : 'text-red-400'
              }`}>
                {pincodeStatus.success && <Truck className="w-3.5 h-3.5 flex-shrink-0" />}
                {pincodeStatus.message}
              </p>
            )}
          </div>

          <div className="space-y-4 font-sans">
            <h3 className="text-xs text-slate-gray font-bold uppercase tracking-wider font-display">Product Details</h3>
            <p className="text-xs text-slate-gray leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-white/10 pt-16">
          <div className="mb-10">
            <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase">Style Complete</span>
            <h2 className="text-xl md:text-3xl font-extrabold text-platinum uppercase font-display mt-1">Frequently Bought Together</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="mt-20 border-t border-white/10 pt-16">
        <h2 className="text-xl md:text-3xl font-extrabold text-platinum uppercase font-display mb-10">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-surface rounded-xl border border-white/5 space-y-3 font-sans">
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
            </div>
            <p className="text-xs text-platinum italic leading-relaxed">
              "Best streetwear clothing brand in Namakkal. The drop-shoulder graphics are amazing, heavy fabric GSM feels extremely premium like luxury brands."
            </p>
            <p className="text-[10px] text-slate-gray font-bold uppercase">— Vigneshwaran K. (Google Review)</p>
          </div>
          <div className="p-5 bg-surface rounded-xl border border-white/5 space-y-3 font-sans">
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
            </div>
            <p className="text-xs text-platinum italic leading-relaxed">
              "Bought a premium linen shirt and standard cargo pants. Excellent stitching and fitting, price is very affordable for this grade of luxury clothing."
            </p>
            <p className="text-[10px] text-slate-gray font-bold uppercase">— Rahul A. (Google Review)</p>
          </div>
          <div className="p-5 bg-surface rounded-xl border border-white/5 space-y-3 font-sans">
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
              <Star className="w-4 h-4 fill-accent text-accent" />
            </div>
            <p className="text-xs text-platinum italic leading-relaxed">
              "WhatsApp ordering was super simple. Received my cargo jeans within 1 day in Namakkal. Direct store dispatch is super helpful, great response."
            </p>
            <p className="text-[10px] text-slate-gray font-bold uppercase">— Prem Kumar (Google Review)</p>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)} />
          <div className="bg-surface border border-white/10 rounded-xl max-w-lg w-full p-6 z-10 text-platinum relative shadow-2xl">
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-slate-gray hover:text-accent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider mb-4 font-display">Size Guide & Fits</h3>
            <p className="text-xs text-slate-gray mb-4 font-sans">
              Find your fit. All values are in inches. French Club streetwear drops feature a premium boxy fit.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/15 text-slate-gray uppercase font-bold">
                    <th className="py-2.5">Size</th>
                    <th className="py-2.5">Chest</th>
                    <th className="py-2.5">Length</th>
                    <th className="py-2.5">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  <tr>
                    <td className="py-2.5 font-bold font-display">S</td>
                    <td className="py-2.5">38"</td>
                    <td className="py-2.5">27"</td>
                    <td className="py-2.5">18"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold font-display">M</td>
                    <td className="py-2.5">40"</td>
                    <td className="py-2.5">28"</td>
                    <td className="py-2.5">19"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold font-display">L</td>
                    <td className="py-2.5">42"</td>
                    <td className="py-2.5">29"</td>
                    <td className="py-2.5">20"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold font-display">XL</td>
                    <td className="py-2.5">44"</td>
                    <td className="py-2.5">30"</td>
                    <td className="py-2.5">21"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold font-display">XXL</td>
                    <td className="py-2.5">46"</td>
                    <td className="py-2.5">31"</td>
                    <td className="py-2.5">22"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-5 p-3.5 bg-primary/40 border border-white/5 rounded-lg text-[10px] text-slate-gray font-sans">
              <span className="font-bold text-accent font-display">Fit Predictor:</span> Most oversized drops have a drop-shoulder cut. Order one size down if you prefer a standard regular fit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
