const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verifyoken of user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
  
    const user = await User.findById(decoded.id);
    
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