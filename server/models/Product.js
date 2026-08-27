import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g. "Shirts", "Tees", "Bottoms", "Party Wear"
  subCategory: { type: String, default: '' },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  sizes: [{
    size: { type: String, required: true }, // S, M, L, XL, XXL, etc.
    stock: { type: Number, default: 0 }
  }],
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  tags: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 24 },
  ratingsSummary: {
    average: { type: Number, default: 4.8 },
    count: { type: Number, default: 24 }
  }
}, { timestamps: true });

// Auto-calculate discount percentage before saving
productSchema.pre('save', function(next) {
  if (this.mrp && this.price && this.mrp > this.price) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  } else {
    this.discount = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
