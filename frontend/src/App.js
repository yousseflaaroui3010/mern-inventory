import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Page Components
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import ProductDetail from './components/products/ProductDetail';
import CategoryList from './components/categories/CategoryList';
import CategoryForm from './components/categories/CategoryForm';
import SupplierList from './components/suppliers/SupplierList';
import SupplierForm from './components/suppliers/SupplierForm';
import TransactionList from './components/transactions/TransactionList';
import TransactionForm from './components/transactions/TransactionForm';
import UserList from './components/users/UserList';
import Settings from './components/settings/Settings';
import Reports from './components/reports/Reports';

// Context
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import AuthContext from './context/AuthContext';

// CSS
import './App.css';

// Wrapper component for protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin only route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Manager only route
const ManagerRoute = ({ children }) => {
  const { isAuthenticated, isManager, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isManager) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header toggleSidebar={toggleSidebar} />
      
      {isAuthenticated && <Sidebar open={sidebarOpen} />}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
          marginLeft: sidebarOpen ? '240px' : 0,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* This adds space at the top for the header */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products/new" 
            element={
              <ManagerRoute>
                <ProductForm />
              </ManagerRoute>
            } 
          />
          
          <Route 
            path="/products/:id" 
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products/:id/edit" 
            element={
              <ManagerRoute>
                <ProductForm />
              </ManagerRoute>
            } 
          />
          
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <CategoryList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/categories/new" 
            element={
              <ManagerRoute>
                <CategoryForm />
              </ManagerRoute>
            } 
          />
          
          <Route 
            path="/suppliers" 
            element={
              <ProtectedRoute>
                <SupplierList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/suppliers/new" 
            element={
              <ManagerRoute>
                <SupplierForm />
              </ManagerRoute>
            } 
          />
          
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <TransactionList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/transactions/new" 
            element={
              <ProtectedRoute>
                <TransactionForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <AdminRoute>
                <Register />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ManagerRoute>
                <Settings />
              </ManagerRoute>
            } 
          />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <InventoryProvider>
          <AppContent />
        </InventoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;