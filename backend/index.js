const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const seatRoutes = require('./routes/seats');

const app = express();

// ✅ Define variables directly
const PORT = 5000;
const JWT_SECRET = 'train_ticket_booking_secret_key';

// ✅ Middleware
app.use(cors({
  origin: 'https://assement-front.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://infusionpvtltd:vcLkKLKcKZgez7ur@cluster0.ta8g3.mongodb.net/ticketbooking?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Ticket Booking API is running');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
