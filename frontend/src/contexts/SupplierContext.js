import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching suppliers');
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = async (supplierData) => {
    setLoading(true);
    try {
      const response = await axios.post('/suppliers', supplierData);
      setSuppliers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding supplier');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <SupplierContext.Provider value={{
      suppliers,
      loading,
      error,
      fetchSuppliers,
      addSupplier
    }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};

export default SupplierContext; 