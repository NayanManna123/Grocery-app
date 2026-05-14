const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// All cart routes require authentication
router.use(auth);

// GET /api/cart — get user's cart with product details
router.get('/', (req, res) => {
  try {
    const cart = Cart.getByUserId(req.user.id);

    // Populate product details
    const populatedItems = cart.items.map(item => {
      const product = Product.findById(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: product || { name: 'Product not found', price: 0 }
      };
    }).filter(item => item.product.name !== 'Product not found');

    const total = populatedItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 0
    );

    res.json({
      items: populatedItems,
      itemCount: populatedItems.reduce((sum, item) => sum + item.quantity, 0),
      total: Math.round(total * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart — add item to cart
router.post('/', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    Cart.addItem(req.user.id, productId, quantity);
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// PUT /api/cart/:productId — update item quantity
router.put('/:productId', (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const result = Cart.updateItemQuantity(req.user.id, req.params.productId, quantity);
    if (!result) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:productId — remove item from cart
router.delete('/:productId', (req, res) => {
  try {
    Cart.removeItem(req.user.id, req.params.productId);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// DELETE /api/cart — clear entire cart
router.delete('/', (req, res) => {
  try {
    Cart.clear(req.user.id);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
