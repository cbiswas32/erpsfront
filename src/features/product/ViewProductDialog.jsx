import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import { getProductFeaturesByProductIdService } from '../../services/productService';
import { useUI } from '../../context/UIContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ViewProductDialog({ open, handleClose, currentItem = {} }) {
   const { showSnackbar, showLoader, hideLoader } = useUI();
  const [features, setFeatures] = useState([])

  useEffect(() => {
    if(open && currentItem.productId){
        getProductFeaturesByProductIdAPICall()
    }

  },  [open])

   const getProductFeaturesByProductIdAPICall = (hideSnackbar) => {
        showLoader();
        getProductFeaturesByProductIdService(currentItem?.productId)
          .then(res => {
            if (res && res.length > 0) {
              let modList = res?.map(x => {
                return {
                  "selectedOption": {
                    "featureId" : x.featureId,
                    "featureName": x.featureName,
                    "unit": x.featureUnit
                  },
                  "value":x.featureValue
                }
              }) || []
              setFeatures(modList);
              console.log("setProductFeatureMap", res)
              !hideSnackbar && showSnackbar('Features for slected product fetched successfully!', 'success');
            } else {
              setFeatures([]);
              !hideSnackbar && showSnackbar('No features for slected product found!', 'warning');
            }
            hideLoader();
          })
          .catch(error => {
            console.error('Error fetching Product Features:', error);
            setFeatures([]);
            hideLoader();
            !hideSnackbar && showSnackbar('Failed to fetch Product Features!', 'error');
          });
      };
  

  const renderKeyValue = (label, value) => (
    <Grid item xs={12} sm={6}>
      <Box sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>{label}</Box>
      <Box sx={{ fontSize: 14, color: 'text.primary', minHeight: '24px' }}>{value ?? '-'}</Box>
    </Grid>
  );

  const renderFeatures = (features = []) => {
    if (!features.length) {
      return <Typography variant="body2" color="text.secondary">No features available.</Typography>;
    }

    return (
      <Stack spacing={1}>
        {features.map((feat, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            }}
          >
            <Box sx={{ fontWeight: 500, fontSize: 13, color: 'text.secondary' }}>
              {feat.selectedOption?.featureName || '-'}
            </Box>
             <Box sx={{ fontWeight: 500, fontSize: 13, color: 'text.secondary' }}>
              {feat.value || '-'} {(feat.selectedOption.unit && feat.selectedOption.unit != "No Unit") && <Chip
              label={feat.selectedOption.unit || '-'}
              size="small"
              sx={{ fontSize: 12, backgroundColor: '#f0f0f0' }}
            />} 
            </Box>
            
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth="sm" fullWidth>
      <AppBar sx={{ position: 'relative', backgroundColor: 'primary.lighter' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h5">
            View Product Details
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {renderKeyValue('Product Code', currentItem.productCode)}
          {renderKeyValue('Product Name', currentItem.productName)}
          {renderKeyValue('Category', currentItem.category)}
          {renderKeyValue('Brand', currentItem.brand)}
          {renderKeyValue('Unit', currentItem.unit)}
          {renderKeyValue('Unit Price', currentItem.unitPrice)}
          {renderKeyValue('HSN Code', currentItem.hsnCode)}
          {renderKeyValue('Purchase GST %', currentItem.gstPercentagePurchase)}
          {renderKeyValue('Selling GST %', currentItem.gstPercentage)}
          {renderKeyValue('Minimum Stock', currentItem.lowStockThreshold)}
          {renderKeyValue('Available for Sale', currentItem.isAvailableForSale ? 'Yes' : 'No')}
          {renderKeyValue('Serial No. Applicable', currentItem.serialNoApplicable ? 'Yes' : 'No')}
          {renderKeyValue('Status', currentItem.activeFlag === 'Y' ? 'Active' : 'Inactive')}

          <Grid item xs={12}>
            <Box sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>Description</Box>
            <Box sx={{ fontSize: 14, color: 'text.primary', minHeight: '24px', whiteSpace: 'pre-line' }}>
              {currentItem.description || '-'}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Product Feature Details
        </Typography>

        {renderFeatures(features || [])}

      </DialogContent>
    </Dialog>
  );
}

export default ViewProductDialog;
