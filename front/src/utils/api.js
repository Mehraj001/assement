
import axios from 'axios';

// Determine API URL based on environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const localApiUrl = 'http://localhost:5000/api';
const prodApiUrl = 'https://assement-api.vercel.app/api';


const API_URL = isLocal ? localApiUrl : (process.env.REACT_APP_API_URL || prodApiUrl);

console.log('Using API URL:', API_URL);


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
     
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during registration.' };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Invalid credentials.' };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching user data.' };
  }
};

// Seats API calls
export const getAllSeats = async () => {
  try {
    const response = await api.get('/seats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching seats.' };
  }
};

export const initializeSeats = async () => {
  try {
    const response = await api.post('/seats/initialize');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error initializing seats.' };
  }
};

export const bookSeats = async (seatNumbers) => {
  try {
    const response = await api.post('/seats/book', { seats: seatNumbers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error booking seats.' };
  }
};

export const resetSeats = async () => {
  try {
    const response = await api.post('/seats/reset');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error resetting seats.' };
  }
};

export const getAvailableSeats = async (count) => {
  try {
    const response = await api.get(`/seats/available/${count}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching available seats.' };
  }
};

export default api; 

