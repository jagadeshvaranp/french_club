import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ShoppingBag, Layers, AlertCircle, LogOut, Plus, Edit2, Trash2, ArrowLeft, Loader } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: 'Shirts',
    images: ['', ''],
    price: '',
    mrp: '',
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 },
      { size: 'XXL', stock: 10 }
    ],
    tags: ['New Drop'],
    isFeatured: false,
    isTrending: false
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await api.get('/api/admin/dashboard/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get('/api/admin/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStats();
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-gray">
        <Loader className="w-8 h-8 text-accent animate-spin mb-3 text-accent" />
        <p className="text-[10px] uppercase font-bold tracking-widest">Verifying Admin Access...</p>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (orderId, updates) => {
    try {
      const { data } = await api.patch(`/api/admin/orders/${orderId}/status`, updates);
      setOrders(orders.map(o => o._id === orderId ? data : o));
      fetchStats();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      fetchStats();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      category: product.category,
      images: [product.images[0] || '', product.images[1] || ''],
      price: product.price,
      mrp: product.mrp,
      sizes: product.sizes.map(s => ({ size: s.size, stock: s.stock })),
      tags: product.tags || [],
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false
    });
    setShowProductForm(true);
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      category: 'Shirts',
      images: ['', ''],
      price: '',
      mrp: '',
      sizes: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 20 },
        { size: 'XL', stock: 15 },
        { size: 'XXL', stock: 10 }
      ],
      tags: ['New Drop'],
      isFeatured: false,
      isTrending: false
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description || !productForm.price || !productForm.mrp) {
      alert('Please fill out all fields.');
      return;
    }

    const payload = {
      ...productForm,
      images: productForm.images.filter(img => img.trim() !== '')
    };

    try {
      if (editingProduct) {
        const { data } = await api.put(`/api/admin/products/${editingProduct._id}`, payload);
        setProducts(products.map(p => p._id === editingProduct._id ? data : p));
      } else {
        const { data } = await api.post('/api/admin/products', payload);
        setProducts([data, ...products]);
      }
      setShowProductForm(false);
      fetchStats();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleSizeStockChange = (idx, stock) => {
    const updatedSizes = [...productForm.sizes];
    updatedSizes[idx].stock = Number(stock);
    setProductForm({ ...productForm, sizes: updatedSizes });
  };

  const handleImageChange = (idx, url) => {
    const updatedImages = [...productForm.images];
    updatedImages[idx] = url;
    setProductForm({ ...productForm, images: updatedImages });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row pb-24 md:pb-0 font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 p-6 flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-accent uppercase font-display border-b border-slate-800 pb-4 mb-8">
            FRENCH CLUB ADMIN
          </h2>

          <div className="space-y-2">
            <button
              onClick={() => { setActiveTab('overview'); setShowProductForm(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-accent text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Overview
            </button>
            <button
              onClick={() => { setActiveTab('products'); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'products' ? 'bg-accent text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" /> Products CRUD
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setShowProductForm(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-accent text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Orders Tracker
            </button>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 rounded-lg text-sm font-semibold transition-colors border-t border-slate-800 pt-6 mt-8 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'overview' && !loadingStats && (
          <div className="space-y-8 fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</span>
                <h3 className="text-xl md:text-3.5xl font-extrabold text-slate-950 font-display">₹{stats?.revenue}</h3>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Orders</span>
                <h3 className="text-xl md:text-3.5xl font-extrabold text-slate-950 font-display">{stats?.orders}</h3>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Active Catalog</span>
                <h3 className="text-xl md:text-3.5xl font-extrabold text-slate-950 font-display">{stats?.products}</h3>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Low Stock Warnings</span>
                <h3 className="text-xl md:text-3.5xl font-extrabold text-red-500 font-display">{stats?.lowStockCount}</h3>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-6">Sales Overview (Last 7 Days)</h4>
              {stats?.salesChart && stats.salesChart.length > 0 ? (
                <div className="relative w-full h-[200px]">
                  <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#E5A93C" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                    <path
                      d={`M 30,120 ${stats.salesChart.map((d, idx) => {
                        const x = 30 + (idx * 440) / (stats.salesChart.length - 1);
                        const maxVal = Math.max(...stats.salesChart.map(x => x.revenue), 1000);
                        const y = 120 - (d.revenue * 90) / maxVal;
                        return `L ${x},${y}`;
                      }).join(' ')} L 470,120 Z`}
                      fill="url(#chartGrad)"
                    />
                    <path
                      d={stats.salesChart.map((d, idx) => {
                        const x = 30 + (idx * 440) / (stats.salesChart.length - 1);
                        const maxVal = Math.max(...stats.salesChart.map(x => x.revenue), 1000);
                        const y = 120 - (d.revenue * 90) / maxVal;
                        return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#E5A93C"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {stats.salesChart.map((d, idx) => {
                      const x = 30 + (idx * 440) / (stats.salesChart.length - 1);
                      const maxVal = Math.max(...stats.salesChart.map(x => x.revenue), 1000);
                      const y = 120 - (d.revenue * 90) / maxVal;
                      return (
                        <circle key={idx} cx={x} cy={y} r="4" fill="#E5A93C" stroke="#fff" strokeWidth="1.5" />
                      );
                    })}
                  </svg>
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider px-6 mt-3">
                    {stats.salesChart.map((d, idx) => (
                      <span key={idx}>{d.date.split(',')[0]}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 py-10 text-center">No sales history logged.</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stock Alerts */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                  <h4 className="text-sm font-bold uppercase tracking-wider font-display">Low Stock Warnings</h4>
                </div>
                {stats?.lowStockItems?.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">All variants stocked above critical thresholds.</p>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto font-sans">
                    {stats?.lowStockItems?.map((item) => (
                      <div key={item._id} className="py-2.5 flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{item.title}</span>
                        <div className="flex gap-1.5">
                          {item.sizes.map((s, idx) => (
                            <span key={idx} className="bg-red-50 text-red-600 font-extrabold px-2 py-0.5 rounded border border-red-100">
                              {s.size}: {s.stock} left
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider font-display mb-4">Recent Orders Activity</h4>
                <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto font-sans">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-slate-900">#{order.orderNumber}</span>
                        <span className="text-slate-400 ml-2 font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800">₹{order.totalAmount}</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                          order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' :
                          order.orderStatus === 'Processing' ? 'bg-blue-50 text-blue-600' :
                          order.orderStatus === 'WhatsApp Lead' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6 fade-in">
            {showProductForm ? (
              <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-8 shadow-sm">
                <button
                  onClick={() => setShowProductForm(false)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-900 font-bold uppercase tracking-wider mb-6 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Cancel Back to List
                </button>

                <h3 className="text-base font-extrabold uppercase tracking-wider font-display mb-6">
                  {editingProduct ? `Edit Catalog Item: ${editingProduct.title}` : 'Add New Streetwear Drop'}
                </h3>

                <form onSubmit={handleProductSubmit} className="space-y-6 text-xs text-slate-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="font-bold uppercase tracking-wider block mb-1">Product Title</label>
                        <input
                          type="text"
                          value={productForm.title}
                          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                          placeholder="e.g. Enigma Heavyweight Oversized Tee"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold uppercase tracking-wider block mb-1">Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Provide detailed description..."
                          rows="4"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 outline-none focus:border-accent resize-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold uppercase tracking-wider block mb-1">Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none"
                          >
                            <option value="Shirts">Shirts</option>
                            <option value="Tees">Tees</option>
                            <option value="Bottoms">Bottoms</option>
                            <option value="Party Wear">Party Wear</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold uppercase tracking-wider block mb-1">Tags (Comma Sep)</label>
                          <input
                            type="text"
                            value={productForm.tags.join(', ')}
                            onChange={(e) => setProductForm({ ...productForm, tags: e.target.value.split(',').map(t => t.trim()) })}
                            placeholder="Trending, New Drop"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold uppercase tracking-wider block mb-1">Sale Price (INR ₹)</label>
                          <input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            placeholder="999"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="font-bold uppercase tracking-wider block mb-1">Strikethrough MRP (₹)</label>
                          <input
                            type="number"
                            value={productForm.mrp}
                            onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                            placeholder="1499"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-6 items-center pt-2">
                        <label className="flex items-center gap-2 font-bold uppercase tracking-wider cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={productForm.isFeatured}
                            onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                            className="w-4 h-4 rounded text-accent"
                          />
                          Featured
                        </label>

                        <label className="flex items-center gap-2 font-bold uppercase tracking-wider cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={productForm.isTrending}
                            onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })}
                            className="w-4 h-4 rounded text-accent"
                          />
                          Trending
                        </label>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h4 className="font-bold uppercase tracking-wider mb-2 text-slate-800">Unsplash Studio / Model Images</h4>
                        <div className="space-y-3">
                          {productForm.images.map((img, idx) => (
                            <div key={idx}>
                              <label className="text-[10px] text-slate-400 block mb-0.5">Image URL #{idx + 1}</label>
                              <input
                                type="text"
                                value={img}
                                onChange={(e) => handleImageChange(idx, e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 outline-none focus:border-accent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold uppercase tracking-wider mb-2.5 text-slate-800">Variant Inventory Stocks</h4>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          {productForm.sizes.map((s, idx) => (
                            <div key={s.size} className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                              <span className="font-extrabold text-[10px] text-slate-500 block mb-1">{s.size}</span>
                              <input
                                type="number"
                                min="0"
                                value={s.stock}
                                onChange={(e) => handleSizeStockChange(idx, e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 text-center font-bold py-1 rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-accent hover:text-slate-900 text-white font-bold py-3.5 rounded-lg text-xs tracking-wider transition-colors uppercase font-display cursor-pointer"
                  >
                    Save Catalog Item
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h3 className="text-base font-extrabold uppercase tracking-wider font-display text-slate-950">Active Catalog Items</h3>
                  <button
                    onClick={handleOpenCreateProduct}
                    className="bg-slate-900 hover:bg-accent hover:text-slate-900 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 uppercase transition-all tracking-wider cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="py-20 text-center text-slate-400">
                    <Loader className="w-8 h-8 text-accent animate-spin mb-3 mx-auto text-accent" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">Fetching Products...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 text-slate-400 uppercase font-bold">
                          <th className="py-3 px-4">Item</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">MRP</th>
                          <th className="py-3 px-4">Stock</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {products.map((p) => {
                          const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
                          return (
                            <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-4 flex items-center gap-3">
                                <img src={p.images[0]} alt={p.title} className="w-8 h-10 object-cover rounded bg-slate-100" />
                                <span className="font-semibold text-slate-950 truncate max-w-[180px]">{p.title}</span>
                              </td>
                              <td className="py-3 px-4 font-semibold uppercase">{p.category}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">₹{p.price}</td>
                              <td className="py-3 px-4 text-slate-400 line-through">₹{p.mrp}</td>
                              <td className="py-3 px-4">
                                <span className={`font-bold px-2 py-0.5 rounded ${
                                  totalStock < 10 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-800'
                                }`}>
                                  {totalStock} pcs
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="p-1.5 text-slate-400 hover:text-accent rounded transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS TRACKER */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-6 fade-in">
            <h3 className="text-base font-extrabold uppercase tracking-wider font-display text-slate-950 pb-4 border-b border-slate-100">
              Orders Tracker Console
            </h3>

            {loadingOrders ? (
              <div className="py-20 text-center text-slate-400">
                <Loader className="w-8 h-8 text-accent animate-spin mb-3 mx-auto text-accent" />
                <p className="text-[10px] uppercase font-bold tracking-widest">Fetching Orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto font-sans">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 uppercase font-bold">
                      <th className="py-3 px-4">Order No</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {orders.map((o) => ( o.shippingAddress && (
                      <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-sans">
                          <span className="font-extrabold text-slate-950 block">#{o.orderNumber}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{new Date(o.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800 font-sans">
                          {o.shippingAddress.fullName}
                        </td>
                        <td className="py-4 px-4 font-sans">
                          <span className="block font-semibold">{o.shippingAddress.phone}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px] block" title={`${o.shippingAddress.addressLine}, ${o.shippingAddress.city}`}>
                            {o.shippingAddress.city} - {o.shippingAddress.pincode}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-sans">
                          <div className="max-w-[180px] space-y-0.5">
                            {o.items.map((item, idx) => (
                              <p key={idx} className="truncate text-slate-600 font-medium">
                                • {item.title} <span className="font-bold text-[10px] uppercase">({item.size} x {item.quantity})</span>
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-950 font-sans">
                          ₹{o.totalAmount}
                        </td>
                        <td className="py-4 px-4 font-bold text-[9px] uppercase tracking-wider font-sans">
                          <span className={`px-2 py-0.5 rounded-full ${
                            o.paymentMethod === 'WhatsAppOrder' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-sans">
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(o._id, { paymentStatus: e.target.value })}
                            className={`border border-slate-200 rounded px-1.5 py-1 outline-none font-bold text-[10px] uppercase tracking-wider bg-white cursor-pointer ${
                              o.paymentStatus === 'Completed' ? 'text-green-600' : 'text-slate-600'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 font-sans">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o._id, { orderStatus: e.target.value })}
                            className={`border border-slate-200 rounded px-1.5 py-1 outline-none font-bold text-[10px] uppercase tracking-wider bg-white cursor-pointer ${
                              o.orderStatus === 'Delivered' ? 'text-green-600' :
                              o.orderStatus === 'Processing' ? 'text-blue-600' :
                              o.orderStatus === 'WhatsApp Lead' ? 'text-emerald-600' : 'text-slate-600'
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="WhatsApp Lead">WhatsApp Lead</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
