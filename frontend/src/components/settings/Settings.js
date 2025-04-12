import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Settings functionality will be implemented soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;