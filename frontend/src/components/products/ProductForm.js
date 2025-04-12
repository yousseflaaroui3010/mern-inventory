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
  FormHelperText,
  InputAdornment,
  Divider,
  Alert
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import InventoryContext from '../../context/InventoryContext';
import Loader from '../layout/Loader';
import axios from '../../utils/axiosConfig';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, suppliers, fetchCategories, fetchSuppliers } = useContext(InventoryContext);
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    quantity: 0,
    unitOfMeasure: 'piece',
    unitPrice: 0,
    currency: 'MAD',
    costPrice: 0,
    minStockLevel: 0,
    location: '',
    supplier: '',
    barcode: '',
    isActive: true
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Units of measure options
  const unitOptions = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'mg', label: 'Milligram (mg)' },
    { value: 'L', label: 'Liter (L)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
    { value: 'set', label: 'Set' },
    { value: 'pair', label: 'Pair' },
    { value: 'other', label: 'Other' }
  ];
  
  // Currency options
  const currencyOptions = [
    { value: 'MAD', label: 'Moroccan Dirham (MAD)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' }
  ];
  
  // Fetch categories and suppliers if not already loaded
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    
    if (suppliers.length === 0) {
      fetchSuppliers();
    }
  }, [categories, suppliers, fetchCategories, fetchSuppliers]);
  
  // Fetch product if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setIsEditing(true);
        setLoading(true);
        
        try {
          const response = await axios.get(`/products/${id}`);
          const productData = response.data;
          
          setProduct({
            name: productData.name || '',
            description: productData.description || '',
            sku: productData.sku || '',
            category: productData.category?._id || '',
            quantity: productData.quantity || 0,
            unitOfMeasure: productData.unitOfMeasure || 'piece',
            unitPrice: productData.unitPrice || 0,
            currency: productData.currency || 'MAD',
            costPrice: productData.costPrice || 0,
            minStockLevel: productData.minStockLevel || 0,
            location: productData.location || '',
            supplier: productData.supplier?._id || '',
            barcode: productData.barcode || '',
            isActive: productData.isActive === undefined ? true : productData.isActive
          });
          
          if (productData.imageUrl) {
            setImagePreview(productData.imageUrl);
          }
          
          setLoading(false);
        } catch (err) {
          setError('Error fetching product data');
          setLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!product.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!product.sku.trim()) {
      errors.sku = 'SKU is required';
    }
    
    if (!product.category) {
      errors.category = 'Category is required';
    }
    
    if (product.unitPrice < 0) {
      errors.unitPrice = 'Price cannot be negative';
    }
    
    if (product.costPrice < 0) {
      errors.costPrice = 'Cost price cannot be negative';
    }
    
    if (product.minStockLevel < 0) {
      errors.minStockLevel = 'Minimum stock level cannot be negative';
    }
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add product data
      Object.keys(product).forEach(key => {
        formData.append(key, product[key]);
      });
      
      // Add image if selected
      if (image) {
        formData.append('image', image);
      }
      
      if (isEditing) {
        // Update existing product
        await axios.put(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new product
        await axios.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
      setLoading(false);
    }
  };
  
  if (loading && !product.name) {
    return <Loader message="Loading product data..." />;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
        >
          Back to Products
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
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU (Stock Keeping Unit)"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                error={!!validationErrors.sku}
                helperText={validationErrors.sku}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!validationErrors.category} required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.category && (
                  <FormHelperText>{validationErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="supplier-label">Supplier</InputLabel>
                <Select
                  labelId="supplier-label"
                  name="supplier"
                  value={product.supplier}
                  onChange={handleChange}
                  label="Supplier"
                >
                  <MenuItem value="">None</MenuItem>
                  {suppliers.map(supplier => (
                    <MenuItem key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Stock Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Stock Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0, step: 1 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="unit-label">Unit of Measure</InputLabel>
                <Select
                  labelId="unit-label"
                  name="unitOfMeasure"
                  value={product.unitOfMeasure}
                  onChange={handleChange}
                  label="Unit of Measure"
                >
                  {unitOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Stock Level"
                name="minStockLevel"
                value={product.minStockLevel}
                onChange={handleChange}
                error={!!validationErrors.minStockLevel}
                helperText={validationErrors.minStockLevel}
                InputProps={{
                  inputProps: { min: 0, step: 1 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Location"
                name="location"
                value={product.location}
                onChange={handleChange}
                placeholder="e.g., Warehouse A, Shelf B3"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Barcode"
                name="barcode"
                value={product.barcode}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Pricing Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pricing Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Selling Price"
                name="unitPrice"
                value={product.unitPrice}
                onChange={handleChange}
                error={!!validationErrors.unitPrice}
                helperText={validationErrors.unitPrice}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">{product.currency}</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Cost Price"
                name="costPrice"
                value={product.costPrice}
                onChange={handleChange}
                error={!!validationErrors.costPrice}
                helperText={validationErrors.costPrice}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">{product.currency}</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  name="currency"
                  value={product.currency}
                  onChange={handleChange}
                  label="Currency"
                >
                  {currencyOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Product Image */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Product Image
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {imagePreview && (
                <Box
                  sx={{
                    height: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    p: 1
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />
                </Box>
              )}
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Product'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ProductForm;