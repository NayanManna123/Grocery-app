const { v4: uuidv4 } = require('uuid');
const JsonDatabase = require('../config/db');

const db = new JsonDatabase('carts');

class Cart {
  static getByUserId(userId) {
    let cart = db.findOne({ userId });
    if (!cart) {
      cart = {
        id: uuidv4(),
        userId,
        items: [],
        updatedAt: new Date().toISOString()
      };
      db.create(cart);
    }
    return cart;
  }

  static addItem(userId, productId, quantity = 1) {
    const cart = this.getByUserId(userId);
    const existingIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.updatedAt = new Date().toISOString();
    return db.update(cart.id, { items: cart.items, updatedAt: cart.updatedAt });
  }

  static updateItemQuantity(userId, productId, quantity) {
    const cart = this.getByUserId(userId);
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return null;
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date().toISOString();
    return db.update(cart.id, { items: cart.items, updatedAt: cart.updatedAt });
  }

  static removeItem(userId, productId) {
    const cart = this.getByUserId(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    return db.update(cart.id, { items: cart.items, updatedAt: cart.updatedAt });
  }

  static clear(userId) {
    const cart = this.getByUserId(userId);
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    return db.update(cart.id, { items: [], updatedAt: cart.updatedAt });
  }
}

module.exports = Cart;
