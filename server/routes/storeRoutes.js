import express from 'express';

const router = express.Router();

// @desc    Get store info and alerts
// @route   GET /api/store/info
router.get('/info', (req, res) => {
  res.json({
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
  });
});

export default router;
