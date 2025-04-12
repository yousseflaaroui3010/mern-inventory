import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosConfig';
import AuthContext from './AuthContext';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load categories when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchSuppliers();
    }
  }, [isAuthenticated]);

  // Fetch all products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/products', { params });
      
      setProducts(response.data.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error fetching products');
      throw err;
    }
  };

  // Fetch low stock products
  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/products/low-stock');
      
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error fetching low stock products');
      throw err;
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/categories');
      
      setCategories(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error fetching categories');
      throw err;
    }
  };

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/suppliers');
      
      setSuppliers(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error fetching suppliers');
      throw err;
    }
  };

  // Create a new product
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Handle file upload
      let formData;
      if (productData.image) {
        formData = new FormData();
        
        // Add all properties to form data
        Object.keys(productData).forEach(key => {
          if (key === 'image') {
            formData.append('image', productData.image);
          } else {
            formData.append(key, productData[key]);
          }
        });
      }
      
      const response = await axios.post(
        '/products',
        formData || productData,
        formData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );
      
      setLoading(false);
      
      // Update products list
      fetchProducts();
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error creating product');
      throw err;
    }
  };

  // Create a new transaction
  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/transactions', transactionData);
      
      setLoading(false);
      
      // Update products list to reflect new quantities
      fetchProducts();
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error creating transaction');
      throw err;
    }
  };

  // Get transaction history for a product
  const getProductTransactions = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/transactions/product/${productId}`);
      
      setTransactions(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error fetching transactions');
      throw err;
    }
  };

  // Get transactions summary
  const getTransactionsSummary = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/transactions/summary', { params });
      
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error fetching transactions summary');
      throw err;
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        suppliers,
        transactions,
        loading,
        error,
        fetchProducts,
        fetchLowStockProducts,
        fetchCategories,
        fetchSuppliers,
        createProduct,
        createTransaction,
        getProductTransactions,
        getTransactionsSummary
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryContext;