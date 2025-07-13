import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useUI } from '../../context/UIContext';
import { saveOrUpdateLocationService } from '../../services/locationService';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateEditLocationDialog({
  open,
  handleClose,
  mode,
  getLocationListAPICall,
  currentItemForEdit,
  stateList = [],
  districtList = [],
  locationTypeList = [],
  getDistrictLisByStateId,
}) {
  const { showSnackbar, showLoader, hideLoader } = useUI();

  const [locationDTO, setLocationDTO] = useState({
    locationId: 0,
    locationName: '',
    address: '',
    stateId: '',
    districtId: '',
    pincode: '',
    locationTypeIds: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && currentItemForEdit) {
      setLocationDTO({
        locationId: currentItemForEdit.locationId || 0,
        locationName: currentItemForEdit.locationName || '',
        address: currentItemForEdit.address || '',
        stateId: currentItemForEdit.stateId || '',
        districtId: currentItemForEdit.districtId || '',
        pincode: currentItemForEdit.pincode || '',
        locationTypeIds: currentItemForEdit.locationTypeIds || []
      });
    } else {
      setLocationDTO({
        locationId: 0,
        locationName: '',
        address: '',
        stateId: '',
        districtId: '',
        pincode: '',
        locationTypeIds: []
      });
    }
  }, [mode, currentItemForEdit, open]);

  const validateBeforeSave = () => {
    const newErrors = {};
    if (!locationDTO.locationName.trim()) newErrors.locationName = 'Location Name is required';
    if (!locationDTO.address.trim()) newErrors.address = 'Address is required';
    if (!locationDTO.stateId) newErrors.stateId = 'State is required';
    if (!locationDTO.districtId) newErrors.districtId = 'District is required';
    if (!locationDTO.pincode) newErrors.pincode = 'Pincode is required';
    if (!locationDTO.locationTypeIds.length) newErrors.locationTypeIds = 'Select at least one type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveButtonOnClick = () => {
    if (validateBeforeSave()) {
      showLoader();
      saveOrUpdateLocationService(locationDTO)
        .then((res) => {
          hideLoader();
          if (res.status) {
            showSnackbar(`Location ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');
            getLocationListAPICall(true);
            clearAndCloseDialog();
          } else {
            showSnackbar(res.message || 'Operation failed', 'error');
          }
        })
        .catch(() => {
          hideLoader();
          showSnackbar(`Location ${mode === 'edit' ? 'updation' : 'creation'} failed!`, 'error');
          clearAndCloseDialog();
        });
    } else {
      showSnackbar('Please fill required fields!', 'error');
    }
  };

  const clearAndCloseDialog = () => {
    setErrors({});
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={clearAndCloseDialog}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative", backgroundColor: "primary.lighter" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={clearAndCloseDialog}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h5">
            {mode === "edit" ? "Edit Location" : "Create Location"}
          </Typography>
          <Button variant="contained" onClick={saveButtonOnClick}>
            <SaveAsIcon fontSize="small" sx={{ mr: 1 }} /> Save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <TextField
          label="Location Name*"
          value={locationDTO.locationName}
          onChange={(e) =>
            setLocationDTO({ ...locationDTO, locationName: e.target.value })
          }
          error={!!errors.locationName}
          helperText={errors.locationName}
          size="small"
          sx={{ width: 300 }}
        />

        <TextField
          multiline
          rows={2}
          label="Address*"
          value={locationDTO.address}
          onChange={(e) =>
            setLocationDTO({ ...locationDTO, address: e.target.value })
          }
          error={!!errors.address}
          helperText={errors.address}
          size="small"
          sx={{ width: 300 }}
        />

        <TextField
          select
          label="State*"
          value={locationDTO.stateId}
          onChange={(e) => {
            //getDistrictLisByStateId(e.target.value)
            setLocationDTO({
              ...locationDTO,
              districtId: null,
              stateId: e.target.value,
            })
          }}
          error={!!errors.stateId}
          helperText={errors.stateId}
          size="small"
          sx={{ width: 300 }}
        >
          {stateList.map((state) => (
            <MenuItem key={state.stateId} value={state.stateId}>
              {state.stateName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          disabled={!locationDTO?.stateId}
          label="District*"
          value={locationDTO.districtId}
          onChange={(e) =>
            setLocationDTO({ ...locationDTO, districtId: e.target.value })
          }
          error={!!errors.districtId}
          helperText={errors.districtId}
          size="small"
          sx={{ width: 300 }}
        >
          {districtList
            .filter((d) => d.stateId === locationDTO.stateId)
            .map((district) => (
              <MenuItem key={district.districtId} value={district.districtId}>
                {district.districtName}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          label="Pincode*"
          value={locationDTO.pincode}
          onChange={(e) =>
            setLocationDTO({ ...locationDTO, pincode: e.target.value })
          }
          error={!!errors.pincode}
          helperText={errors.pincode}
          size="small"
          sx={{ width: 300 }}
        />

        <Autocomplete
          multiple
          options={locationTypeList}
          getOptionLabel={(option) => option.locationTypeName}
          value={locationTypeList.filter((lt) =>
            locationDTO.locationTypeIds.includes(lt.locationTypeId)
          )}
          onChange={(e, selectedOptions) =>
            setLocationDTO({
              ...locationDTO,
              locationTypeIds: selectedOptions.map((lt) => lt.locationTypeId),
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Location Types*"
              error={!!errors.locationTypeIds}
              helperText={errors.locationTypeIds}
              size="small"
              sx={{ width: 300 }}
            />
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateEditLocationDialog;
