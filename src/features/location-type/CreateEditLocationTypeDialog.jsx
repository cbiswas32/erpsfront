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
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useUI } from '../../context/UIContext';
import { saveOrUpdateLocationTypeService } from '../../services/locationTypeServices';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateEditLocationTypeDialog({
  open,
  handleClose,
  mode,
  getLocationTypeListAPICall,
  currentItemForEdit,
  locationTypeList
}) {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [locationTypeId, setLocationTypeId] = useState(0);
  const [locationTypeName, setLocationTypeName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && currentItemForEdit) {
      setLocationTypeId(currentItemForEdit.locationTypeId || 0);
      setLocationTypeName(currentItemForEdit.locationTypeName || '');
      setDescription(currentItemForEdit.description || '')
    } else {
      setLocationTypeId(0);
      setLocationTypeName('');
      setDescription('')
    }
  }, [mode, currentItemForEdit, open]);

  const validateBeforeSave = () => {
    const newErrors = {};

    if (!locationTypeName.trim()) {
      newErrors.locationTypeName = 'Location Type Name is required';
    } else if (
      mode === 'create' &&
      locationTypeList?.some(x => x.locationTypeName?.toLowerCase() === locationTypeName?.trim().toLowerCase())
    ) {
      newErrors.locationTypeName = 'Location Type Name already exists';
    }

     if (!description.trim()) {
      newErrors.description = 'Location description is required';
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrUpdateLocationTypeAPI = () => {
    const locationTypeDTO = {
      locationTypeId: locationTypeId || 0,
      locationTypeName: locationTypeName.trim(),
      description: description.trim()
    };

    showLoader();

    saveOrUpdateLocationTypeService(locationTypeDTO)
      .then(res => {
        hideLoader();
        if (res.status) {
          showSnackbar(`Location Type ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');
          getLocationTypeListAPICall(true);
          clearAndCloseDialog();
        } else {
          showSnackbar(res.message || 'Operation failed', 'error');
        }
      })
      .catch(() => {
        hideLoader();
        showSnackbar(`Location Type ${mode === 'edit' ? 'updation' : 'creation'} failed!`, 'error');
        getLocationTypeListAPICall(true);
        clearAndCloseDialog();
      });
  };

  const saveButtonOnClick = () => {
    if (validateBeforeSave()) {
      createOrUpdateLocationTypeAPI();
    } else {
      showSnackbar('Please provide valid input!', 'error');
    }
  };

  const clearAndCloseDialog = () => {
    setLocationTypeName('');
    setDescription('')
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
            {mode === 'edit' ? 'Edit Location Type' : 'Create Location Type'}
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
          error={!!errors.locationTypeName}
          value={locationTypeName}
          onChange={(e) => setLocationTypeName(e.target.value)}
          size="small"
          label="Location Type Name*"
          placeholder="Enter Location Type Name"
          sx={{ width: 300 }}
          helperText={errors?.locationTypeName || ''}
        />
        <TextField
          error={!!errors.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          label="Location description*"
          placeholder="Enter description"
          sx={{ width: 300 }}
          helperText={errors?.description || ''}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateEditLocationTypeDialog;
