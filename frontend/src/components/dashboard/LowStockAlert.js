import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Button
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const LowStockAlert = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1">No low stock items.</Typography>
      </Box>
    );
  }
  
  // Limit to 5 items for dashboard display
  const displayProducts = products.slice(0, 5);
  
  return (
    <Box>
      <List>
        {displayProducts.map(product => (
          <ListItem key={product._id} component={Link} to={`/products/${product._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemIcon>
              <WarningIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary={product.name}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="error">
                    Qty: {product.quantity} {product.unitOfMeasure} 
                  </Typography>
                  {` (Min: ${product.minStockLevel})`}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
      
      {products.length > 5 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            component={Link} 
            to="/products?filter=lowStock" 
            color="warning" 
            size="small"
          >
            See all {products.length} low stock items
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LowStockAlert;