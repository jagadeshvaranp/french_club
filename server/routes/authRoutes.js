import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Set first user or emails with 'admin' as admin
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = (isFirstUser || email.toLowerCase().includes('admin')) ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('wishlist');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/:id
router.post('/wishlist/:id', protect, async (req, res) => {
  const productId = req.params.id;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } else {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
