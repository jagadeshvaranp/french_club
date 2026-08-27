import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

const FREE_SHIPPING_THRESHOLD = 2999;
const SHIPPING_FEE = 150;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product, size, quantity = 1) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product === product._id && item.size === size
    );

    let updatedCart = [...cartItems];

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        product: product._id,
        title: product.title,
        image: product.images[0],
        price: product.price,
        mrp: product.mrp,
        size: size,
        quantity: quantity
      });
    }

    saveCart(updatedCart);
  };

  const removeFromCart = (productId, size) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.product === productId && item.size === size)
    );
    saveCart(updatedCart);
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.product === productId && item.size === size
        ? { ...item, quantity }
        : item
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const uppercaseCode = code.trim().toUpperCase();
    if (uppercaseCode === 'FRENCHCLUB10') {
      setCoupon({ code: 'FRENCHCLUB10', discountPercent: 10 });
      setCouponError('');
      return true;
    } else if (uppercaseCode === 'DROP30') {
      setCoupon({ code: 'DROP30', discountPercent: 30 });
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try FRENCHCLUB10 or DROP30.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  const totalAfterDiscount = subtotal - discountAmount;
  
  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const totalAmount = totalAfterDiscount + shippingCharge;

  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountNeededForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const generateWhatsAppLink = (shippingAddress) => {
    const storeNumber = '917667447576';
    let text = `Hi French Club! 🔥\n\nI want to place an order:\n`;
    
    cartItems.forEach((item, index) => {
      text += `${index + 1}. ${item.title} (Size: ${item.size}, Qty: ${item.quantity}) - ₹${item.price}\n`;
    });

    text += `\nSubtotal: ₹${subtotal}`;
    if (coupon) {
      text += `\nCoupon: ${coupon.code} (-${coupon.discountPercent}%)`;
      text += `\nDiscount: -₹${discountAmount}`;
    }
    if (shippingCharge > 0) {
      text += `\nDelivery Charge: ₹${shippingCharge}`;
    } else {
      text += `\nDelivery Charge: FREE`;
    }
    text += `\nTotal Amount: ₹${totalAmount}\n`;

    if (shippingAddress) {
      text += `\n📍 Delivery Address:`;
      text += `\nName: ${shippingAddress.fullName}`;
      text += `\nPhone: ${shippingAddress.phone}`;
      text += `\nAddress: ${shippingAddress.addressLine}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`;
    }

    return `https://wa.me/${storeNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
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
      generateWhatsAppLink,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
