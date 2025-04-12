
const jwt = require('jsonwebtoken');
const User2 = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Use JWT secret from app.locals.config
    const decoded = jwt.verify(token, req.app.locals.config.jwtSecret);
    
    const user = await User2.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

module.exports = auth; 

