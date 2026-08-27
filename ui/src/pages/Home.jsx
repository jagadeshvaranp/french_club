import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Truck, MessageSquare, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [newDropProducts, setNewDropProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        const newDrops = data.filter(p => p.tags.includes('New Drop') || p.isFeatured).slice(0, 4);
        setNewDropProducts(newDrops.length > 0 ? newDrops : data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching homepage products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full pb-20 lg:pb-10 fade-in">
      {/* Cinematic Hero */}
      <section className="relative h-[92vh] w-full bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&auto=format&fit=crop&q=80" 
            alt="French Club Fashion Campaign" 
            className="w-full h-full object-cover object-top opacity-60 md:opacity-75 scale-105 animate-[zoomOut_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center">
          <div className="flex items-center gap-1 text-accent text-xs font-extrabold tracking-[0.3em] uppercase mb-4 font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" /> NAMAKKAL • TAMIL NADU
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-platinum uppercase tracking-tighter leading-none mb-4 font-display select-none">
            ELEVATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-platinum via-platinum to-accent">YOUR DRIP</span>
          </h1>

          <p className="text-slate-gray text-xs sm:text-sm md:text-base font-semibold tracking-widest max-w-md uppercase mb-8 leading-relaxed">
            Premium Men's Collection — 2026
          </p>

          <Link 
            to="/shop" 
            className="px-8 py-3.5 bg-platinum hover:bg-accent text-primary font-bold text-xs rounded-lg uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-xl hover:shadow-accent/20 cursor-pointer font-display"
          >
            Shop The Drop
          </Link>
        </div>

        {/* Trust Bar */}
        <div className="absolute bottom-6 left-0 right-0 z-10 px-6 flex flex-wrap justify-center items-center gap-4 md:gap-12 text-slate-gray text-[10px] md:text-xs font-bold tracking-widest uppercase bg-black/45 backdrop-blur-md py-3.5 border-y border-white/5 select-none">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-accent fill-accent text-accent" />
            <span>4.9★ Rated on Google (110+ Reviews)</span>
          </div>
          <span className="hidden md:inline text-white/20">•</span>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-accent" />
            <span>Direct Store Dispatch</span>
          </div>
          <span className="hidden md:inline text-white/20">•</span>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span>Instant WhatsApp Support</span>
          </div>
        </div>
      </section>

      {/* New Drop Section */}
      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase">Freshly Dispatched</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-platinum tracking-tight uppercase font-display mt-1">NEW DROP</h2>
          </div>
          <Link to="/shop" className="text-xs text-slate-gray hover:text-accent font-bold tracking-widest uppercase flex items-center gap-1 transition-colors">
            See All Items <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-surface rounded-xl border border-white/5" />
                <div className="h-4 bg-surface rounded w-3/4" />
                <div className="h-3 bg-surface rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newDropProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bento Category Grid */}
      <section className="px-6 md:px-12 py-16 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase">Curated Catalog</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-platinum tracking-tight uppercase font-display mt-1">SHOP THE COLLECTION</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Premium Shirts */}
            <div 
              onClick={() => navigate('/shop?category=Shirts')}
              className="md:col-span-2 relative aspect-[16/10] md:aspect-auto md:h-[420px] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&auto=format&fit=crop&q=80" 
                alt="Premium Shirts" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl md:text-3xl font-extrabold text-platinum uppercase font-display mb-2">Premium Shirts</h3>
                <span className="text-xs text-accent font-extrabold tracking-widest uppercase flex items-center gap-1 group-hover:text-platinum transition-colors">
                  Shop Shirts <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>

            {/* Oversized Tees */}
            <div 
              onClick={() => navigate('/shop?category=Tees')}
              className="relative aspect-[16/10] md:aspect-auto md:h-[420px] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80" 
                alt="Oversized Tees" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-extrabold text-platinum uppercase font-display mb-2">Oversized Tees</h3>
                <span className="text-xs text-accent font-extrabold tracking-widest uppercase flex items-center gap-1 group-hover:text-platinum transition-colors">
                  Shop Tees <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>

            {/* Denim & Cargos */}
            <div 
              onClick={() => navigate('/shop?category=Bottoms')}
              className="md:col-span-3 relative aspect-[16/8] md:h-[300px] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&auto=format&fit=crop&q=80" 
                alt="Denim & Cargos" 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl md:text-3xl font-extrabold text-platinum uppercase font-display mb-2">Denim & Cargos</h3>
                <span className="text-xs text-accent font-extrabold tracking-widest uppercase flex items-center gap-1 group-hover:text-platinum transition-colors">
                  Shop Bottoms <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "THE FRENCH CLUB MAN" Lifestyle Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase">Lifestyle & Fits</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-platinum uppercase tracking-tight font-display mt-1">THE FRENCH CLUB MAN</h2>
          <p className="text-slate-gray text-xs md:text-sm font-semibold tracking-wider mt-2.5 max-w-md mx-auto uppercase">
            Not just clothes. It's the way you carry them.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=1000&auto=format&fit=crop&q=80" 
              alt="French Club Style Campaign" 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="space-y-6">
            {/* College Edit */}
            <div 
              onClick={() => navigate('/shop?search=oversized')}
              className="p-6 bg-surface border border-white/5 hover:border-accent/40 rounded-xl cursor-pointer group transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-accent font-extrabold tracking-widest uppercase">01 / Everyday Drip</span>
                  <h4 className="text-lg font-bold text-platinum uppercase font-display mt-1">COLLEGE EDIT</h4>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-gray group-hover:text-accent transition-transform group-hover:translate-x-1.5" />
              </div>
              <p className="text-slate-gray text-xs mt-2 leading-relaxed">
                Stay comfortable on campus. Combine our <span className="text-platinum font-semibold">Oversized Graphic Tees</span> with relaxed-fit <span className="text-platinum font-semibold">Baggy Cargo Jeans</span> for an effortless modern streetwear fit.
              </p>
            </div>

            {/* Weekend Edit */}
            <div 
              onClick={() => navigate('/shop?category=Shirts')}
              className="p-6 bg-surface border border-white/5 hover:border-accent/40 rounded-xl cursor-pointer group transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-accent font-extrabold tracking-widest uppercase">02 / Cozy Luxury</span>
                  <h4 className="text-lg font-bold text-platinum uppercase font-display mt-1">WEEKEND EDIT</h4>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-gray group-hover:text-accent transition-transform group-hover:translate-x-1.5" />
              </div>
              <p className="text-slate-gray text-xs mt-2 leading-relaxed">
                Perfect for cafe runs. Pair our highly breathable <span className="text-platinum font-semibold">Signature Premium Linen Shirts</span> with clean <span className="text-platinum font-semibold">Structured Linen Trousers</span> in ivory or off-white.
              </p>
            </div>

            {/* Night Edit */}
            <div 
              onClick={() => navigate('/shop?category=Party Wear')}
              className="p-6 bg-surface border border-white/5 hover:border-accent/40 rounded-xl cursor-pointer group transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-accent font-extrabold tracking-widest uppercase">03 / Executive Club</span>
                  <h4 className="text-lg font-bold text-platinum uppercase font-display mt-1">NIGHT EDIT</h4>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-gray group-hover:text-accent transition-transform group-hover:translate-x-1.5" />
              </div>
              <p className="text-slate-gray text-xs mt-2 leading-relaxed">
                Command attention. Tailor your night out with our high-sheen <span className="text-platinum font-semibold">Midnight Satin Party Shirt</span> or structure your appearance with the premium <span className="text-platinum font-semibold">Bordeaux Jacquard Blazer</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-6 md:px-12 py-16 bg-surface/20 border-y border-white/5 text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-4">
            <ShieldCheck className="w-8 h-8 text-accent mb-3.5" />
            <h4 className="text-sm font-bold text-platinum uppercase tracking-wide font-display">Premium Sourcing</h4>
            <p className="text-xs text-slate-gray mt-2 leading-relaxed font-sans">
              Every drop is engineered with premium fabrics like 100% Belgian flax linen and 280 GSM heavy cotton.
            </p>
          </div>
          <div className="flex flex-col items-center p-4 border-y md:border-y-0 md:border-x border-white/5">
            <Star className="w-8 h-8 text-accent fill-accent text-accent mb-3.5" />
            <h4 className="text-sm font-bold text-platinum uppercase tracking-wide font-display">4.9★ Google Rating</h4>
            <p className="text-xs text-slate-gray mt-2 leading-relaxed font-sans">
              Trusted by 110+ Namakkal fashion heads. Rated outstanding for our catalog variance and customer relations.
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <ShoppingBag className="w-8 h-8 text-accent mb-3.5" />
            <h4 className="text-sm font-bold text-platinum uppercase tracking-wide font-display">Direct Dispatch</h4>
            <p className="text-xs text-slate-gray mt-2 leading-relaxed font-sans">
              All items are physical stock in our Namakkal outlet. Ready for immediate local pick-up or fast nationwide courier dispatch.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes zoomOut {
          0% { transform: scale(1.05) translateY(0); }
          100% { transform: scale(1) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
