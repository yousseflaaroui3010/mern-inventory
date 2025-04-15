import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Chip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';
import InventoryContext from '../../context/InventoryContext';
import Loader from '../layout/Loader';
import axios from '../../utils/axiosConfig';

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isManager } = useContext(AuthContext);
  const { categories, fetchCategories } = useContext(InventoryContext);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Parse query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('filter') === 'lowStock') {
      setStockFilter('low');
    }
  }, [location.search]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = {
        page: page + 1,
        limit: rowsPerPage
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (categoryFilter) {
        params.category = categoryFilter;
      }
      
      if (stockFilter) {
        params.stockFilter = stockFilter;
      }
      
      console.log('Fetching products with params:', params);
      
      const response = await axios.get('/products', { params });
      console.log('Products response:', response.data);
      
      if (response.data && response.data.data) {
        setProducts(response.data.data);
        setTotalProducts(response.data.count);
      } else {
        setError('Invalid data format received from server');
        setProducts([]);
        setTotalProducts(0);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Error fetching products');
      setProducts([]);
      setTotalProducts(0);
      setLoading(false);
    }
  };

  // Fetch products with filters
  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, searchTerm, categoryFilter, stockFilter]);
  
  // Fetch categories if not already loaded
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setLoading(true);
        await axios.delete(`/products/${id}`);
        // Remove the product from the local state
        setProducts(products.filter(product => product._id !== id));
        setTotalProducts(prev => prev - 1);
        // Show success message using error state temporarily
        setError('Product successfully deleted');
        setTimeout(() => setError(null), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting product');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };
  
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0);
  };
  
  const handleStockFilterChange = (e) => {
    setStockFilter(e.target.value);
    setPage(0);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStockFilter('');
    setPage(0);
    
    // Update URL to remove any query parameters
    navigate('/products');
  };

  const handleRefresh = () => {
    fetchProducts();
  };
  
  if (loading && page === 0) {
    return <Loader message="Loading products..." />;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/products/new"
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              borderRadius: 2,
              px: 3
            }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          alignItems: 'center',
          mb: 2
        }}>
          <TextField
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Stock Level</InputLabel>
            <Select
              value={stockFilter}
              onChange={handleStockFilterChange}
              label="Stock Level"
            >
              <MenuItem value="">All Stock</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
              <MenuItem value="out">Out of Stock</MenuItem>
              <MenuItem value="in">In Stock</MenuItem>
            </Select>
          </FormControl>

          {(searchTerm || categoryFilter || stockFilter) && (
            <Button
              variant="outlined"
              onClick={clearFilters}
              size="small"
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Products Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product._id}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {product.quantity}
                    {product.quantity <= (product.minStockLevel || 0) && (
                      <WarningIcon color="warning" fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {product.unitPrice} {product.currency}
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    color={product.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => navigate(`/products/${product._id}/edit`)}
                      size="small"
                      color="primary"
                      title="Edit product"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product._id)}
                      size="small"
                      color="error"
                      title="Delete product"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalProducts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
    </Box>
  );
};

export default ProductList;