import React, { useContext } from 'react';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      <Card sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Username: {user?.username}</Typography>
          <Typography variant="body1">Email: {user?.email}</Typography>
          <Typography variant="body1">Role: {user?.role}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;