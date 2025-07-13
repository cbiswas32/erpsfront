import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useUI } from '../../context/UIContext';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { DialogContent, TextField, Autocomplete } from '@mui/material';
import { saveOrUpdateDistrictService } from '../../services/districtServices';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function CreateEditDistrictDialog({ 
  open, 
  handleClose, 
  getDistrictListAPICall, 
  mode, 
  currentItemForEdit, 
  districtList,
  stateList = []  // Pass stateList as prop
}) {

  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [districtId, setDistrictId] = useState(0);
  const [districtName, setDistrictName] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [errors, setErrors] = useState({});
   
  useEffect(() => {
    if (mode === 'edit') {
        console.log("currentItem", currentItemForEdit)
      setDistrictId(currentItemForEdit?.districtId || 0);
      setDistrictName(currentItemForEdit?.districtName || '');
      const foundState = stateList.find(s => s.id === currentItemForEdit?.stateId);
      setSelectedState(foundState || null);
    } else {
      setDistrictId(0);
      setDistrictName('');
      setSelectedState(null);
    }
  }, [mode, currentItemForEdit, stateList, open]);

  const validateBeforeSave = () => {
    const newErrors = {};
    // if(mode === 'edit' ){
       
    // }
    // else{
    //      if( districtName.trim() && districtList?.find(x => x?.districtName?.toLowerCase() == districtName?.trim()?.toLowerCase() )){
    //         newErrors.districtName = 'District Name is duplicate';
    //     }

    // }
    if (!districtName.trim()) newErrors.districtName = 'District Name is required';
    if (!selectedState) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createEditDistrictAPI = () => {
    const districtDTO = {
      districtId: districtId || 0,
      stateId: selectedState?.id,
      districtName: districtName.trim()
    };

    showLoader();
    saveOrUpdateDistrictService(districtDTO)
      .then(res => {
        hideLoader();
        if (res.status) {
          showSnackbar(`District ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');
          getDistrictListAPICall(true);
          clearAndCloseDialog();
        } else {
          showSnackbar(res.message || 'Operation failed', 'error');
        }
      })
      .catch(() => {
        hideLoader();
        showSnackbar(`District ${mode === 'edit' ? 'updation' : 'creation'} failed!`, 'error');
        getDistrictListAPICall(true);
        clearAndCloseDialog();
      });
  };

  const saveButtonOnClick = () => {
    if (validateBeforeSave()) {
      createEditDistrictAPI();
    } else {
      showSnackbar('Please provide valid input!', 'error');
    }
  };

  const clearAndCloseDialog = () => {
    setDistrictName('');
    setSelectedState(null);
    setErrors({});
    handleClose();
  };

  return (
    <Dialog open={open} onClose={clearAndCloseDialog} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative', backgroundColor: 'primary.lighter' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={clearAndCloseDialog} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h5' component='div'>
            {mode === 'edit' ? 'Edit District' : 'Create District'}
          </Typography>
          {mode !== 'view' && (
            <Button sx={{ ml: 4 }} autoFocus variant='contained' onClick={saveButtonOnClick}>
              <SaveAsIcon fontSize='small' sx={{ mr: 1 }} /> Save
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          justifyContent: 'start',
          alignItems: 'center'
        }}
      >
        <TextField
          error={!!errors.districtName}
          value={districtName}
          onChange={(e) => setDistrictName(e.target.value)}
          size='small'
          label='District Name*'
          placeholder='Enter District Name'
          sx={{ width: 300 }}
          helperText={errors?.districtName || ''}
        />

        <Autocomplete
          disablePortal
          value={selectedState}
          options={stateList}
          getOptionLabel={(option) => option.label || ''}
          sx={{ width: 300 }}
          onChange={(e, newValue) => setSelectedState(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!errors.state}
              size='small'
              label='State*'
              placeholder='Select State'
              helperText={errors?.state || ''}
            />
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateEditDistrictDialog;
