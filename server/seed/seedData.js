const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Product = require('../models/Product');

const products = [
  // 🥬 Fruits & Vegetables
  { name: 'Organic Bananas', description: 'Sweet and perfectly ripe organic bananas, hand-picked from sustainable farms.', price: 49, category: 'Fruits & Vegetables', unit: 'bunch', stock: 150, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', featured: true },
  { name: 'Fresh Strawberries', description: 'Juicy, vine-ripened strawberries bursting with flavor. Perfect for smoothies and desserts.', price: 199, category: 'Fruits & Vegetables', unit: 'pack', stock: 80, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', featured: true },
  { name: 'Avocado (Hass)', description: 'Creamy Hass avocados, perfect for guacamole, salads, and toast.', price: 99, category: 'Fruits & Vegetables', unit: 'piece', stock: 200, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400', featured: true },
  { name: 'Baby Spinach', description: 'Tender, pre-washed baby spinach leaves. Great for salads and smoothies.', price: 60, category: 'Fruits & Vegetables', unit: '200g', stock: 100, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
  { name: 'Roma Tomatoes', description: 'Firm, flavorful Roma tomatoes ideal for sauces, salads, and cooking.', price: 40, category: 'Fruits & Vegetables', unit: 'kg', stock: 120, image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400' },
  { name: 'Fresh Blueberries', description: 'Plump, antioxidant-rich blueberries. Perfect for baking and snacking.', price: 349, category: 'Fruits & Vegetables', unit: 'pack', stock: 60, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400' },
  { name: 'Red Bell Peppers', description: 'Crisp, sweet red bell peppers packed with vitamin C.', price: 35, category: 'Fruits & Vegetables', unit: 'piece', stock: 90, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400' },
  { name: 'Green Apples', description: 'Tart and crispy Granny Smith apples, great for pies and snacking.', price: 199, category: 'Fruits & Vegetables', unit: 'kg', stock: 110, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },

  // 🥛 Dairy & Eggs
  { name: 'Whole Milk (Organic)', description: 'Fresh organic whole milk from grass-fed cows. Nutritious and creamy.', price: 80, category: 'Dairy & Eggs', unit: 'litre', stock: 60, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', featured: true },
  { name: 'Free-Range Eggs', description: 'Farm-fresh free-range eggs from pasture-raised hens. Dozen per pack.', price: 120, category: 'Dairy & Eggs', unit: 'dozen', stock: 80, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400' },
  { name: 'Greek Yogurt', description: 'Thick, creamy Greek yogurt with live cultures. High in protein.', price: 149, category: 'Dairy & Eggs', unit: '500g', stock: 70, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
  { name: 'Sharp Cheddar Cheese', description: 'Aged sharp cheddar cheese with a bold, rich flavor. Perfect for sandwiches.', price: 349, category: 'Dairy & Eggs', unit: 'block', stock: 50, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400' },
  { name: 'Butter (Unsalted)', description: 'Premium unsalted butter made from fresh cream. Ideal for baking.', price: 249, category: 'Dairy & Eggs', unit: '250g', stock: 90, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc0d?w=400' },

  // 🥩 Meat & Seafood
  { name: 'Chicken Breast', description: 'Boneless, skinless chicken breasts. Lean, versatile protein source.', price: 350, category: 'Meat & Seafood', unit: 'kg', stock: 40, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', featured: true },
  { name: 'Atlantic Salmon', description: 'Fresh Atlantic salmon fillets, rich in omega-3 fatty acids.', price: 1099, category: 'Meat & Seafood', unit: 'kg', stock: 30, image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400' },
  { name: 'Jumbo Shrimp', description: 'Wild-caught jumbo shrimp, peeled and deveined. Ready to cook.', price: 899, category: 'Meat & Seafood', unit: 'kg', stock: 25, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400' },

  // 🍞 Bakery
  { name: 'Sourdough Bread', description: 'Artisan sourdough bread with a crispy crust and tangy flavor.', price: 199, category: 'Bakery', unit: 'loaf', stock: 40, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400', featured: true },
  { name: 'Croissants', description: 'Flaky, buttery French croissants baked fresh daily. Pack of 4.', price: 249, category: 'Bakery', unit: 'pack', stock: 35, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400' },
  { name: 'Whole Wheat Bread', description: 'Nutritious whole wheat bread with a soft texture and nutty flavor.', price: 55, category: 'Bakery', unit: 'loaf', stock: 55, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { name: 'Chocolate Muffins', description: 'Rich, moist chocolate muffins with chocolate chips. Pack of 6.', price: 299, category: 'Bakery', unit: 'pack', stock: 30, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400' },

  // 🥫 Pantry
  { name: 'Extra Virgin Olive Oil', description: 'Cold-pressed extra virgin olive oil from Mediterranean olives.', price: 699, category: 'Pantry', unit: '500ml', stock: 70, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { name: 'Basmati Rice', description: 'Aged premium basmati rice with long grains and aromatic flavor.', price: 199, category: 'Pantry', unit: 'kg', stock: 100, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  { name: 'Organic Pasta', description: 'Italian organic penne pasta made from durum wheat semolina.', price: 179, category: 'Pantry', unit: '500g', stock: 90, image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400' },
  { name: 'Canned Tomatoes', description: 'Italian San Marzano style whole peeled tomatoes.', price: 149, category: 'Pantry', unit: 'can', stock: 120, image: 'https://images.unsplash.com/photo-1597235243623-d9b600c800ff?w=400' },
  { name: 'Raw Honey', description: 'Pure, unfiltered raw honey from wildflower blossoms.', price: 449, category: 'Pantry', unit: '500g', stock: 45, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400' },

  // 🥤 Beverages
  { name: 'Orange Juice (Fresh)', description: 'Freshly squeezed orange juice, not from concentrate. No added sugar.', price: 149, category: 'Beverages', unit: '1L', stock: 50, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { name: 'Sparkling Water', description: 'Naturally sparkling mineral water. Pack of 6 bottles.', price: 299, category: 'Beverages', unit: '6-pack', stock: 80, image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400' },
  { name: 'Green Tea (Matcha)', description: 'Premium Japanese matcha green tea powder, ceremonial grade.', price: 799, category: 'Beverages', unit: '100g', stock: 35, image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400' },
  { name: 'Cold Brew Coffee', description: 'Smooth, rich cold brew concentrate. Makes 8 cups.', price: 499, category: 'Beverages', unit: 'bottle', stock: 40, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },

  // 🍿 Snacks
  { name: 'Mixed Nuts (Roasted)', description: 'Premium roasted mixed nuts: almonds, cashews, pecans, and walnuts.', price: 599, category: 'Snacks', unit: '350g', stock: 65, image: 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400' },
  { name: 'Dark Chocolate Bar', description: '72% cacao dark chocolate with smooth, intense flavor.', price: 199, category: 'Snacks', unit: '100g', stock: 80, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400' },
  { name: 'Organic Granola', description: 'Crunchy organic granola with oats, honey, and dried fruits.', price: 349, category: 'Snacks', unit: '400g', stock: 55, image: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=400' },
  { name: 'Trail Mix', description: 'Energy-boosting trail mix with nuts, seeds, and dried cranberries.', price: 299, category: 'Snacks', unit: '300g', stock: 70, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400' }
];

async function seed() {
  console.log('🌱 Seeding database with sample products...\n');

  // Clear existing products
  const JsonDatabase = require('../config/db');
  const db = new JsonDatabase('products');
  db._write([]);

  for (const productData of products) {
    const product = Product.create(productData);
    console.log(`  ✅ ${product.name} — ₹${product.price}/${product.unit}`);
  }

  console.log(`\n🎉 Seeded ${products.length} products across ${[...new Set(products.map(p => p.category))].length} categories!`);
  console.log('   Categories:', [...new Set(products.map(p => p.category))].join(', '));
}

seed().catch(console.error);
