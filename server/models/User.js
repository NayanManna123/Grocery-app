const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JsonDatabase = require('../config/db');

const db = new JsonDatabase('users');

class User {
  static findById(id) {
    const user = db.findById(id);
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  static findByEmail(email) {
    return db.findOne({ email: email.toLowerCase() });
  }

  static async create(userData) {
    const existing = this.findByEmail(userData.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    db.create(user);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async authenticate(email, password) {
    const user = this.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

module.exports = User;
