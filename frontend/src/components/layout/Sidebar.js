import React, { useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalShipping as SupplierIcon,
  SwapHoriz as TransactionIcon,
  Settings as SettingsIcon,
  Person as UserIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open }) => {
  const location = useLocation();
  const { isAdmin, isManager } = useContext(AuthContext);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Suppliers', icon: <SupplierIcon />, path: '/suppliers' },
    { text: 'Transactions', icon: <TransactionIcon />, path: '/transactions' },
    { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  ];

  const adminItems = [
    { text: 'Users', icon: <UserIcon />, path: '/users', admin: true },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', manager: true }
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {adminItems.map((item) => {
            // Only show admin items to admins and manager items to managers or admins
            if ((item.admin && !isAdmin) || (item.manager && !isManager)) {
              return null;
            }
            
            return (
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;