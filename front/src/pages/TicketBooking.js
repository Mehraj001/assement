import React, { useState, useEffect } from 'react';
import { useSeat } from '../context/SeatContext';

const TicketBooking = () => {
  const {
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
    fetchSeats,
    setError,
    setBookingSuccess
  } = useSeat();

  const [seatCount, setSeatCount] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Clear success message after 3 seconds
  useEffect(() => {
    if (bookingSuccess) {
      setShowSuccessMessage(true);
      setSuccessMessage('Seat successfully booked');
      
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setBookingSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess, setBookingSuccess]);

  // Clear error message after 3 seconds
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      
      const timer = setTimeout(() => {
        setError(null);
        setErrorMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const handleBookClick = async () => {
    if (selectedSeats.length === 0) {
      // If no seats are manually selected, use automatic booking
      if (!seatCount || isNaN(parseInt(seatCount)) || parseInt(seatCount) <= 0) {
        setError('Please enter a valid number of seats to book');
        return;
      }
      
      try {
        await handleAutoBookSeats(parseInt(seatCount));
      } catch (error) {
        console.error(error);
      }
    } else {
      // Book manually selected seats
      try {
        await handleBookSeats();
      } catch (error) {
        console.error(error);
      }
    }
    
    setSeatCount('');
  };

  const getAvailableSeatsCount = () => {
    return seats.filter(seat => !seat.isBooked).length;
  };
  
  const getBookedSeatsCount = () => {
    return seats.filter(seat => seat.isBooked).length;
  };

  return (
    <div className="ticket-booking">
      <h2 className="booking-title">Ticket Booking</h2>
      
      <div className="booking-layout">
        <div className="left-section">
          {loading ? (
            <div className="loading">Loading seats...</div>
          ) : seats.length === 0 ? (
            <div className="no-seats">
              <p>No seats found. Please wait while we initialize seats...</p>
            </div>
          ) : (
            <>
              <div className="seat-grid">
                {Object.keys(seatsByRow).map(row => (
                  <div key={row} className="seat-row">
                    {seatsByRow[row].map(seat => (
                      <div
                        key={seat.seatNumber}
                        className={`seat ${seat.isBooked ? 'booked' : ''} ${
                          selectedSeats.includes(seat.seatNumber) ? 'selected' : ''
                        }`}
                        onClick={() => {
                          if (!seat.isBooked) {
                            handleSeatSelection(seat.seatNumber);
                          }
                        }}
                      >
                        {seat.seatNumber}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="seat-counters">
                <div className="counter booked-counter">
                  <strong>Booked Seats = {getBookedSeatsCount()}</strong>
                </div>
                <div className="counter available-counter">
                  <strong>Available Seats = {getAvailableSeatsCount()}</strong>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="booking-controls">
          <div className="book-seats-header">
            <h3>Book Seats</h3>
            
            {seats.length > 0 && seats.filter(seat => seat.isBooked).length > 0 && (
              <div className="booked-seats-grid">
                {seats
                  .filter(seat => seat.isBooked)
                  .sort((a, b) => a.seatNumber - b.seatNumber)
                  .map(seat => (
                    <div key={seat.seatNumber} className="booked-seat-item">
                      {seat.seatNumber}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
          
          <div className="booking-input">
            <input
              type="number"
              min="1"
              max="7"
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
              placeholder="Enter number of seats"
              className="form-control"
            />
            <button 
              className="btn"
              onClick={handleBookClick}
              disabled={booking || loading}
            >
              Book
            </button>
          </div>
          
          <button 
            className="btn btn-block"
            onClick={handleResetBooking}
            disabled={loading}
          >
            Reset Booking
          </button>
        </div>
      </div>
      
      {showSuccessMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default TicketBooking;