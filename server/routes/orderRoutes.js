import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create new order & decrement product sizes stock
// @route   POST /api/orders
router.post('/', async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // 1. Validate stock and prices on server side
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.title}` });
      }

      // Check specific size stock
      const sizeObj = product.sizes.find(s => s.size.toUpperCase() === item.size.toUpperCase());
      if (!sizeObj) {
        return res.status(400).json({ message: `Size ${item.size} not found for product ${product.title}` });
      }

      if (sizeObj.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title} in size ${item.size}. Only ${sizeObj.stock} left.` });
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

    // 2. Decrement inventory
    for (const item of validatedItems) {
      await Product.updateOne(
        { _id: item.product, 'sizes.size': item.size },
        { $inc: { 'sizes.$.stock': -item.quantity } }
      );
    }

    // 3. Generate sequential order number
    const orderCount = await Order.countDocuments({});
    const orderNumber = `FC${1000 + orderCount + 1}`;

    // 4. Determine user (if logged in)
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET;
        const jwt = (await import('jsonwebtoken')).default;
        const decoded = jwt.verify(token, jwtSecret);
        userId = decoded.id;
      } catch (err) {
        // Fallback to guest
      }
    }

    // 5. Create Order
    const order = await Order.create({
      orderNumber,
      user: userId,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'Completed' : 'Pending',
      orderStatus: paymentMethod === 'WhatsAppOrder' ? 'WhatsApp Lead' : 'Processing',
      totalAmount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's order list
// @route   GET /api/orders/my-orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
