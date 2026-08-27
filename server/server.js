import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import storeRoutes from './routes/storeRoutes.js';

// Load environmental variables
dotenv.config();

// Initialize MongoDB
connectDB();

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/store', storeRoutes);

// General check route
app.get('/', (req, res) => {
  res.json({ message: 'French Club E-Commerce API is running...' });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
