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
        setEr