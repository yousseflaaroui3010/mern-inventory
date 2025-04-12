import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Summary = ({ data }) => {
  // Prepare data for chart
  const formatChartData = () => {
    if (!data || !data.dailySummary) {
      return [];
    }
    
    // Group by date and calculate totals for each transaction type
    const groupedByDate = {};
    
    data.dailySummary.forEach(item => {
      const date = item._id.date;
      const type = item._id.type;
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          restock: 0,
          sale: 0,
          adjustment: 0,
          return: 0,
          transfer: 0
        };
      }
      
      groupedByDate[date][type] = Math.abs(item.totalValue);
    });
    
    return Object.values(groupedByDate);
  };
  
  const chartData = formatChartData();
  
  // Calculate totals
  const calculateTotals = () => {
    if (!data || !data.summary) {
      return {
        restockTotal: 0,
        saleTotal: 0,
        adjustmentTotal: 0
      };
    }
    
    let restockTotal = 0;
    let saleTotal = 0;
    let adjustmentTotal = 0;
    
    data.summary.forEach(item => {
      switch(item._id) {
        case 'restock':
          restockTotal = Math.abs(item.totalValue);
          break;
        case 'sale':
          saleTotal = Math.abs(item.totalValue);
          break;
        case 'adjustment':
          adjustmentTotal = Math.abs(item.totalValue);
          break;
        default:
          break;
      }
    });
    
    return { restockTotal, saleTotal, adjustmentTotal };
  };
  
  const { restockTotal, saleTotal, adjustmentTotal } = calculateTotals();
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">
            ${restockTotal.toFixed(2)}
          </Typography>
          <Typography variant="body2">Stock In</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error.main">
            ${saleTotal.toFixed(2)}
          </Typography>
          <Typography variant="body2">Sales</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main">
            ${adjustmentTotal.toFixed(2)}
          </Typography>
          <Typography variant="body2">Adjustments</Typography>
        </Box>
      </Box>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="restock" name="Stock In" fill="#4caf50" />
          <Bar dataKey="sale" name="Sales" fill="#f44336" />
          <Bar dataKey="adjustment" name="Adjustments" fill="#ff9800" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Summary;