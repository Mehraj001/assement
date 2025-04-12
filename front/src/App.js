import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SeatProvider } from './context/SeatContext';

// Components
// import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import TicketBooking from './pages/TicketBooking';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SeatProvider>
          <div className="App">
            {/* <Header /> */}
            <ToastContainer />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <TicketBooking />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </SeatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
