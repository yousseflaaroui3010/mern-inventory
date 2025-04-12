// components/categories/CategoryList.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
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
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';
import InventoryContext from '../../context/InventoryContext';
import Loader from '../layout/Loader';
import axios from '../../utils/axiosConfig';

const CategoryList = () => {
  const { isManager } = useContext(AuthContext);
  const { fetchCategories } = useContext(InventoryContext);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading categories');
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/categories/${id}`);
        // Refresh categories list
        setCategories(categories.filter(category => category._id !== id));
        // Update context categories
        fetchCategories();
      } catch (error) {
        setError('Error deleting category. It may be in use by products.');
        console.error(error);
      }
    }
  };
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(
    category => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <Loader message="Loading categories..." />;
  }
  
  // Find parent category names
  const getCategoryName = (id) => {
    const category = categories.find(cat => cat._id === id);
    return category ? category.name : '';
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Categories
        </Typography>
        {isManager && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/categories/new"
          >
            Add Category
          </Button>
        )}
      </Box>
      
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Categories"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Categories Table */}
      <TableContainer component={Paper}>
        <Table aria-label="categories table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parent Category</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>
                    {category.parentCategory ? (
                      getCategoryName(category.parentCategory)
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {isManager && (
                        <>
                          <IconButton 
                            component={Link} 
                            to={`/categories/${category._id}/edit`}
                            color="primary"
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDelete(category._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoryList;