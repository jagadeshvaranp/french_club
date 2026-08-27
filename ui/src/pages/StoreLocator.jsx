import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import api from '../utils/api';

const StoreLocator = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const { data } = await api.get('/api/store/info');
        setStore(data);
      } catch (err) {
        console.error('Failed to load store information', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreInfo();
  }, []);

  if (loading || !store) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-gray">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest">Loading Store Details...</p>
      </div>
    );
  }

  const handleDirectionsClick = () => {
    window.open('https://maps.google.com/?q=' + encodeURIComponent(store.address), '_blank');
  };

  return (
    <div className="w-full min-h-screen pb-24 max-w-7xl mx-auto px-6 md:px-12 pt-10 fade-in">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase font-display">Flagship Store</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-platinum uppercase tracking-tight mt-1 font-display">
          VISIT THE OUTLET
        </h1>
        <p className="text-slate-gray text-xs md:text-sm font-semibold tracking-wider mt-3 uppercase">
          Experience French Club in person. Real-world luxury streetwear catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between bg-surface rounded-2xl border border-white/5 p-6 md:p-10 shadow-xl space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-platinum uppercase tracking-wide font-display mb-6">
              FRENCH CLUB NAMAKKAL
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-slate-gray font-bold uppercase tracking-wider">Physical Address</h4>
                  <p className="text-sm text-platinum mt-1 leading-relaxed font-sans">{store.address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-slate-gray font-bold uppercase tracking-wider">Working Hours</h4>
                  <p className="text-sm text-platinum mt-1 font-sans">{store.timings}</p>
                  <p className="text-[10px] text-accent mt-0.5 font-bold uppercase">Open Daily</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-slate-gray font-bold uppercase tracking-wider">Phone / WhatsApp</h4>
                  <a 
                    href={`tel:${store.whatsapp}`} 
                    className="text-sm text-platinum hover:text-accent font-semibold block mt-1 transition-colors font-sans"
                  >
                    {store.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <a 
              href={`tel:${store.whatsapp}`}
              className="py-3 bg-platinum hover:bg-accent hover:text-primary text-primary text-center font-bold text-xs rounded-lg uppercase tracking-wider transition-colors font-display"
            >
              Call Store
            </a>
            <button 
              onClick={handleDirectionsClick}
              className="py-3 border border-white/10 hover:border-accent hover:text-accent text-center font-bold text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer font-display"
            >
              Directions
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 aspect-[4/3] lg:aspect-auto rounded-2xl border border-white/5 overflow-hidden shadow-xl bg-surface">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.4357774026367!2d78.15949667471465!3d11.223847188950454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab07db495c023d%3A0x6b87640c6c77bb32!2s49%20Salem-Namakkal%20Rd%2C%20R.P%20Pudur%2C%20Namakkal%2C%20Tamil%20Nadu%20637001!5e0!3m2!1sen!2sin!4v1714496739210!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(10%) contrast(110%)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="French Club Namakkal Shop Map"
          />
        </div>
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-surface border border-white/5 text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-1.5 text-accent">
          <Star className="w-5 h-5 fill-accent text-accent" />
          <Star className="w-5 h-5 fill-accent text-accent" />
          <Star className="w-5 h-5 fill-accent text-accent" />
          <Star className="w-5 h-5 fill-accent text-accent" />
          <Star className="w-5 h-5 fill-accent text-accent" />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-wide font-display">
          {store.googleRating} Stars on Google Reviews
        </h3>
        <p className="text-xs text-slate-gray leading-relaxed max-w-md mx-auto font-sans">
          Proven client satisfaction from {store.reviewsCount}+ active reviews. Come in-store to check out our sizing fittings and custom drops!
        </p>
      </div>
    </div>
  );
};

export default StoreLocator;
