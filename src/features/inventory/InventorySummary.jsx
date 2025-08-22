import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import InventoryIcon from '@mui/icons-material/Inventory';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentsIcon from '@mui/icons-material/Payments';

function InventorySummary({ filtered = [] }) {
  const totalQtyByUnit = filtered.reduce((acc, item) => {
    const unit = item.unit || 'unit';
    const qty = Number(item.quantity) || 0;
    acc[unit] = (acc[unit] || 0) + qty;
    return acc;
  }, {});

  const lowStockByLocation = filtered.reduce((acc, item) => {
    if (Number(item.quantity) <= Number(item.low_stock_threshold)) {
      const location = item.location_name || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
    }
    return acc;
  }, {});

  const totalValue = filtered.reduce(
    (acc, item) => acc + (Number(item.quantity) * Number(item.unit_price || 0)),
    0
  );

  const cardStyles = {
    p: 2,
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center'
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Inventory Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Paper variant="outlined" sx={cardStyles}>
            <InventoryIcon color="primary" fontSize="large" />
            <Typography variant="subtitle2" color="text.secondary">
              Total Products
            </Typography>
            <Typography variant="h5" color="primary">
              {filtered.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper variant="outlined" sx={{ ...cardStyles, textAlign: 'left' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ProductionQuantityLimitsIcon color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                Total Quantity by Unit
              </Typography>
            </Stack>
            <Stack spacing={0.5} mt={1}>
              {Object.entries(totalQtyByUnit).map(([unit, qty]) => (
                <Typography key={unit}>
                  {Number(qty || 0).toFixed(2)} {unit}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper variant="outlined" sx={cardStyles}>
            <PaymentsIcon color="success" fontSize="large" />
            <Typography variant="subtitle2" color="text.secondary">
              Total Inventory Value
            </Typography>
            <Typography variant="h5" color="green">
              ₹ {totalValue.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper variant="outlined" sx={{ ...cardStyles, textAlign: 'left' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon color="error" />
              <Typography variant="subtitle2" color="text.secondary">
                Low Stock Count by Location
              </Typography>
            </Stack>
            <Stack spacing={0.5} mt={1}>
              {Object.entries(lowStockByLocation).map(([loc, count]) => (
                <Typography key={loc} color="error">
                  {loc}: {count}
                </Typography>
              ))}
              {Object.keys(lowStockByLocation).length === 0 && (
                <Typography color="text.secondary">No low stock items</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default InventorySummary;
