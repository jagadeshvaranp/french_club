import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

router.use(protect);
router.use(admin);

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard/stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    // 1. Total Revenue (Delivered or Paid orders)
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' }, paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    const totalOrdersCount = await Order.countDocuments({});

    // 2. Active Catalog Items
    const activeProductsCount = await Product.countDocuments({});

    // 3. Low stock alerts (stock < 5 for any size variant)
    const lowStockProducts = await Product.find({
      'sizes.stock': { $lt: 5 }
    });

    // 4. Sales over time (last 7 days for charting)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      last7Days.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        rawDateStart: new Date(d),
        rawDateEnd: new Date(d.getTime() + 24 * 60 * 60 * 1000 - 1)
      });
    }

    const salesChart = [];
    for (const day of last7Days) {
      const daySales = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: day.rawDateStart, $lte: day.rawDateEnd },
            orderStatus: { $ne: 'Cancelled' }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      salesChart.push({
        date: day.date,
        revenue: daySales.length > 0 ? daySales[0].total : 0
      });
    }

    res.json({
      revenue: totalRevenue,
      orders: totalOrdersCount,
      products: activeProductsCount,
      lowStockCount: lowStockProducts.length,
      lowStockItems: lowStockProducts.map(p => ({
        _id: p._id,
        title: p.title,
        sizes: p.sizes.filter(s => s.stock < 5)
      })),
      salesChart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', async (req, res) => {
  const { orderStatus, paymentStatus, trackingNumber } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create product
// @route   POST /api/admin/products
router.post('/products', async (req, res) => {
  const { title, description, category, subCategory, images, price, mrp, sizes, tags, isFeatured, isTrending } = req.body;

  try {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    const product = await Product.create({
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
      isFeatured,
      isTrending
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  const { title, description, category, subCategory, images, price, mrp, sizes, tags, isFeatured, isTrending } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
    product.images = images || product.images;
    product.price = price !== undefined ? Number(price) : product.price;
    product.mrp = mrp !== undefined ? Number(mrp) : product.mrp;
    product.sizes = sizes || product.sizes;
    product.tags = tags || product.tags;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;

    if (title && title !== product.title) {
      product.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
