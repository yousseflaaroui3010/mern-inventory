// components/categories/CategoryForm.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import InventoryContext from '../../context/InventoryContext';
import Loader from '../layout/Loader';
import axios from '../../utils/axiosConfig';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, fetchCategories } = useContext(InventoryContext);
  
  const [category, setCategory] = useState({
    name: '',
    description: '',
    parentCategory: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch categories for parent dropdown
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);
  
  // Fetch category data if editing
  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        setIsEditing(true);
        setLoading(true);
        
        try {
          const response = await axios.get(`/categories/${id}`);
          const categoryData = response.data;
          
          setCategory({
            name: categoryData.name || '',
            description: categoryData.description || '',
            parentCategory: categoryData.parentCategory?._id || ''
          });
          
          setLoading(false);
        } catch (err) {
          setError('Error fetching category');
          setLoading(false);
        }
      }
    };
    
    fetchCategory();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setCategory({
      ...category,
      [name]: value
    });
  };
  
  const validateForm = () => {
    if (!category.name.trim()) {
      setError('Category name is required');
      return false;
    }
    
    // Check if trying to set itself as parent
    if (isEditing && category.parentCategory === id) {
      setError('A category cannot be its own parent');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (isEditing) {
        await axios.put(`/categories/${id}`, category);
      } else {
        await axios.post('/categories', category);
      }
      
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving category');
      setLoading(false);
    }
  };
  
  if (loading && isEditing && !category.name) {
    return <Loader message="Loading category data..." />;
  }
  
  // Filter out the current category for parent selection
  const parentCategoryOptions = categories.filter(cat => !isEditing || cat._id !== id);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/categories')}
        >
          Back to Categories
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Category Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                name="name"
                value={category.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={category.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="parent-category-label">Parent Category (Optional)</InputLabel>
                <Select
                  labelId="parent-category-label"
                  name="parentCategory"
                  value={category.parentCategory}
                  onChange={handleChange}
                  label="Parent Category (Optional)"
                >
                  <MenuItem value="">None</MenuItem>
                  {parentCategoryOptions.map(cat => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Category'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CategoryForm;