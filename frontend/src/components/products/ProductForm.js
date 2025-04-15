import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../contexts/CategoryContext';
import axios from '../../utils/axiosConfig';

const DEFAULT_CATEGORIES = [
  'Clothes',
  'Electronics',
  'Books',
  'Accessories',
  'Bags',
  'Beauty',
  'Furniture',
  'Food',
  'Sports',
  'Toys',
  'Other'
];

const ProductForm = ({ initialValues = {}, onSubmit, isEdit = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    unitPrice: '',
    currency: 'MAD',
    unitOfMeasure: 'piece',
    ...initialValues
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { categories, addCategory } = useCategories();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.unitPrice) newErrors.unitPrice = 'Unit price is required';
    if (formData.unitPrice < 0) newErrors.unitPrice = 'Price cannot be negative';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setSubmitError('');

    try {
      const productData = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseInt(formData.quantity)
      };

      if (isEdit) {
        await onSubmit(productData);
      } else {
        await axios.post('/products', productData);
        navigate('/products');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const category = await addCategory({ name: newCategory });
      setFormData(prev => ({ ...prev, category: category._id }));
      setShowAddCategory(false);
      setNewCategory('');
    } catch (error) {
      setErrors(prev => ({ ...prev, category: error.message }));
    }
  };

  const handleQuickAddCategory = async (categoryName) => {
    try {
      const category = await addCategory({ name: categoryName });
      setFormData(prev => ({ ...prev, category: category._id }));
    } catch (error) {
      setErrors(prev => ({ ...prev, category: error.message }));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff' }}>
      <form onSubmit={handleSubmit}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {submitError}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom color="primary">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              autoFocus
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Optional: Add a brief description of the product"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Quick Add Category
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {DEFAULT_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => handleQuickAddCategory(cat)}
                  color="primary"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowAddCategory(true)}
                      edge="end"
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                }
              >
                {categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Unit Price"
              name="unitPrice"
              type="number"
              value={formData.unitPrice}
              onChange={handleChange}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {formData.currency}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Initial Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity || 'Optional: Set initial stock quantity'}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isEdit ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </Box>
      </form>

      <Dialog open={showAddCategory} onClose={() => setShowAddCategory(false)}>
        <DialogTitle>Add Custom Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter a custom category name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddCategory(false)}>Cancel</Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductForm;