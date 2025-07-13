import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  DialogContent,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useUI } from '../../context/UIContext';
import { saveOrUpdateProductCategoryService } from '../../services/productCategoryServices';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateEditProductCategoryDialog({
  open,
  handleClose,
  mode,
  getProductCategoryListAPICall,
  currentItemForEdit,
  productCategoryList
}) {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [productCategoryId, setProductCategoryId] = useState(0);
  const [productCategoryName, setProductCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [activeFlag, setActiveFlag] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && currentItemForEdit) {
      setProductCategoryId(currentItemForEdit.productCategoryId || 0);
      setProductCategoryName(currentItemForEdit.productCategoryName || '');
      setDescription(currentItemForEdit.description || '');
      setActiveFlag(currentItemForEdit.activeFlag === 'Y');
    } else {
      setProductCategoryId(0);
      setProductCategoryName('');
      setDescription('');
      setActiveFlag(true);
    }
  }, [mode, currentItemForEdit, open]);

  const validateBeforeSave = () => {
    const newErrors = {};

    if (!productCategoryName.trim()) {
      newErrors.productCategoryName = 'Product Category Name is required';
    } else if (
      mode === 'create' &&
      productCategoryList?.some(
        x => x.productCategoryName?.toLowerCase() === productCategoryName?.trim().toLowerCase()
      )
    ) {
      newErrors.productCategoryName = 'Product Category Name already exists';
    }

    if (!description.trim()) {
      newErrors.description = 'Product Category description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrUpdateProductCategoryAPI = () => {
    const productCategoryDTO = {
      productCategoryId: productCategoryId || 0,
      productCategoryName: productCategoryName.trim(),
      description: description.trim(),
      activeFlag: activeFlag ? 'Y' : 'N'
    };

    showLoader();

    saveOrUpdateProductCategoryService(productCategoryDTO)
      .then(res => {
        hideLoader();
        if (res.status) {
          showSnackbar(`Product Category ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');
          getProductCategoryListAPICall(true);
          clearAndCloseDialog();
        } else {
          showSnackbar(res.message || 'Operation failed', 'error');
        }
      })
      .catch(() => {
        hideLoader();
        showSnackbar(`Product Category ${mode === 'edit' ? 'updation' : 'creation'} failed!`, 'error');
        getProductCategoryListAPICall(true);
        clearAndCloseDialog();
      });
  };

  const saveButtonOnClick = () => {
    if (validateBeforeSave()) {
      createOrUpdateProductCategoryAPI();
    } else {
      showSnackbar('Please provide valid input!', 'error');
    }
  };

  const clearAndCloseDialog = () => {
    setProductCategoryName('');
    setDescription('');
    setActiveFlag(true);
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
            {mode === 'edit' ? 'Edit Product Category' : 'Create Product Category'}
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
          error={!!errors.productCategoryName}
          value={productCategoryName}
          onChange={(e) => setProductCategoryName(e.target.value)}
          size="small"
          label="Product Category Name*"
          placeholder="Enter Product Category Name"
          sx={{ width: 300 }}
          helperText={errors?.productCategoryName || ''}
        />
        <TextField
          error={!!errors.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          label="Product Category Description*"
          placeholder="Enter description"
          sx={{ width: 300 }}
          helperText={errors?.description || ''}
        />
        <FormControlLabel
          control={<Switch checked={activeFlag} onChange={() => setActiveFlag(!activeFlag)} />}
          label={activeFlag ? 'Active' : 'Inactive'}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateEditProductCategoryDialog;
