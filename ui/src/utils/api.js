import axios from 'axios';

// ----------------------------------------------------
// LOCAL STORAGE MOCK DATABASE IMPLEMENTATION
// ----------------------------------------------------

const getDB = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setDB = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Initial default seed data
const initialProducts = [
  {
    _id: "prod-1",
    title: "Enigma Heavyweight Oversized Tee",
    slug: "enigma-heavyweight-oversized-tee",
    description: "Premium drop-shoulder streetwear graphic tee. Engineered with 280 GSM ultra-soft combed cotton. Features the luxury gothic text graphic print at the back and subtle logo detailing at the front chest. Pre-shrunk for the perfect baggy silhouette that holds its structure.",
    category: "Tees",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
    ],
    price: 999,
    mrp: 1499, 
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 20 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 },
      { size: "XXL", stock: 8 }
    ],
    isFeatured: true,
    isTrending: true,
    tags: ["Trending", "New Drop", "Bestseller"],
    rating: 4.9,
    reviewsCount: 142,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-2",
    title: "Signature Premium Linen Shirt",
    slug: "signature-premium-linen-shirt",
    description: "Tailored from 100% Belgian flax linen. Super lightweight, breathable, and pre-washed for ultimate softness. Features a clean band collar, single chest pocket, and mother-of-pearl buttons. Perfect for hot coastal afternoons or semi-casual evenings.",
    category: "Shirts",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1299,
    mrp: 1999,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 4 }
    ],
    isFeatured: true,
    isTrending: false,
    tags: ["Trending", "Classic"],
    rating: 4.8,
    reviewsCount: 96,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-3",
    title: "Obsidian Baggy Cargo Jeans",
    slug: "obsidian-baggy-cargo-jeans",
    description: "Relaxed baggy fit crafted from premium 14oz heavy-grade indigo denim. Features utility side-flap cargo pockets, detailed knee-articulation paneling, and custom French Club branded metal rivets. Stone-washed for a vintage slate black finish.",
    category: "Bottoms",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1799,
    mrp: 2699,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 14 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 5 }
    ],
    isFeatured: true,
    isTrending: true,
    tags: ["Trending", "New Drop"],
    rating: 4.7,
    reviewsCount: 88,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-4",
    title: "Infinite Comfort Cargo Trousers",
    slug: "infinite-comfort-cargo-trousers",
    description: "Street-ready tactical cargo pants made from double-weave stretch cotton twill. Featuring adjustable ankle drawstring locks, high-capacity utility pockets, and reinforced seat lining. Engineered for everyday durability and modern street layouts.",
    category: "Bottoms",
    images: [
      "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1499,
    mrp: 2199,
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 22 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 6 }
    ],
    isFeatured: false,
    isTrending: true,
    tags: ["New Drop", "Bestseller"],
    rating: 4.8,
    reviewsCount: 110,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-5",
    title: "Midnight Satin Party Shirt",
    slug: "midnight-satin-party-shirt",
    description: "Unleash your luxury aesthetic. Tailored with premium high-sheen satin-silk blend that drapes elegantly over the chest and shoulders. Designed with a sleek wide camp collar, hidden front placket, and deep buttoned cuffs. Destined for club nights.",
    category: "Party Wear",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1399,
    mrp: 1999,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 7 },
      { size: "XXL", stock: 3 }
    ],
    isFeatured: true,
    isTrending: true,
    tags: ["Trending", "Party Exclusive"],
    rating: 4.9,
    reviewsCount: 65,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-6",
    title: "Nomad Drop-Shoulder Graphic Tee",
    slug: "nomad-drop-shoulder-graphic-tee",
    description: "Heavyweight 240 GSM drop-shoulder tee. Features the unique 'Nomad Explorer' front-chest embroidered graphic with distressed elements. Standard boxy fit engineered for everyday casual versatility.",
    category: "Tees",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80"
    ],
    price: 899,
    mrp: 1299,
    sizes: [
      { size: "S", stock: 18 },
      { size: "M", stock: 25 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 20 },
      { size: "XXL", stock: 10 }
    ],
    isFeatured: false,
    isTrending: true,
    tags: ["New Drop"],
    rating: 4.6,
    reviewsCount: 52,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-7",
    title: "Bordeaux Jacquard Blazer",
    slug: "bordeaux-jacquard-blazer",
    description: "Premium micro-jacquard knit structure woven in deep wine bordeaux color. Cut in a modern slim silhouette with structured shoulders, notch lapels, and satin inner lining. Elevates your evening attire.",
    category: "Party Wear",
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598808503742-dd34bd0444d9?w=800&auto=format&fit=crop&q=80"
    ],
    price: 3499,
    mrp: 4999,
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 6 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 },
      { size: "XXL", stock: 2 }
    ],
    isFeatured: true,
    isTrending: false,
    tags: ["Bestseller", "Premium Luxury"],
    rating: 4.9,
    reviewsCount: 43,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-8",
    title: "Off-White Structured Linen Trouser",
    slug: "off-white-structured-linen-trouser",
    description: "Structured straight-fit trousers woven from pure Italian linen-cotton fiber. Designed with an adjustable hidden waistband drawcord, double-welt back pockets, and flat-front creases. Elevates any linen shirt combo.",
    category: "Bottoms",
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1599,
    mrp: 2399,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 12 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 8 },
      { size: "XXL", stock: 3 }
    ],
    isFeatured: false,
    isTrending: false,
    tags: ["New Drop", "Classic"],
    rating: 4.7,
    reviewsCount: 38,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-9",
    title: "Ghost Grey Distressed Tee",
    slug: "ghost-grey-distressed-tee",
    description: "Heavywashed 260 GSM single jersey cotton. Features custom distressing details around the collar and sleeves, yielding a unique worn-in vintage look. The ideal base layer for any tactical drop.",
    category: "Tees",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"
    ],
    price: 899,
    mrp: 1299,
    sizes: [
      { size: "S", stock: 14 },
      { size: "M", stock: 18 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 14 },
      { size: "XXL", stock: 6 }
    ],
    isFeatured: false,
    isTrending: false,
    tags: ["New Drop"],
    rating: 4.8,
    reviewsCount: 71,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "prod-10",
    title: "Chambray Utility Indigo Shirt",
    slug: "chambray-utility-indigo-shirt",
    description: "Double-pocket workwear shirt woven from durable lightweight chambray. Finished with standard copper button closures and triple-needle flat-felled seam reinforcements. Built to wear, age, and endure.",
    category: "Shirts",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1199,
    mrp: 1799,
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 14 },
      { size: "L", stock: 16 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 4 }
    ],
    isFeatured: false,
    isTrending: true,
    tags: ["Bestseller"],
    rating: 4.8,
    reviewsCount: 115,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialUsers = [
  {
    _id: "user-admin",
    name: "French Club Admin",
    email: "admin@frenchclub.com",
    password: "admin123",
    role: "admin",
    phone: "+91 76674 47576",
    wishlist: [],
    addresses: []
  },
  {
    _id: "user-test",
    name: "Jagadesh Vran",
    email: "user@gmail.com",
    password: "user123",
    role: "user",
    phone: "+91 98765 43210",
    wishlist: ["prod-1", "prod-3"],
    addresses: [{
      fullName: "Jagadesh Vran",
      phone: "+91 98765 43210",
      addressLine: "12, Main Street, RP Pudur",
      city: "Namakkal",
      state: "Tamil Nadu",
      pincode: "637001",
      isDefault: true
    }]
  }
];

const initialOrders = [
  {
    _id: "order-1",
    orderNumber: "FC1001",
    user: "user-test",
    items: [
      { product: "prod-1", title: "Enigma Heavyweight Oversized Tee", size: "L", quantity: 1, price: 999 },
      { product: "prod-2", title: "Signature Premium Linen Shirt", size: "M", quantity: 1, price: 1299 }
    ],
    shippingAddress: {
      fullName: "Jagadesh Vran",
      phone: "+91 98765 43210",
      addressLine: "12, Main Street, RP Pudur",
      city: "Namakkal",
      state: "Tamil Nadu",
      pincode: "637001",
      isDefault: true
    },
    paymentMethod: "Online",
    paymentStatus: "Completed",
    orderStatus: "Delivered",
    totalAmount: 2298,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "order-2",
    orderNumber: "FC1002",
    user: "user-test",
    items: [
      { product: "prod-3", title: "Obsidian Baggy Cargo Jeans", size: "M", quantity: 1, price: 1799 }
    ],
    shippingAddress: {
      fullName: "Jagadesh Vran",
      phone: "+91 98765 43210",
      addressLine: "12, Main Street, RP Pudur",
      city: "Namakkal",
      state: "Tamil Nadu",
      pincode: "637001",
      isDefault: true
    },
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Processing",
    totalAmount: 1799,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "order-3",
    orderNumber: "FC1003",
    user: null,
    items: [
      { product: "prod-5", title: "Midnight Satin Party Shirt", size: "XL", quantity: 1, price: 1399 }
    ],
    shippingAddress: {
      fullName: "Karthik Raja",
      phone: "+91 76674 11111",
      addressLine: "45, Salem Road",
      city: "Namakkal",
      state: "Tamil Nadu",
      pincode: "637001"
    },
    paymentMethod: "WhatsAppOrder",
    paymentStatus: "Pending",
    orderStatus: "WhatsApp Lead",
    totalAmount: 1399,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const initialStoreInfo = {
  brandName: 'French Club',
  address: '49, Salem - Namakkal Rd, R.P Pudur, Namakkal, Tamil Nadu 637001',
  phone: '+91 76674 47576',
  whatsapp: '+917667447576',
  googleRating: 4.9,
  reviewsCount: 112,
  timings: 'Daily: 09:30 AM - 09:30 PM',
  announcement: 'FREE DELIVERY ON ALL ORDERS OVER ₹2,999! • NEW DROP IN-STORE & ONLINE',
  coordinates: {
    lat: 11.2238472,
    lng: 78.1633519
  }
};

// Initialize the simulated local storage DB
const initMockDB = () => {
  if (!localStorage.getItem('fc_products')) {
    setDB('fc_products', initialProducts);
  }
  if (!localStorage.getItem('fc_users')) {
    setDB('fc_users', initialUsers);
  }
  if (!localStorage.getItem('fc_orders')) {
    setDB('fc_orders', initialOrders);
  }
  if (!localStorage.getItem('fc_store_info')) {
    setDB('fc_store_info', initialStoreInfo);
  }
};

// Execute DB initialization immediately
initMockDB();

// ----------------------------------------------------
// AXIOS CLIENT CONFIGURATION & INTERCEPTORS
// ----------------------------------------------------

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Support dynamic backend URL in production
});

// Request interceptor to inject Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to match dynamic URL patterns (e.g. /api/products/:slug)
const getRouteMatch = (path, routePattern) => {
  const pathParts = path.split('/').filter(Boolean);
  const patternParts = routePattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i].toLowerCase() !== pathParts[i].toLowerCase()) {
      return null;
    }
  }
  return params;
};

// Helper to parse query parameters from the url string
const parseQueryParams = (urlString) => {
  const params = {};
  if (!urlString) return params;
  const qMarkIndex = urlString.indexOf('?');
  if (qMarkIndex === -1) return params;
  const queryString = urlString.slice(qMarkIndex + 1);
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    if (!pair) continue;
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  return params;
};

// Custom Mock Adapter to catch and respond to requests locally
const mockAdapter = (config) => {
  return new Promise((resolve, reject) => {
    // 1. Parse Path & Method
    let path = config.url || '';
    const qMarkIndex = path.indexOf('?');
    if (qMarkIndex !== -1) {
      path = path.slice(0, qMarkIndex);
    }
    // Remove base URL prefix if present in the absolute/relative URL
    if (config.baseURL && path.startsWith(config.baseURL)) {
      path = path.slice(config.baseURL.length);
    }
    const method = (config.method || 'get').toLowerCase();

    // 2. Parse Query Params & Body
    const urlParams = parseQueryParams(config.url);
    const query = { ...urlParams, ...(config.params || {}) };

    let body = {};
    if (config.data) {
      if (typeof config.data === 'string') {
        try {
          body = JSON.parse(config.data);
        } catch (e) {
          body = {};
        }
      } else {
        body = config.data;
      }
    }

    // 3. Helper to format mock response
    const makeResponse = (data, status = 200, statusText = 'OK') => {
      return {
        data,
        status,
        statusText,
        headers: { 'content-type': 'application/json' },
        config
      };
    };

    // Helper to format mock error
    const makeError = (message, status = 400, statusText = 'Bad Request') => {
      const err = new Error(message);
      err.response = {
        data: { message },
        status,
        statusText,
        headers: { 'content-type': 'application/json' },
        config
      };
      return err;
    };

    // 4. Authenticate Request User (if token provided)
    const authHeader = config.headers?.Authorization || config.headers?.authorization;
    let currentUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token && token.startsWith('mock-token-')) {
        const userId = token.replace('mock-token-', '');
        const users = getDB('fc_users', []);
        currentUser = users.find(u => u._id === userId);
      }
    }

    // Helper to enforce auth guard
    const requireAuth = () => {
      if (!currentUser) {
        throw makeError('Not authorized, no token', 401, 'Unauthorized');
      }
    };

    // Helper to enforce admin guard
    const requireAdmin = () => {
      requireAuth();
      if (currentUser.role !== 'admin') {
        throw makeError('Not authorized, not an admin', 403, 'Forbidden');
      }
    };

    try {
      // ----------------------------------------------------
      // ROUTING & HANDLERS
      // ----------------------------------------------------

      // A. GET /api/store/info
      if (method === 'get' && path === '/api/store/info') {
        const storeInfo = getDB('fc_store_info', initialStoreInfo);
        return resolve(makeResponse(storeInfo));
      }

      // B. GET /api/products
      if (method === 'get' && path === '/api/products') {
        const products = getDB('fc_products', []);
        const { category, tag, search, minPrice, maxPrice, size, sort } = query;
        let filtered = [...products];

        // Category filter
        if (category && category !== 'All' && category !== 'all') {
          filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        // Tag filter (Featured, Trending, New Drop)
        if (tag) {
          filtered = filtered.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
        }

        // Size filter
        if (size) {
          filtered = filtered.filter(p => p.sizes && p.sizes.some(s => s.size.toUpperCase() === size.toUpperCase() && s.stock > 0));
        }

        // Price range
        if (minPrice) {
          filtered = filtered.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
          filtered = filtered.filter(p => p.price <= Number(maxPrice));
        }

        // Text Search
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(s) || 
            p.description.toLowerCase().includes(s) || 
            p.category.toLowerCase().includes(s) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(s)))
          );
        }

        // Sorting
        if (sort === 'price-low') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating);
        } else {
          // default latest
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return resolve(makeResponse(filtered));
      }

      // C. GET /api/products/:slug
      let match = getRouteMatch(path, '/api/products/:slug');
      if (method === 'get' && match) {
        const products = getDB('fc_products', []);
        const product = products.find(p => p.slug === match.slug);
        if (!product) {
          return reject(makeError('Product not found', 404));
        }
        const related = products
          .filter(p => p.category === product.category && p._id !== product._id)
          .slice(0, 4);

        return resolve(makeResponse({ product, related }));
      }

      // D. POST /api/auth/register
      if (method === 'post' && path === '/api/auth/register') {
        const users = getDB('fc_users', []);
        const { name, email, password, phone } = body;

        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return reject(makeError('User already exists', 400));
        }

        // First user or email with 'admin' gets admin role
        const role = (users.length === 0 || email.toLowerCase().includes('admin')) ? 'admin' : 'user';

        const newUser = {
          _id: "user-" + Date.now(),
          name,
          email,
          password, // in local mock, plain text matches comparePassword simulation
          phone,
          role,
          wishlist: [],
          addresses: []
        };

        users.push(newUser);
        setDB('fc_users', users);

        return resolve(makeResponse({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          token: "mock-token-" + newUser._id
        }, 201));
      }

      // E. POST /api/auth/login
      if (method === 'post' && path === '/api/auth/login') {
        const users = getDB('fc_users', []);
        const { email, password } = body;

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.password === password) {
          return resolve(makeResponse({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            token: "mock-token-" + user._id
          }));
        } else {
          return reject(makeError('Invalid email or password', 401));
        }
      }

      // F. GET /api/auth/profile
      if (method === 'get' && path === '/api/auth/profile') {
        requireAuth();
        const products = getDB('fc_products', []);
        const populatedWishlist = (currentUser.wishlist || []).map(pId => products.find(p => p._id === pId) || pId);
        const profile = {
          ...currentUser,
          wishlist: populatedWishlist
        };
        delete profile.password;
        return resolve(makeResponse(profile));
      }

      // G. POST /api/auth/wishlist/:id
      match = getRouteMatch(path, '/api/auth/wishlist/:id');
      if (method === 'post' && match) {
        requireAuth();
        const users = getDB('fc_users', []);
        const userIndex = users.findIndex(u => u._id === currentUser._id);
        if (userIndex === -1) {
          return reject(makeError('User not found', 404));
        }

        const user = users[userIndex];
        if (!user.wishlist) user.wishlist = [];

        const prodId = match.id;
        const index = user.wishlist.indexOf(prodId);
        let msg = '';
        if (index > -1) {
          user.wishlist.splice(index, 1);
          msg = 'Removed from wishlist';
        } else {
          user.wishlist.push(prodId);
          msg = 'Added to wishlist';
        }

        users[userIndex] = user;
        setDB('fc_users', users);

        return resolve(makeResponse({ message: msg, wishlist: user.wishlist }));
      }

      // H. POST /api/orders
      if (method === 'post' && path === '/api/orders') {
        const { items, shippingAddress, paymentMethod } = body;
        if (!items || items.length === 0) {
          return reject(makeError('No order items', 400));
        }

        const products = getDB('fc_products', []);
        let totalAmount = 0;
        const validatedItems = [];

        // Validate stock and size
        for (const item of items) {
          const product = products.find(p => p._id === item.product);
          if (!product) {
            return reject(makeError(`Product not found: ${item.title}`, 404));
          }

          const sizeObj = product.sizes.find(s => s.size.toUpperCase() === item.size.toUpperCase());
          if (!sizeObj) {
            return reject(makeError(`Size ${item.size} not found for product ${product.title}`, 400));
          }

          if (sizeObj.stock < item.quantity) {
            return reject(makeError(`Insufficient stock for ${product.title} in size ${item.size}. Only ${sizeObj.stock} left.`, 400));
          }

          validatedItems.push({
            product: product._id,
            title: product.title,
            size: item.size,
            quantity: item.quantity,
            price: product.price
          });

          totalAmount += product.price * item.quantity;
        }

        // Decrement stock
        const updatedProducts = products.map(p => {
          const matchingItems = validatedItems.filter(item => item.product === p._id);
          if (matchingItems.length > 0) {
            const newSizes = p.sizes.map(s => {
              const matched = matchingItems.find(item => item.size.toUpperCase() === s.size.toUpperCase());
              if (matched) {
                return { ...s, stock: Math.max(0, s.stock - matched.quantity) };
              }
              return s;
            });
            return { ...p, sizes: newSizes };
          }
          return p;
        });
        setDB('fc_products', updatedProducts);

        // Save order
        const orders = getDB('fc_orders', []);
        const orderNumber = `FC${1000 + orders.length + 1}`;

        const newOrder = {
          _id: "order-" + Date.now(),
          orderNumber,
          user: currentUser ? currentUser._id : null,
          items: validatedItems,
          shippingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === 'Online' ? 'Completed' : 'Pending',
          orderStatus: paymentMethod === 'WhatsAppOrder' ? 'WhatsApp Lead' : 'Processing',
          totalAmount,
          createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        setDB('fc_orders', orders);

        return resolve(makeResponse(newOrder, 201));
      }

      // I. GET /api/orders/my-orders
      if (method === 'get' && path === '/api/orders/my-orders') {
        requireAuth();
        const orders = getDB('fc_orders', []);
        const userOrders = orders
          .filter(o => o.user === currentUser._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return resolve(makeResponse(userOrders));
      }

      // ----------------------------------------------------
      // ADMIN PANEL CONTROLLERS (PROTECTED)
      // ----------------------------------------------------

      // J. GET /api/admin/dashboard/stats
      if (method === 'get' && path === '/api/admin/dashboard/stats') {
        requireAdmin();
        const orders = getDB('fc_orders', []);
        const products = getDB('fc_products', []);

        // 1. Total Revenue (Delivered or Paid completed orders)
        const totalRevenue = orders
          .filter(o => o.orderStatus !== 'Cancelled' && o.paymentStatus === 'Completed')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        // 2. Active catalog products
        const activeProductsCount = products.length;

        // 3. Low stock (stock < 5 for any variant)
        const lowStockProducts = products.filter(p => p.sizes.some(s => s.stock < 5));

        // 4. Last 7 days chart data
        const salesChart = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0,0,0,0);
          const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          
          const start = d.getTime();
          const end = start + 24 * 60 * 60 * 1000;

          const dayOrders = orders.filter(o => {
            const orderTime = new Date(o.createdAt).getTime();
            return orderTime >= start && orderTime < end && o.orderStatus !== 'Cancelled';
          });

          const revenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          salesChart.push({ date: dateStr, revenue });
        }

        return resolve(makeResponse({
          revenue: totalRevenue,
          orders: orders.length,
          products: activeProductsCount,
          lowStockCount: lowStockProducts.length,
          lowStockItems: lowStockProducts.map(p => ({
            _id: p._id,
            title: p.title,
            sizes: p.sizes.filter(s => s.stock < 5)
          })),
          salesChart
        }));
      }

      // K. GET /api/admin/orders
      if (method === 'get' && path === '/api/admin/orders') {
        requireAdmin();
        const orders = getDB('fc_orders', []);
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return resolve(makeResponse(orders));
      }

      // L. PATCH /api/admin/orders/:id/status
      match = getRouteMatch(path, '/api/admin/orders/:id/status');
      if (method === 'patch' && match) {
        requireAdmin();
        const orders = getDB('fc_orders', []);
        const idx = orders.findIndex(o => o._id === match.id);
        if (idx === -1) {
          return reject(makeError('Order not found', 404));
        }

        const order = orders[idx];
        const { orderStatus, paymentStatus, trackingNumber } = body;
        
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

        orders[idx] = order;
        setDB('fc_orders', orders);

        return resolve(makeResponse(order));
      }

      // M. POST /api/admin/products
      if (method === 'post' && path === '/api/admin/products') {
        requireAdmin();
        const products = getDB('fc_products', []);
        const { title, description, category, subCategory, images, price, mrp, sizes, tags, isFeatured, isTrending } = body;

        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

        const newProd = {
          _id: "prod-" + Date.now(),
          title,
          slug,
          description,
          category,
          subCategory,
          images,
          price: Number(price),
          mrp: Number(mrp),
          sizes,
          tags,
          isFeatured: !!isFeatured,
          isTrending: !!isTrending,
          rating: 5.0,
          reviewsCount: 0,
          createdAt: new Date().toISOString()
        };

        products.push(newProd);
        setDB('fc_products', products);

        return resolve(makeResponse(newProd, 201));
      }

      // N. PUT /api/admin/products/:id
      match = getRouteMatch(path, '/api/admin/products/:id');
      if (method === 'put' && match) {
        requireAdmin();
        const products = getDB('fc_products', []);
        const idx = products.findIndex(p => p._id === match.id);
        if (idx === -1) {
          return reject(makeError('Product not found', 404));
        }

        const product = products[idx];
        const { title, description, category, subCategory, images, price, mrp, sizes, tags, isFeatured, isTrending } = body;

        if (title && title !== product.title) {
          product.title = title;
          product.slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
        }

        if (description) product.description = description;
        if (category) product.category = category;
        if (subCategory !== undefined) product.subCategory = subCategory;
        if (images) product.images = images;
        if (price !== undefined) product.price = Number(price);
        if (mrp !== undefined) product.mrp = Number(mrp);
        if (sizes) product.sizes = sizes;
        if (tags) product.tags = tags;
        if (isFeatured !== undefined) product.isFeatured = !!isFeatured;
        if (isTrending !== undefined) product.isTrending = !!isTrending;

        products[idx] = product;
        setDB('fc_products', products);

        return resolve(makeResponse(product));
      }

      // O. DELETE /api/admin/products/:id
      match = getRouteMatch(path, '/api/admin/products/:id');
      if (method === 'delete' && match) {
        requireAdmin();
        const products = getDB('fc_products', []);
        const filtered = products.filter(p => p._id !== match.id);
        if (filtered.length === products.length) {
          return reject(makeError('Product not found', 404));
        }
        setDB('fc_products', filtered);
        return resolve(makeResponse({ message: 'Product deleted successfully' }));
      }

      // If route not matched, throw 404
      return reject(makeError(`Mock API Route Not Found: ${method.toUpperCase()} ${path}`, 404, 'Not Found'));

    } catch (err) {
      // Catch any guard failures or internal throws
      return reject(err.response ? err : makeError(err.message || 'Internal Mock Server Error', 500));
    }
  });
};

// Hook our custom adapter to the Axios instance
api.defaults.adapter = mockAdapter;

export default api;
