import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Verify token expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired, log user out
          logout();
        } else {
          // Set user data
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Token validation error:', err);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/users/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      setUser(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during login');
      throw err;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/users/register', userData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      setUser(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'admin' || user?.role === 'manager'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;