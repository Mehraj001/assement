const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User2 = require('../models/User');
const auth = require('../middleware/auth');


const getConfig = (req) => {

  if (!req.app.locals.config) {
    return {
      jwtSecret: process.env.JWT_SECRET || 'train_ticket_booking_secret_key',
      jwtOptions: { expiresIn: '1d' }
    };
  }
  return req.app.locals.config;
};

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let user = await User2.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User2({
      username,
      email,
      password
    });
    
    await user.save();
    
   
    const config = getConfig(req);
    
   
    const token = jwt.sign(
      { id: user._id }, 
      config.jwtSecret,
      config.jwtOptions
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user
    const user = await User2.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Get config with fallback
    const config = getConfig(req);
    
    // Create and sign a JWT
    const token = jwt.sign(
      { id: user._id }, 
      config.jwtSecret,
      config.jwtOptions
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User2.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
