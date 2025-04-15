import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  SwapHoriz as TransactionIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import axios from '../../utils/axiosConfig';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    products: 0,
    categories: 0,
    transactions: 0,
    lowStock: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories, transactions] = await Promise.all([
          axios.get('/products'),
          axios.get('/categories'),
          axios.get('/transactions')
        ]);

        setData({
          products: products.data.count || 0,
          categories: categories.data.length || 0,
          transactions: transactions.data.length || 0,
          lowStock: products.data.data.filter(p => p.quantity <= p.minStockLevel).length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    {
      title: 'Total Products',
      value: data.products,
      icon: <InventoryIcon sx={{ color: '#1976d2', fontSize: 40 }} />,
      link: '/products',
      color: '#e3f2fd'
    },
    {
      title: 'Low Stock Items',
      value: data.lowStock,
      icon: <WarningIcon sx={{ color: '#ed6c02', fontSize: 40 }} />,
      link: '/products?filter=lowStock',
      color: '#fff3e0'
    },
    {
      title: 'Transactions',
      value: data.transactions,
      icon: <TransactionIcon sx={{ color: '#2e7d32', fontSize: 40 }} />,
      link: '/transactions',
      color: '#e8f5e9'
    },
    {
      title: 'Categories',
      value: data.categories,
      icon: <CategoryIcon sx={{ color: '#7b1fa2', fontSize: 40 }} />,
      link: '/categories',
      color: '#f3e5f5'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/products/new"
          sx={{ 
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          Add New Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: card.color,
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  {card.title}
                </Typography>
                {card.icon}
              </Box>
              
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                {card.value}
              </Typography>

              <Button
                component={Link}
                to={card.link}
                variant="text"
                size="small"
                sx={{ 
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                }}
              >
                View Details →
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;