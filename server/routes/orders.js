const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// All order routes require authentication
router.use(auth);

// POST /api/orders — place a new order from cart
router.post('/', (req, res) => {
  try {
    const { address, paymentMethod } = req.body;
    const cart = Cart.getByUserId(req.user.id);

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Build order items with product details and compute total
    const orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      const product = Product.findById(item.productId);
      if (!product) continue;

      orderItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        unit: product.unit
      });

      total += product.price * item.quantity;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ error: 'No valid products in cart' });
    }

    const order = Order.create({
      userId: req.user.id,
      items: orderItems,
      total: Math.round(total * 100) / 100,
      address: address || { street: '', city: '', zip: '' },
      paymentMethod: paymentMethod || 'cash'
    });

    // Clear cart after order
    Cart.clear(req.user.id);

    res.status(201).json({ order, message: 'Order placed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders — get user's order history
router.get('/', (req, res) => {
  try {
    const orders = Order.findByUserId(req.user.id);
    res.json({ orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id — get single order
router.get('/:id', (req, res) => {
  try {
    const order = Order.findById(req.params.id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
