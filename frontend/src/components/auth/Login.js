import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetStatus, setResetStatus] = useState({ loading: false, error: null, success: false });
  
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetStatus({ loading: true, error: null, success: false });
    
    try {
      // TODO: Implement password reset API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setResetStatus({ loading: false, error: null, success: true });
      setTimeout(() => setResetDialogOpen(false), 2000);
    } catch (err) {
      setResetStatus({ loading: false, error: 'Failed to send reset email', success: false });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mb: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Inventory Management System
          </Typography>
          <Typography 
            component="h2" 
            variant="h6" 
            align="center"
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            Login
          </Typography>
          
          {(error || formError) && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {formError || error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Log In'
              )}
            </Button>

            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}>
              <Button
                color="primary"
                onClick={() => setResetDialogOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Forgot Password?
              </Button>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    color: 'primary',
                    fontWeight: 'bold'
                  }}
                >
                  Register here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => !resetStatus.loading && setResetDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {resetStatus.success ? (
            <Alert severity="success">
              Password reset instructions have been sent to your email.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="resetEmail"
                label="Email Address"
                type="email"
                fullWidth
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={resetStatus.loading}
              />
              {resetStatus.error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {resetStatus.error}
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setResetDialogOpen(false)} 
            disabled={resetStatus.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleForgotPassword}
            disabled={resetStatus.loading || !resetEmail || resetStatus.success}
            variant="contained"
          >
            {resetStatus.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Instructions'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;