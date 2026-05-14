const { v4: uuidv4 } = require('uuid');
const JsonDatabase = require('../config/db');

const db = new JsonDatabase('products');

class Product {
  static findAll(filter = {}) {
    return db.findAll(filter);
  }

  static findById(id) {
    return db.findById(id);
  }

  static create(productData) {
    const product = {
      id: uuidv4(),
      name: productData.name,
      description: productData.description || '',
      price: productData.price,
      category: productData.category,
      unit: productData.unit || 'piece',
      stock: productData.stock || 0,
      image: productData.image || '',
      featured: productData.featured || false,
      createdAt: new Date().toISOString()
    };
    return db.create(product);
  }

  static update(id, updates) {
    return db.update(id, updates);
  }

  static search(query, category) {
    let results = db.findAll();

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    return results;
  }

  static getCategories() {
    const products = db.findAll();
    return [...new Set(products.map(p => p.category))].sort();
  }
}

module.exports = Product;
