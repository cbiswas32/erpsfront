import React from 'react';
import { Box, Typography, Button, Autocomplete, TextField, IconButton, Stack, Divider, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ProductFeatureSection({
  productFeatureMap = [],
  setProductFeatureMap,
  productFeatureList = [],
  errors = {}
}) {

  const handleFeatureChange = (index, value) => {
    const isDuplicate = productFeatureMap.some((item, idx) => item.selectedOption?.featureId === value?.featureId && idx !== index);
    if (isDuplicate) return;

    const updated = [...productFeatureMap];
    updated[index].selectedOption = value;
    setProductFeatureMap(updated);
  };

  const handleFeatureValueChange = (index, value) => {
    const updated = [...productFeatureMap];
    updated[index].value = value;
    setProductFeatureMap(updated);
  };

  const handleAddFeature = () => {
    setProductFeatureMap(prev => [
      ...prev,
      { selectedOption: null, value: '' }
    ]);
  };

  const handleRemoveFeature = (index) => {
    const updated = productFeatureMap.filter((_, idx) => idx !== index);
    setProductFeatureMap(updated);
  };

  return (
    <Box sx={{ mt: 4, p: 3, borderRadius: 4, border: '1px solid #e0e0e0', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>Product Features</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={handleAddFeature}
          disabled={productFeatureMap.length >= productFeatureList.length}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
        >
          Add Feature +
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {productFeatureMap.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center">
          No features added yet. Click "Add Feature +" to start.
        </Typography>
      )}

      <Stack spacing={2}>
        {productFeatureMap.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              backgroundColor: '#f9fafb',
              p: 2,
              borderRadius: 3,
              border: '1px solid #ddd'
            }}
          >
            <Autocomplete
              options={productFeatureList.filter(opt => !productFeatureMap.some(pf => pf.selectedOption?.featureId === opt.featureId && pf !== item))}
              getOptionLabel={(option) => option.featureName || ''}
              isOptionEqualToValue={(option, value) => option.featureId === value?.featureId}
              value={item.selectedOption}
              onChange={(e, val) => handleFeatureChange(index, val)}
              size="small"
              sx={{ flex: 1, backgroundColor: '#fff', borderRadius: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Feature*"
                  error={!!errors[`feature-${index}`]}
                  helperText={errors[`feature-${index}`]}
                />
              )}
            />

            <TextField
              label="Feature Details*"
              value={item.value}
              onChange={(e) => handleFeatureValueChange(index, e.target.value)}
              size="small"
              error={!!errors[`featureValue-${index}`]}
              helperText={errors[`featureValue-${index}`]}
              sx={{ flex: 1, backgroundColor: '#fff', borderRadius: 2 }}
               slotProps={{
                                    input: {
                                      endAdornment: item?.selectedOption?.unit && item?.selectedOption?.unit !=  "No Unit"  &&  <Typography sx={{fontSize: '0.7rem', p:1, }}>{item?.selectedOption?.unit}</Typography> ,
                                    },
                                  }}
            />

            <Tooltip title="Remove Feature">
              <IconButton color="error" onClick={() => handleRemoveFeature(index)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Stack>

    </Box>
  );
}

export default ProductFeatureSection;