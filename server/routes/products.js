const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products — list all, with optional search & category filter
router.get('/', (req, res) => {
  try {
    const { search, category } = req.query;
    const products = Product.search(search, category);
    res.json({ products, total: products.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/categories — get all categories
router.get('/categories', (req, res) => {
  try {
    const categories = Product.getCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/products/:id — get single product
router.get('/:id', (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
