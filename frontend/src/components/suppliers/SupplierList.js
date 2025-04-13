import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SupplierList = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Suppliers
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Supplier management will be implemented soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SupplierList;