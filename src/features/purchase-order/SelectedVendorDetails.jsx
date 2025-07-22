import { Card, CardContent, Typography, Grid, Divider } from '@mui/material';

export const SelectedVendorDetails = ({ vendor }) => {
  if (!vendor) return null;

  return (
    <Card sx={{ mt: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Selected Vendor Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Vendor Code</Typography>
            <Typography variant="subtitle2">{vendor.vendorCode || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Vendor Name</Typography>
            <Typography variant="subtitle2">{vendor.vendorName || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Vendor Type</Typography>
            <Typography variant="subtitle2">{vendor.vendorType || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">GSTIN</Typography>
            <Typography variant="subtitle2">{vendor.gstin || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">PAN</Typography>
            <Typography variant="subtitle2">{vendor.pan || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography variant="subtitle2">{vendor.email || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Phone</Typography>
            <Typography variant="subtitle2">{vendor.phone || '-'}</Typography>
          </Grid>
          {vendor.website && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Website</Typography>
              <Typography variant="subtitle2">{vendor.website || '-'}</Typography>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Typography variant="subtitle2" color={vendor.status ? 'green' : 'error'}>
              {vendor.status ? 'Active' : 'Inactive'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
