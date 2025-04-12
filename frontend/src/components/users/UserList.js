import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const UserList = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Users
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          User management functionality will be implemented soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserList;