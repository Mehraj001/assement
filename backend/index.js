
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const authRoutes = require('./routes/auth');
const seatRoutes = require('./routes/seats');

const app = express();


const corsOptions = {
  ...config.corsOptions,
  origin: config.corsOrigins
};

// Apply CORSmiddleware here
app.use(cors(corsOptions));


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

mongoose.connect(
  config.mongoUri,
  config.mongoOptions
)
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.locals.config = config;

app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);

app.get('/', (req, res) => {
  res.send('Ticket Booking API is running');
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel serverless functions
module.exports = app;

