import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Footer from './components/layout/Footer';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import CategoryList from './components/categories/CategoryList';
import CategoryForm from './components/categories/CategoryForm';
import SupplierList from './components/suppliers/SupplierList';
import TransactionList from './components/transactions/TransactionList';
import TransactionForm from './components/transactions/TransactionForm';
import Reports from './components/reports/Reports';
import UserList from './components/users/UserList';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/profile/Profile';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Auth Components
import Login from './components/auth/Login';

// Context
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';

// CSS
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <InventoryProvider>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header toggleSidebar={() => {}} />
            <Sidebar open={true} />
            
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: 'calc(100% - 240px)' },
                marginLeft: '240px',
              }}
            >
              <Toolbar /> {/* This adds space at the top for the header */}
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/:id/edit" element={<ProductForm />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/categories/new" element={<CategoryForm />} />
                <Route path="/categories/:id/edit" element={<CategoryForm />} />
                <Route path="/suppliers" element={<SupplierList />} />
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/transactions/new" element={<TransactionForm />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/users" element={<UserList />} />
              </Routes>
            </Box>
            <Footer /> {/* Add the Footer here */}
          </Box>
        </InventoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;