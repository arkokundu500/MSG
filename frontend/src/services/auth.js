import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error.response?.data || error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
