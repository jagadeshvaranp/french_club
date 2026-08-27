import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingCharge,
    totalAmount,
    freeShippingProgress,
    amountNeededForFreeShipping,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    generateWhatsAppLink
  } = useCart();

  const { user } = useAuth();

  const [step, setStep] = useState('cart');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0] || {};
  const [address, setAddress] = useState({
    fullName: defaultAddress.fullName || user?.name || '',
    phone: defaultAddress.phone || user?.phone || '',
    addressLine: defaultAddress.addressLine || '',
    city: defaultAddress.city || 'Namakkal',
    state: defaultAddress.state || 'Tamil Nadu',
    pincode: defaultAddress.pincode || '637001'
  });

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
    }
  };

  const handlePlaceOrder = async (paymentMethod) => {
    if (!address.fullName || !address.phone || !address.addressLine || !address.pincode) {
      alert('Please fill out all shipping details.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.product,
          title: item.title,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: address,
        paymentMethod
      };

      const { data } = await api.post('/api/orders', orderPayload);
      setCreatedOrder(data);
      clearCart();
      setStep('success');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    if (!address.fullName || !address.phone || !address.addressLine || !address.pincode) {
      alert('Please fill out your delivery address so we can format your WhatsApp order.');
      return;
    }

    const link = generateWhatsAppLink(address);
    window.open(link, '_blank');
    handlePlaceOrder('WhatsAppOrder');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-screen max-w-md bg-primary border-l border-white/10 flex flex-col shadow-2xl text-platinum h-full"
          >
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-surface">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h2 className="text-base font-bold tracking-wider uppercase font-display">
                  {step === 'cart' ? 'Your Bag' : step === 'checkout' ? 'Checkout Details' : 'Order Placed'}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:text-accent transition-colors cursor-pointer text-slate-gray"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 'cart' && (
              <>
                {cartItems.length > 0 && (
                  <div className="px-5 py-3.5 bg-surface/50 border-b border-white/5 text-xs">
                    {freeShippingProgress < 100 ? (
                      <p className="text-slate-gray mb-2">
                        Add <span className="text-accent font-bold">₹{amountNeededForFreeShipping}</span> more for <span className="text-platinum font-bold">FREE DELIVERY</span>
                      </p>
                    ) : (
                      <p className="text-accent font-bold mb-2">🎉 You have unlocked FREE DELIVERY!</p>
                    )}
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-accent h-full transition-all duration-300"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-gray py-20">
                      <ShoppingBag className="w-12 h-12 mb-4 text-white/10" />
                      <p className="text-base font-semibold text-platinum mb-1">Your bag is empty</p>
                      <p className="text-sm px-6">Explore the collections and add items to get started.</p>
                      <button 
                        onClick={onClose} 
                        className="mt-6 px-6 py-2 border border-white/20 hover:border-accent hover:text-accent rounded-full text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div 
                        key={`${item.product}-${item.size}`} 
                        className="flex gap-4 p-3 bg-surface rounded-xl border border-white/5"
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-16 h-20 object-cover rounded bg-primary"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-semibold text-platinum line-clamp-1 pr-2">
                                {item.title}
                              </h4>
                              <button 
                                onClick={() => removeFromCart(item.product, item.size)}
                                className="text-slate-gray hover:text-accent p-0.5 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-gray mt-0.5">Size: <span className="text-platinum font-bold uppercase">{item.size}</span></p>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="flex items-center border border-white/10 rounded overflow-hidden bg-primary">
                              <button 
                                onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)}
                                className="p-1 px-2 hover:bg-white/5 text-slate-gray hover:text-platinum cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs px-2 font-bold select-none">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)}
                                className="p-1 px-2 hover:bg-white/5 text-slate-gray hover:text-platinum cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-platinum">₹{item.price * item.quantity}</span>
                              {item.mrp > item.price && (
                                <div className="text-[10px] text-slate-gray line-through">
                                  ₹{item.mrp * item.quantity}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="p-5 border-t border-white/10 bg-surface space-y-4">
                    {coupon ? (
                      <div className="flex justify-between items-center bg-accent/10 border border-accent/20 rounded-lg p-2 px-3 text-xs text-accent">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Tag className="w-3.5 h-3.5" /> {coupon.code} (-{coupon.discountPercent}%)
                        </span>
                        <button onClick={removeCoupon} className="font-extrabold hover:text-accent-hover cursor-pointer">REMOVE</button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input 
                          type="text" 
                          value={couponCode} 
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Apply Coupon (e.g. DROP30)" 
                          className="flex-1 bg-primary border border-white/10 rounded-lg px-3 py-1.5 text-xs text-platinum placeholder-slate-gray outline-none focus:border-accent"
                        />
                        <button 
                          type="submit" 
                          className="bg-white/5 hover:bg-accent hover:text-primary border border-white/15 hover:border-accent text-xs font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer text-slate-gray"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {couponError && <p className="text-[10px] text-red-400 font-semibold">{couponError}</p>}

                    <div className="space-y-1.5 text-xs text-slate-gray">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-platinum">₹{subtotal}</span>
                      </div>
                      {coupon && (
                        <div className="flex justify-between text-accent font-semibold">
                          <span>Discount Applied</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span className="text-platinum">
                          {shippingCharge > 0 ? `₹${shippingCharge}` : 'FREE'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-platinum pt-2 border-t border-white/5">
                        <span>Total Amount</span>
                        <span className="text-accent">₹{totalAmount}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button 
                        onClick={() => setStep('checkout')}
                        className="w-full bg-platinum hover:bg-accent text-primary font-bold py-3 rounded-lg text-xs tracking-wider flex items-center justify-center gap-2 transition-all uppercase cursor-pointer"
                      >
                        PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 'checkout' && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <button 
                    onClick={() => setStep('cart')}
                    className="flex items-center gap-1.5 text-xs text-slate-gray hover:text-accent font-semibold transition-colors cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> BACK TO BAG
                  </button>

                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2 font-display">Delivery Address</h3>
                  
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Full Name</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={address.fullName} 
                        onChange={handleAddressChange}
                        placeholder="John Doe"
                        className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-platinum placeholder-slate-gray outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        name="phone"
                        value={address.phone} 
                        onChange={handleAddressChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-platinum placeholder-slate-gray outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Street Address</label>
                      <textarea 
                        name="addressLine"
                        value={address.addressLine} 
                        onChange={handleAddressChange}
                        placeholder="49, Salem Road, RP Pudur"
                        rows="2"
                        className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-platinum placeholder-slate-gray outline-none focus:border-accent resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">City</label>
                        <input 
                          type="text" 
                          name="city"
                          value={address.city} 
                          onChange={handleAddressChange}
                          className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-platinum outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Pincode</label>
                        <input 
                          type="text" 
                          name="pincode"
                          value={address.pincode} 
                          onChange={handleAddressChange}
                          placeholder="637001"
                          className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-platinum outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl border border-white/5 bg-surface/50 text-[10px] text-slate-gray space-y-2">
                    <p className="font-bold text-accent">🏪 Direct Store Dispatch</p>
                    <p>All online orders are processed and shipped directly from our physical store in Namakkal, Tamil Nadu.</p>
                  </div>
                </div>

                <div className="p-5 border-t border-white/10 bg-surface space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-gray mb-2">
                    <span>Final Amount ({cartItems.reduce((s,i) => s + i.quantity, 0)} items)</span>
                    <span className="text-sm font-bold text-accent">₹{totalAmount}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={handleWhatsAppCheckout}
                      disabled={loading}
                      className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-3 rounded-lg text-xs tracking-wider flex items-center justify-center gap-2 uppercase transition-all shadow-lg cursor-pointer"
                    >
                      ORDER VIA WHATSAPP
                    </button>

                    <button 
                      onClick={() => handlePlaceOrder('COD')}
                      disabled={loading}
                      className="w-full border border-white/20 hover:border-accent hover:text-accent font-bold py-3 rounded-lg text-xs tracking-wider flex items-center justify-center gap-2 uppercase transition-all cursor-pointer"
                    >
                      {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'PLACE COD ORDER'}
                    </button>

                    <button 
                      onClick={() => handlePlaceOrder('Online')}
                      disabled={loading}
                      className="w-full bg-platinum hover:bg-white text-primary font-bold py-3 rounded-lg text-xs tracking-wider flex items-center justify-center gap-2 uppercase transition-all cursor-pointer"
                    >
                      {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'PAY ONLINE (SIMULATED)'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle className="w-16 h-16 text-accent" />
                </motion.div>

                <div>
                  <h3 className="text-lg font-bold tracking-wider uppercase mb-2 font-display">Order Successful!</h3>
                  <p className="text-sm text-slate-gray px-4">
                    Your order <span className="text-platinum font-bold">#{createdOrder?.orderNumber}</span> has been logged.
                  </p>
                  {createdOrder?.paymentMethod === 'WhatsAppOrder' && (
                    <p className="text-xs text-accent mt-2 font-bold px-4">
                      Please continue on WhatsApp to coordinate your shipment.
                    </p>
                  )}
                </div>

                <div className="w-full max-w-[280px] p-4 bg-surface rounded-xl border border-white/5 text-left text-xs space-y-2 text-slate-gray">
                  <div className="flex justify-between">
                    <span>Order No:</span>
                    <span className="text-platinum font-bold">#{createdOrder?.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping To:</span>
                    <span className="text-platinum truncate max-w-[150px]">{createdOrder?.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="text-accent font-bold">₹{createdOrder?.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="text-platinum font-bold uppercase">{createdOrder?.paymentMethod}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    setStep('cart');
                  }}
                  className="px-6 py-2 bg-platinum hover:bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CartDrawer;
