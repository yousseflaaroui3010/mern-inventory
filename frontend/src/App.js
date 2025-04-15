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
import EditProduct from './components/products/EditProduct';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Profile from './components/profile/Profile';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Auth Components
import Login from './components/auth/Login';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { CategoryProvider } from './contexts/CategoryContext';

// CSS
import './App.css';

// Layout wrapper component
const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show layout for auth pages
  if (!isAuthenticated || ['/login', '/register'].includes(location.pathname)) {
    return children;
  }

  return (
    <Box sx={{ display: 'flex' }}>
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
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

// Auth wrapper component
const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Special handling for auth pages
  if (['/login', '/register'].includes(location.pathname)) {
    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
  }

  // Protect other routes
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <InventoryProvider>
          <CategoryProvider>
            <CssBaseline />
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
                <Route path="/profile" element={<AuthWrapper><Profile /></AuthWrapper>} />
                <Route path="/products" element={<AuthWrapper><ProductList /></AuthWrapper>} />
                <Route path="/products/new" element={<AuthWrapper><ProductForm /></AuthWrapper>} />
                <Route path="/products/:id/edit" element={<AuthWrapper><EditProduct /></AuthWrapper>} />
                <Route path="/categories" element={<AuthWrapper><CategoryList /></AuthWrapper>} />
                <Route path="/categories/new" element={<AuthWrapper><CategoryForm /></AuthWrapper>} />
                <Route path="/categories/:id/edit" element={<AuthWrapper><CategoryForm /></AuthWrapper>} />
                <Route path="/suppliers" element={<AuthWrapper><SupplierList /></AuthWrapper>} />
                <Route path="/transactions" element={<AuthWrapper><TransactionList /></AuthWrapper>} />
                <Route path="/transactions/new" element={<AuthWrapper><TransactionForm /></AuthWrapper>} />
                <Route path="/reports" element={<AuthWrapper><Reports /></AuthWrapper>} />
                <Route path="/users" element={<AuthWrapper><UserList /></AuthWrapper>} />
              </Routes>
            </Layout>
          </CategoryProvider>
        </InventoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;