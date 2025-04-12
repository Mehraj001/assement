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
PORT=5000
JWT_SECRET=train_ticket_booking_secret_key 
// Middleware here
app.use(
  cors({
    origin: ["https://www.98fastbet.com",], // Replace '*' with the specific origin(s) you want to allow, e.g., 'https://yourdomain.com'
    methods: ['POST', 'GET', 'PUT', 'DELETE'], // Define allowed HTTP methods
    credentials: true, // Allow credentials like cookies to be sent
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://infusionpvtltd:vcLkKLKcKZgez7ur@cluster0.ta8g3.mongodb.net/ticketbooking?retryWrites=true&w=majority&appName=Cluster0`, {
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
