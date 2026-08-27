import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { SlidersHorizontal, Loader } from 'lucide-react';

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    const searchParam = params.get('search');
    
    if (catParam) setCategory(catParam);
    else setCategory('All');

    if (searchParam) setSearch(searchParam);
    else setSearch('');
  }, [location.search]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?sort=${sort}`;
        if (category && category !== 'All') {
          url += `&category=${encodeURIComponent(category)}`;
        }
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        const { data } = await api.get(url);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch filtered products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [category, sort, search]);

  const categories = ['All', 'Shirts', 'Tees', 'Bottoms', 'Party Wear'];

  return (
    <div className="w-full min-h-screen pb-24 max-w-7xl mx-auto px-6 md:px-12 pt-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase font-display">Collections</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-platinum uppercase tracking-tight font-display mt-1">
            SHOP THE DROP
          </h1>
        </div>
        <p className="text-xs text-slate-gray font-semibold tracking-wider uppercase">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-2 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                category === cat
                  ? 'border-accent bg-accent text-primary scale-105 shadow-md shadow-accent/15 text-primary'
                  : 'border-white/10 text-slate-gray hover:text-platinum hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-gray" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-surface border border-white/10 text-platinum text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-accent uppercase tracking-wider cursor-pointer"
          >
            <option value="latest">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-slate-gray">
          <Loader className="w-8 h-8 text-accent animate-spin mb-3 text-accent" />
          <p className="text-[10px] uppercase font-bold tracking-widest">Updating Catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-gray font-sans">
          <p className="text-sm font-semibold mb-2 text-platinum">No products match your criteria</p>
          <p className="text-xs">Try selecting another category or clearing your search filter.</p>
          {(category !== 'All' || search) && (
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
              }}
              className="mt-6 px-5 py-2 border border-white/20 hover:border-accent hover:text-accent rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
