const jwt = require('jsonwebtoken');
const User2 = require('../models/User');

// Get JWT secret with fallback for Vercel environment
const getJwtSecret = (req) => {
  if (req.app.locals.config && req.app.locals.config.jwtSecret) {
    return req.app.locals.config.jwtSecret;
  }
  return process.env.JWT_SECRET || 'train_ticket_booking_secret_key';
};

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Get JWT secret with fallback
    const jwtSecret = getJwtSecret(req);
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    const user = await User2.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Authentication required' });
  }
};

module.exports = auth; 
