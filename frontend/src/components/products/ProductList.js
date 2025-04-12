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
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon
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
  
  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
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
        
        // Handle stock filter
        if (stockFilter === 'low') {
          const response = await axios.get('/products/low-stock');
          setProducts(response.data);
          setTotalProducts(response.data.length);
        } else {
          const response = await axios.get('/products', { params });
          setProducts(response.data.data);
          setTotalProducts(response.data.count);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching products');
        setLoading(false);
      }
    };
    
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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`);
        // Refresh product list
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        setError('Error deleting product');
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
  
  if (loading && page === 0) {
    return <Loader message="Loading products..." />;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        {isManager && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/products/new"
          >
            Add Product
          </Button>
        )}
      </Box>
      
      {/* Filters */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ minWidth: 200, flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="stock-filter-label">Stock Level</InputLabel>
            <Select
              labelId="stock-filter-label"
              id="stock-filter"
              value={stockFilter}
              label="Stock Level"
              onChange={handleStockFilterChange}
            >
              <MenuItem value="">All Products</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
            </Select>
          </FormControl>
          
          <Button variant="outlined" size="small" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Paper>
      
      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category ? product.category.name : 'Uncategorized'}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {product.quantity <= product.minStockLevel && (
                        <WarningIcon color="warning" fontSize="small" sx={{ mr: 1 }} />
                      )}
                      {product.quantity} {product.unitOfMeasure}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {product.currency} {product.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.isActive ? "Active" : "Inactive"} 
                      color={product.isActive ? "success" : "default"} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {isManager && (
                        <IconButton 
                          component={Link} 
                          to={`/products/${product._id}/edit`}
                          color="primary"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {isManager && (
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDelete(product._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalProducts}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ProductList;