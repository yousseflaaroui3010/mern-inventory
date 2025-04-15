import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import ProductForm from './ProductForm';
import axios from '../../utils/axiosConfig';
import Loader from '../layout/Loader';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (productData) => {
    try {
      await axios.put(`/products/${id}`, productData);
      navigate('/products');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating product');
    }
  };

  if (loading) return <Loader message="Loading product details..." />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Edit Product
        </Typography>
        <ProductForm 
          initialValues={product}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </Paper>
    </Box>
  );
};

export default EditProduct; 