const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided. Access denied.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found. Token invalid.' });
    }

    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
};

module.exports = auth;
