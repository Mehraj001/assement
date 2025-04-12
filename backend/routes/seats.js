const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let seats = await Seat.find().sort({ seatNumber: 1 });
    
    // if no seatfound 
    if (seats.length === 0) {
    
      const newSeats = [];
      
      // create row forseat
      let seatNum = 1;
      
    
      for (let row = 1; row <= 11; row++) {
        for (let pos = 1; pos <= 7; pos++) {
          newSeats.push({
            seatNumber: seatNum,
            row: row,
            isBooked: false
          });
          seatNum++;
        }
      }
      
   
      for (let pos = 1; pos <= 3; pos++) {
        newSeats.push({
          seatNumber: seatNum,
          row: 12,
          isBooked: false
        });
        seatNum++;
      }
      
      await Seat.insertMany(newSeats);
      seats = await Seat.find().sort({ seatNumber: 1 });
    }
    
    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/initialize', auth, async (req, res) => {
  try {

    await Seat.deleteMany({});
    

    const seats = [];
    
   
    let seatNum = 1;

    for (let row = 1; row <= 11; row++) {
      for (let pos = 1; pos <= 7; pos++) {
        seats.push({
          seatNumber: seatNum,
          row: row,
          isBooked: false
        });
        seatNum++;
      }
    }
    
    // Last row with 3 seats
    for (let pos = 1; pos <= 3; pos++) {
      seats.push({
        seatNumber: seatNum,
        row: 12,
        isBooked: false
      });
      seatNum++;
    }
    
    await Seat.insertMany(seats);
    
    res.json({ message: 'Seats initialized successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/book', auth, async (req, res) => {
  try {
    const { seats } = req.body;
    
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Please provide seat numbers to book' });
    }
    
    if (seats.length > 7) {
      return res.status(400).json({ message: 'You can book maximum 7 seats at once' });
    }
    
    // Check if seat is availabale
    const seatDocs = await Seat.find({ seatNumber: { $in: seats } });
    
    if (seatDocs.length !== seats.length) {
      return res.status(400).json({ message: 'Some seats are invalid' });
    }
    
    const bookedSeats = seatDocs.filter(seat => seat.isBooked);
    if (bookedSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked', 
        bookedSeats: bookedSeats.map(seat => seat.seatNumber)
      });
    }
    
    // Book the seats
    await Seat.updateMany(
      { seatNumber: { $in: seats } },
      { 
        isBooked: true, 
        bookedBy: req.user._id,
        bookingTime: new Date()
      }
    );
    
    const updatedSeats = await Seat.find({ seatNumber: { $in: seats } });
    
    res.json({ 
      message: 'Seats booked successfully',
      seats: updatedSeats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/reset', auth, async (req, res) => {
  try {
    await Seat.updateMany(
      {},
      { 
        isBooked: false, 
        bookedBy: null,
        bookingTime: null
      }
    );
    
    res.json({ message: 'All seat bookings reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/available/:count', auth, async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    
    if (isNaN(count) || count <= 0 || count > 7) {
      return res.status(400).json({ message: 'Invalid seat count. Must be between 1 and 7.' });
    }
    
    // fatch all seats
    const allSeats = await Seat.find().sort({ seatNumber: 1 });
    
 
    const seatsByRow = {};
    allSeats.forEach(seat => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    });
    
    // Find available consecutive seats in the same row
    const availableGroups = [];
    
    for (const row in seatsByRow) {
      const rowSeats = seatsByRow[row];
      
      for (let i = 0; i <= rowSeats.length - count; i++) {
        const group = rowSeats.slice(i, i + count);
        
        if (group.every(seat => !seat.isBooked)) {
          availableGroups.push(group.map(seat => seat.seatNumber));
        }
      }
    }
    
    // If no consecutive seats in the same row, find nearest available seats
    if (availableGroups.length === 0) {
      const availableSeats = allSeats.filter(seat => !seat.isBooked);
      
      if (availableSeats.length >= count) {
        availableGroups.push(availableSeats.slice(0, count).map(seat => seat.seatNumber));
      }
    }
    
    res.json({ availableGroups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 