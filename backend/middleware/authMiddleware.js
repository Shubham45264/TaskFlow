const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==========================================
// SECURITY MIDDLEWARE: PROTECTED ROUTES
// ==========================================
/**
 * Verifies JWT pulse and attaches user entity to the request
 */
const protect = async (req, res, next) => {
  let token;

  // Check for presence of Bearer token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token segment
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Populate req.user while excluding sensitive fields
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      res.status(401).json({ message: 'Session expired or unauthorized. Please verify your credentials.' });
    }
  }

  // Gracefully handle missing tokens
  if (!token) {
    res.status(401).json({ message: 'Deployment unauthorized: No access token provided.' });
  }
};

module.exports = { protect };
