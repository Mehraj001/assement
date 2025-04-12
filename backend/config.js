require('dotenv').config();

// Centralized configuration
const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://infusionpvtltd:vcLkKLKcKZgez7ur@cluster0.ta8g3.mongodb.net/ticketbooking?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'train_ticket_booking_secret_key',
  corsOrigins: ['https://assement-front.vercel.app', 'http://localhost:3000'],
  corsOptions: {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  },
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  jwtOptions: {
    expiresIn: '1d'
  }
};

module.exports = config; 
