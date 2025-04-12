import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';

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
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </Box>
          </Box>
        </InventoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;