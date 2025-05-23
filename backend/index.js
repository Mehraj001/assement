const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const authRoutes = require('./routes/auth');
const seatRoutes = require('./routes/seats');

const app = express();

// Set CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const corsOptions = {
  ...config.corsOptions,
  origin: config.corsOrigins
};

// Apply CORS middleware here
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin;

  if (config.corsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.sendStatus(200);
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  config.mongoUri,
  config.mongoOptions
)
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Make config available to routes
app.locals.config = config;

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Ticket Booking API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel serverless functions
module.exports = app;
