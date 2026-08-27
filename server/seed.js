import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const productsData = [
  {
    title: "Enigma Heavyweight Oversized Tee",
    slug: "enigma-heavyweight-oversized-tee",
    description: "Premium drop-shoulder streetwear graphic tee. Engineered with 280 GSM ultra-soft combed cotton. Features the luxury gothic text graphic print at the back and subtle logo detailing at the front chest. Pre-shrunk for the perfect baggy silhouette that holds its structure.",
    category: "Tees",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
    ],
    price: 99,
    mrp: 1499, 
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 20 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 },
      { size: "XXL", stock: 8 }
    ],
    isFeatured: true,
    isTrending: true,
    tags: ["Trending", "New Drop", "Bestseller"],
    rating: 4.9,
    reviewsCount: 142
  },
  {
    title: "Signature Premium Linen Shirt",
    slug: "signature-premium-linen-shirt",
    description: "Tailored from 100% Belgian flax linen. Super lightweight, breathable, and pre-washed for ultimate softness. Features a clean band collar, single chest pocket, and mother-of-pearl buttons. Perfect for hot coastal afternoons or semi-casual evenings.",
    category: "Shirts",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1299,
    mrp: 1999,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 4 }
    ],
    isFeatured: true,
    isTrending: false,
    tags: ["Trending", "Classic"],
    rating: 4.8,
    reviewsCount: 96
  },
  {
    title: "Obsidian Baggy Cargo Jeans",
    slug: "obsidian-baggy-cargo-jeans",
    description: "Relaxed baggy fit crafted from premium 14oz heavy-grade indigo denim. Features utility side-flap cargo pockets, detailed knee-articulation paneling, and custom French Club branded metal rivets. Stone-washed for a vintage slate black finish.",
    category: "Bottoms",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1799,
    mrp: 2699,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 14 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 5 }
    ],
    isFeatured: true,
    isTrending: true,
    tags: ["Trending", "New Drop"],
    rating: 4.7,
    reviewsCount: 88
  },
  {
    title: "Infinite Comfort Cargo Trousers",
    slug: "infinite-comfort-cargo-trousers",
    description: "Street-ready tactical cargo pants made from double-weave stretch cotton twill. Featuring adjustable ankle drawstring locks, high-capacity utility pockets, and reinforced seat lining. Engineered for everyday durability and modern street layouts.",
    category: "Bottoms",
    images: [
      "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1499,
    mrp: 2199,
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 22 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 6 }
    ],
    isFeatured: false,
    isTrending: true,
    tags: ["New Drop", "Bestseller"],
    rating: 4.8,
    reviewsCount: 110
  },
  {
    title: "Midnight Satin Party Shirt",
    slug: "midnight-satin-party-shirt",
    description: "Unleash your luxury aesthetic. Tailored with premium high-sheen satin-silk blend that drapes elegantly over the chest and shoulders. Designed with a sleek wide camp collar, hidden front placket, and deep buttoned cuffs. Destined for club nights.",
    category: "Party Wear",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1399,
    mrp: 1999,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 7 },
      { size: "XXL", stock: 3 }
    ],
    isFeatured: true,
    isTrending: true,
    tags: ["Trending", "Party Exclusive"],
    rating: 4.9,
    reviewsCount: 65
  },
  {
    title: "Nomad Drop-Shoulder Graphic Tee",
    slug: "nomad-drop-shoulder-graphic-tee",
    description: "Heavyweight 240 GSM drop-shoulder tee. Features the unique 'Nomad Explorer' front-chest embroidered graphic with distressed elements. Standard boxy fit engineered for everyday casual versatility.",
    category: "Tees",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80"
    ],
    price: 899,
    mrp: 1299,
    sizes: [
      { size: "S", stock: 18 },
      { size: "M", stock: 25 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 20 },
      { size: "XXL", stock: 10 }
    ],
    isFeatured: false,
    isTrending: true,
    tags: ["New Drop"],
    rating: 4.6,
    reviewsCount: 52
  },
  {
    title: "Bordeaux Jacquard Blazer",
    slug: "bordeaux-jacquard-blazer",
    description: "Premium micro-jacquard knit structure woven in deep wine bordeaux color. Cut in a modern slim silhouette with structured shoulders, notch lapels, and satin inner lining. Elevates your evening attire.",
    category: "Party Wear",
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598808503742-dd34bd0444d9?w=800&auto=format&fit=crop&q=80"
    ],
    price: 3499,
    mrp: 4999,
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 6 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 },
      { size: "XXL", stock: 2 }
    ],
    isFeatured: true,
    isTrending: false,
    tags: ["Bestseller", "Premium Luxury"],
    rating: 4.9,
    reviewsCount: 43
  },
  {
    title: "Off-White Structured Linen Trouser",
    slug: "off-white-structured-linen-trouser",
    description: "Structured straight-fit trousers woven from pure Italian linen-cotton fiber. Designed with an adjustable hidden waistband drawcord, double-welt back pockets, and flat-front creases. Elevates any linen shirt combo.",
    category: "Bottoms",
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1599,
    mrp: 2399,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 12 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 8 },
      { size: "XXL", stock: 3 }
    ],
    isFeatured: false,
    isTrending: false,
    tags: ["New Drop", "Classic"],
    rating: 4.7,
    reviewsCount: 38
  },
  {
    title: "Ghost Grey Distressed Tee",
    slug: "ghost-grey-distressed-tee",
    description: "Heavywashed 260 GSM single jersey cotton. Features custom distressing details around the collar and sleeves, yielding a unique worn-in vintage look. The ideal base layer for any tactical drop.",
    category: "Tees",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"
    ],
    price: 899,
    mrp: 1299,
    sizes: [
      { size: "S", stock: 14 },
      { size: "M", stock: 18 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 14 },
      { size: "XXL", stock: 6 }
    ],
    isFeatured: false,
    isTrending: false,
    tags: ["New Drop"],
    rating: 4.8,
    reviewsCount: 71
  },
  {
    title: "Chambray Utility Indigo Shirt",
    slug: "chambray-utility-indigo-shirt",
    description: "Double-pocket workwear shirt woven from durable lightweight chambray. Finished with standard copper button closures and triple-needle flat-felled seam reinforcements. Built to wear, age, and endure.",
    category: "Shirts",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80"
    ],
    price: 1199,
    mrp: 1799,
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 14 },
      { size: "L", stock: 16 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 4 }
    ],
    isFeatured: false,
    isTrending: true,
    tags: ["Bestseller"],
    rating: 4.8,
    reviewsCount: 115
  }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database for Seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    console.log("Cleaning database collections...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Database cleared.");

    console.log("Creating Admin User...");
    const adminUser = await User.create({
      name: "French Club Admin",
      email: "admin@frenchclub.com",
      password: "admin123",
      role: "admin",
      phone: "+91 76674 47576"
    });
    console.log(`Admin user created: ${adminUser.email}`);

    console.log("Creating Test Customer User...");
    const testUser = await User.create({
      name: "Jagadesh Vran",
      email: "user@gmail.com",
      password: "user123",
      role: "user",
      phone: "+91 98765 43210",
      addresses: [{
        fullName: "Jagadesh Vran",
        phone: "+91 98765 43210",
        addressLine: "12, Main Street, RP Pudur",
        city: "Namakkal",
        state: "Tamil Nadu",
        pincode: "637001",
        isDefault: true
      }]
    });
    console.log(`Customer user created: ${testUser.email}`);

    console.log("Inserting clothing products...");
    const createdProducts = await Product.create(productsData);
    console.log(`Seeded ${createdProducts.length} items successfully.`);

    console.log("Creating initial mock orders...");
    
    // Order 1 (Delivered, Paid)
    await Order.create({
      orderNumber: "FC1001",
      user: testUser._id,
      items: [{
        product: createdProducts[0]._id,
        title: createdProducts[0].title,
        size: "L",
        quantity: 1,
        price: createdProducts[0].price
      }, {
        product: createdProducts[1]._id,
        title: createdProducts[1].title,
        size: "M",
        quantity: 1,
        price: createdProducts[1].price
      }],
      shippingAddress: testUser.addresses[0],
      paymentMethod: "Online",
      paymentStatus: "Completed",
      orderStatus: "Delivered",
      totalAmount: createdProducts[0].price + createdProducts[1].price
    });

    // Order 2 (Processing, Pending COD)
    await Order.create({
      orderNumber: "FC1002",
      user: testUser._id,
      items: [{
        product: createdProducts[2]._id,
        title: createdProducts[2].title,
        size: "M",
        quantity: 1,
        price: createdProducts[2].price
      }],
      shippingAddress: testUser.addresses[0],
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Processing",
      totalAmount: createdProducts[2].price
    });

    // Order 3 (WhatsApp Lead)
    await Order.create({
      orderNumber: "FC1003",
      user: null,
      items: [{
        product: createdProducts[4]._id,
        title: createdProducts[4].title,
        size: "XL",
        quantity: 1,
        price: createdProducts[4].price
      }],
      shippingAddress: {
        fullName: "Karthik Raja",
        phone: "+91 76674 11111",
        addressLine: "45, Salem Road",
        city: "Namakkal",
        state: "Tamil Nadu",
        pincode: "637001"
      },
      paymentMethod: "WhatsAppOrder",
      paymentStatus: "Pending",
      orderStatus: "WhatsApp Lead",
      totalAmount: createdProducts[4].price
    });

    console.log("Mock orders created successfully.");
    console.log("Database Seeding Completed Successfully! Exiting...");
    process.exit(0);
  } catch (error) {
    console.error("Database Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
