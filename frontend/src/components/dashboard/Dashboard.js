import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  SwapHoriz as TransactionIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import InventoryContext from '../../context/InventoryContext';
import Loader from '../layout/Loader';
import Summary from './Summary';
import LowStockAlert from './LowStockAlert';
import axios from '../../utils/axiosConfig';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    loading, 
    error, 
    fetchProducts, 
    fetchLowStockProducts, 
    getTransactionsSummary 
  } = useContext(InventoryContext);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalTransactions: 0,
    lowStockCount: 0
  });
  
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactionsSummary, setTransactionsSummary] = useState({});
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch products
        const productsResponse = await fetchProducts();
        
        // Fetch categories
        const categoriesResponse = await axios.get('/categories');
        
        // Fetch low stock products
        const lowStockResponse = await fetchLowStockProducts();
        
        // Fetch transactions
        const transactionsResponse = await axios.get('/transactions');
        
        // Fetch transactions summary (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const summaryResponse = await getTransactionsSummary({
          startDate: thirtyDaysAgo.toISOString(),
          endDate: today.toISOString()
        });
        
        // Update state
        setLowStockProducts(lowStockResponse || []);
        setRecentTransactions(transactionsResponse?.data?.slice(0, 5) || []); // Last 5 transactions
        setTransactionsSummary(summaryResponse || {});
        
        setStats({
          totalProducts: productsResponse?.count || 0,
          totalCategories: categoriesResponse?.data?.length || 0,
          totalTransactions: transactionsResponse?.data?.length || 0,
          lowStockCount: lowStockResponse?.length || 0
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [fetchProducts, fetchLowStockProducts, getTransactionsSummary]);
  
  if (isLoading) {
    return <Loader message="Loading dashboard..." />;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/transactions/new"
        >
          New Transaction
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e3f2fd'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <InventoryIcon color="primary" />
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalProducts}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/products"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff8e1'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <WarningIcon sx={{ color: '#ff9800' }} />
            </Box>
            <Typography variant="h4" component="div">
              {stats.lowStockCount}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/products?filter=lowStock"
                color="warning"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Transactions
              </Typography>
              <TransactionIcon sx={{ color: '#4caf50' }} />
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalTransactions}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/transactions"
                color="success"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#ede7f6'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Categories
              </Typography>
              <CategoryIcon sx={{ color: '#673ab7' }} />
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalCategories}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/categories"
                color="secondary"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts and Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Summary (Last 30 Days)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Summary data={transactionsSummary} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <LowStockAlert products={lowStockProducts} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;