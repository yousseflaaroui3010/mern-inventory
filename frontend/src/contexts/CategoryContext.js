import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async (retryCount = 3) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (retryCount > 0 && (!error.response || error.response.status >= 500)) {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchCategories(retryCount - 1);
      }
      setError(error.message || 'Error fetching categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await axios.post('/categories', categoryData);
      setCategories([...categories, response.data]);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error adding category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      error,
      fetchCategories,
      addCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export default CategoryContext; 