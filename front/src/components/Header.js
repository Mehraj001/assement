import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      {/* <div className="logo">Train Ticket Booking</div>
      {currentUser && (
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <button 
            className="nav-link logout-btn" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      )} */}
    </header>
  );
};

export default Header; 