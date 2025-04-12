import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const TransactionList = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Transactions
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/transactions/new"
        >
          New Transaction
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Transaction list functionality will be implemented soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TransactionList;