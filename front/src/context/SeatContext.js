import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllSeats, bookSeats, resetSeats, initializeSeats } from '../utils/api';
import { useAuth } from './AuthContext';

const SeatContext = createContext();

export const useSeat = () => useContext(SeatContext);

export const SeatProvider = ({ children }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchSeats();
    }
  }, [currentUser]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const seatsData = await getAllSeats();
      
     
      if (!seatsData || seatsData.length === 0) {
        await handleInitializeSeats();
      } else {
        setSeats(seatsData);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setError(error.message || 'Failed to load seats data');
      
    
      try {
        await handleInitializeSeats();
      } catch (initError) {
        console.error('Error initializing seats:', initError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 7) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        setError('You can select maximum 7 seats at a time');
      }
    }
  };

  
  const findBestAvailableSeats = (count) => {
    if (count <= 0 || count > 7) {
      return [];
    }

    // Group seats by row
    const seatsByRow = {};
    seats.forEach(seat => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    });

    // Sort rows by number
    const sortedRows = Object.keys(seatsByRow).sort((a, b) => Number(a) - Number(b));

    
    for (const row of sortedRows) {
      const rowSeats = seatsByRow[row].sort((a, b) => a.seatNumber - b.seatNumber);
      const availableSeats = rowSeats.filter(seat => !seat.isBooked);

      if (availableSeats.length >= count) {
        // Check for consecutive available seats
        for (let i = 0; i <= availableSeats.length - count; i++) {
          const consecutive = availableSeats.slice(i, i + count);
          
      
          let isConsecutive = true;
          for (let j = 1; j < consecutive.length; j++) {
            if (consecutive[j].seatNumber !== consecutive[j-1].seatNumber + 1) {
              isConsecutive = false;
              break;
            }
          }
          
          if (isConsecutive) {
            return consecutive.map(seat => seat.seatNumber);
          }
        }
 
        return availableSeats.slice(0, count).map(seat => seat.seatNumber);
      }
    }


    const allAvailableSeats = seats
      .filter(seat => !seat.isBooked)
      .sort((a, b) => a.seatNumber - b.seatNumber);

    if (allAvailableSeats.length >= count) {
      return allAvailableSeats.slice(0, count).map(seat => seat.seatNumber);
    }

    return [];
  };

  const handleBookSeats = async (seatNumbers = null) => {
    try {
      setBooking(true);
      setError(null);
      
      let seatsToBook = seatNumbers || selectedSeats;
      
      if (seatsToBook.length === 0) {
        setError('Please select seats to book');
        return;
      }
      
      await bookSeats(seatsToBook);
      setBookingSuccess(true);
      setSelectedSeats([]);
      await fetchSeats();
    } catch (error) {
      setError(error.message || 'Failed to book seats');
      setBookingSuccess(false);
    } finally {
      setBooking(false);
    }
  };

  const handleAutoBookSeats = async (count) => {
    try {
      if (!count || isNaN(parseInt(count)) || parseInt(count) <= 0) {
        setError('Please enter a valid number of seats to book');
        return;
      }
      
      const seatCount = parseInt(count);
      
      if (seatCount > 7) {
        setError('You can book maximum 7 seats at a time');
        return;
      }
      
      // Find best available seats
      const bestSeats = findBestAvailableSeats(seatCount);
      
      if (bestSeats.length === 0) {
        setError(`Not enough available seats to book ${seatCount} seats`);
        return;
      }
      
      // Book the seats
      await handleBookSeats(bestSeats);
      
    } catch (error) {
      console.error('Auto-booking error:', error);
      setError(error.message || 'Failed to auto-book seats');
    }
  };

  const handleResetBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      await resetSeats();
      await fetchSeats();
      setSelectedSeats([]);
    } catch (error) {
      setError(error.message || 'Failed to reset booking');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      await initializeSeats();
      await fetchSeats();
    } catch (error) {
      setError(error.message || 'Failed to initialize seats');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    seats,
    loading,
    error,
    selectedSeats,
    booking,
    bookingSuccess,
    handleSeatSelection,
    handleBookSeats,
    handleAutoBookSeats,
    handleResetBooking,
    handleInitializeSeats,
    fetchSeats,
    setError,
    setBookingSuccess,
  };

  return <SeatContext.Provider value={value}>{children}</SeatContext.Provider>;
}; 