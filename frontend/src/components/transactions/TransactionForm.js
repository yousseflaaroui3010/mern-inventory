import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment,
  Divider,
  Alert,
  Autocomplete
} from '@mui/material';
import { FormHelperText } from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';
import InventoryContext from '../../context/InventoryContext';
import Loader from '../layout/Loader';
import axios from '../../utils/axiosConfig';

const TransactionForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { loading: contextLoading } = useContext(InventoryContext);
  
  const [transaction, setTransaction] = useState({
    type: 'restock',
    product: '',
    quantity: 1,
    unitPrice: 0,
    notes: ''
  });
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Transaction type options
  const transactionTypes = [
    { value: 'restock', label: 'Stock In (Restock)' },
    { value: 'sale', label: 'Stock Out (Sale)' },
    { value: 'adjustment', label: 'Inventory Adjustment' },
    { value: 'return', label: 'Return' },
    { value: 'transfer', label: 'Transfer' }
  ];
  
  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products');
        setProducts(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setTransaction({
      ...transaction,
      [name]: value
    });
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
    
    if (newValue) {
      setTransaction({
        ...transaction,
        product: newValue._id,
        unitPrice: newValue.unitPrice || 0
      });
    } else {
      setTransaction({
        ...transaction,
        product: '',
        unitPrice: 0
      });
    }
    
    // Clear validation error
    if (validationErrors.product) {
      setValidationErrors({
        ...validationErrors,
        product: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!transaction.product) {
      errors.product = 'Product is required';
    }
    
    if (!transaction.type) {
      errors.type = 'Transaction type is required';
    }
    
    if (transaction.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    // Check if there's enough stock for outgoing transactions
    if (['sale', 'transfer'].includes(transaction.type) && 
        selectedProduct && 
        transaction.quantity > selectedProduct.quantity) {
      errors.quantity = `Not enough stock. Available: ${selectedProduct.quantity}`;
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
    setSuccess('');
    
    try {
      await axios.post('/transactions', transaction);
      
      setSuccess('Transaction created successfully!');
      
      // Clear form for next transaction
      setTransaction({
        type: transaction.type, // Keep the same type for multiple transactions
        product: '',
        quantity: 1,
        unitPrice: 0,
        notes: ''
      });
      
      setSelectedProduct(null);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating transaction');
      setLoading(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/transactions');
  };
  
  if (loading && products.length === 0) {
    return <Loader message="Loading products..." />;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          New Transaction
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back to Transactions
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Transaction Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!validationErrors.type} required>
                <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
                <Select
                  labelId="transaction-type-label"
                  name="type"
                  value={transaction.type}
                  onChange={handleChange}
                  label="Transaction Type"
                >
                  {transactionTypes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.type && (
                  <FormHelperText>{validationErrors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.sku})`}
                value={selectedProduct}
                onChange={handleProductChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Product"
                    error={!!validationErrors.product}
                    helperText={validationErrors.product}
                    required
                  />
                )}
              />
            </Grid>
            
            {selectedProduct && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Current Stock: {selectedProduct.quantity} {selectedProduct.unitOfMeasure}
                    {selectedProduct.quantity <= selectedProduct.minStockLevel && (
                      <span style={{ color: '#f44336', marginLeft: '8px' }}>
                        (Low Stock)
                      </span>
                    )}
                  </Typography>
                </Alert>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={transaction.quantity}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                  endAdornment: selectedProduct && (
                    <InputAdornment position="end">
                      {selectedProduct.unitOfMeasure}
                    </InputAdornment>
                  )
                }}
                error={!!validationErrors.quantity}
                helperText={validationErrors.quantity}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price"
                name="unitPrice"
                value={transaction.unitPrice}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: selectedProduct && (
                    <InputAdornment position="start">
                      {selectedProduct.currency}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={transaction.notes}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Optional notes about this transaction"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Record Transaction'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default TransactionForm;