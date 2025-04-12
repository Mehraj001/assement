const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');               
const dotenv = require('dotenv');


dotenv.config();

// Import Routes
const authRoutes = require('./routes/auth');
const seatRoutes = require('./routes/seats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware here
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);

app.get('/', (req, res) => {
  res.send('Ticket Booking API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 