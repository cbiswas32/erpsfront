import React, { useState, useEffect, forwardRef } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  DialogContent,
  TextField,
  Slide,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useUI } from '../../context/UIContext';
import { saveOrUpdateProductFeatureService } from '../../services/productFeatureServices';
import { units } from '../../utils/unitUtil';
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateEditProductFeatureDialog({
  open,
  handleClose,
  mode,
  getProductFeatureListAPICall,
  currentItemForEdit,
  productFeatureList = []
}) {
  const { showSnackbar, showLoader, hideLoader } = useUI();

  const [featureName, setFeatureName] = useState('');
  const [description, setDescription] = useState('');
  const [productFeatureId, setProductFeatureId] = useState(0);
  const [unit, setUnit] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && currentItemForEdit) {
        console.log("currentItemForEdit",currentItemForEdit)
      setProductFeatureId(currentItemForEdit.productFeatureId || 0);
      setFeatureName(currentItemForEdit.featureName || '');
      setDescription(currentItemForEdit.description || '');
      setUnit(currentItemForEdit.unit || '');
    } else {
      setProductFeatureId(0);
      setFeatureName('');
      setDescription('');
      setUnit('')
    }
    setErrors({});
  }, [open, mode, currentItemForEdit]);

  const validateBeforeSave = () => {
    const newErrors = {};

    if (!featureName.trim()) {
      newErrors.featureName = 'Feature Name is required';
    } else if (
      mode === 'create' &&
      productFeatureList.some(
        (x) => x.featureName?.trim().toLowerCase() === featureName.trim().toLowerCase()
      )
    ) {
      newErrors.featureName = 'Feature Name already exists';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrUpdateProductFeatureAPI = () => {
    //console.log("productFeatureId", productFeatureId)
    const productFeatureDTO = {
      productFeatureId: productFeatureId || 0,
      featureName: featureName.trim(),
      description: description.trim(),
      unit: unit.trim() || '',
      activeFlag: 'Y'
    };

    showLoader();
    saveOrUpdateProductFeatureService(productFeatureDTO)
      .then((res) => {
        hideLoader();
        if (res.status) {
          showSnackbar(`Product Feature ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');
          getProductFeatureListAPICall(true);
          clearAndCloseDialog();
        } else {
          showSnackbar(res.message || 'Operation failed', 'error');
        }
      })
      .catch(() => {
        hideLoader();
        showSnackbar('Operation failed', 'error');
        getProductFeatureListAPICall(true);
        clearAndCloseDialog();
      });
  };

  const saveButtonOnClick = () => {
    if (validateBeforeSave()) {
      createOrUpdateProductFeatureAPI();
    } else {
      showSnackbar('Please correct the highlighted errors.', 'error');
    }
  };

  const clearAndCloseDialog = () => {
    setFeatureName('');
    setDescription('');
    setUnit('')
    setErrors({});
    handleClose();
  };

  return (
    <Dialog open={open} onClose={clearAndCloseDialog} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative', backgroundColor: 'primary.lighter' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={clearAndCloseDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h5" component="div">
            {mode === 'edit' ? 'Edit Product Feature' : 'Create Product Feature'}
          </Typography>
          {mode !== 'view' && (
            <Button sx={{ ml: 4 }} autoFocus variant="contained" onClick={saveButtonOnClick}>
              <SaveAsIcon fontSize="small" sx={{ mr: 1 }} /> Save
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          justifyContent: 'start',
          alignItems: 'center'
        }}
      >
        <TextField
          error={!!errors.featureName}
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          size="small"
          label="Feature Name*"
          placeholder="Enter Feature Name"
          sx={{ width: 300 }}
          helperText={errors?.featureName || ''}
        />
        <TextField
          error={!!errors.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          label="Description*"
          placeholder="Enter Feature Description"
          sx={{ width: 300 }}
          helperText={errors?.description || ''}
        />
        {/* <TextField
          error={!!errors.unit}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          size="small"
          label="Unit*"
          placeholder="Enter Feature Unit"
          sx={{ width: 300 }}
          helperText={errors?.unit || ''}
        /> */}
        <Autocomplete
        options={units}
        getOptionLabel={(option) => option.value}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        // Find the full option object that matches the current 'unit' string state
        value={units.find(option => option.value === unit) || null}
        onChange={(event, newValue) => {
          // Store the 'value' (full name) of the selected option in the state
          setUnit(newValue ? newValue.value : '');
        }}
        size="small"
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Unit"
            placeholder="Select or Type Feature Unit"
            // Error and helperText props are removed
          />
        )}
      />
      </DialogContent>
    </Dialog>
  );
}

export default CreateEditProductFeatureDialog;
