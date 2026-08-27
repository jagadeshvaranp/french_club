import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Get all products with filters
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, minPrice, maxPrice, size, sort } = req.query;
    let query = {};

    // Category filter (case-insensitive)
    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Tag filter (Featured, Trending, New Drop)
    if (tag) {
      query.tags = { $regex: new RegExp(`^${tag}$`, 'i') };
    }

    // Size filter
    if (size) {
      query['sizes.size'] = size.toUpperCase();
      query['sizes.stock'] = { $gt: 0 };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let apiQuery = Product.find(query);

    // Sorting
    if (sort) {
      if (sort === 'price-low') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'price-high') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'latest') {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ rating: -1 });
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single product by slug and related items
// @route   GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({
      product,
      related
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
