const { v4: uuidv4 } = require('uuid');
const JsonDatabase = require('../config/db');

const db = new JsonDatabase('orders');

class Order {
  static create(orderData) {
    const order = {
      id: uuidv4(),
      userId: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      status: 'confirmed',
      address: orderData.address || {},
      paymentMethod: orderData.paymentMethod || 'cash',
      createdAt: new Date().toISOString()
    };
    return db.create(order);
  }

  static findByUserId(userId) {
    const orders = db.findAll({ userId });
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static findById(id) {
    return db.findById(id);
  }

  static updateStatus(id, status) {
    return db.update(id, { status });
  }
}

module.exports = Order;
