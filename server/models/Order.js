import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Nullable for guest checkout or WhatsApp order leads
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online', 'WhatsAppOrder'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'WhatsApp Lead'],
    default: 'Processing'
  },
  totalAmount: { type: Number, required: true },
  trackingNumber: { type: String, default: '' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
