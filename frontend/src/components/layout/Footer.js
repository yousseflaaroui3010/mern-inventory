import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        padding: 2,
        marginTop: 'auto',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #ddd'
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Inventory Management System © 2025 | Created by Benaatit Meriem and Youssef Laaroui
      </Typography>
    </Box>
  );
};

export default Footer;