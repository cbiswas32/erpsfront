import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useUI } from '../../context/UIContext';
import { saveOrUpdateUserLocationMappingService } from '../../services/userLocationServices';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateEditUserLocationMappingDialog({
  open,
  handleClose,
  mode,
  userList = [],
  locationList,
  currentUser,
  refreshList
}) {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    if (mode === 'edit' && currentUser) {
      const user = userList.find(u => u.loginId === currentUser.loginId);
      setSelectedUser(user || null);
      setSelectedLocations(
        locationList.filter(loc => currentUser.locations?.includes(loc.locationName))
      );
    } else {
      setSelectedUser(null);
      setSelectedLocations([]);
    }
    console.log("User", userList)
  }, [mode, currentUser, userList, locationList, open]);

  const onSave = async () => {
    if (!selectedUser || selectedLocations.length === 0) {
      showSnackbar('User and at least one Location are required', 'error');
      return;
    }

    const dto = {
      userId: selectedUser.userId,
      locationIds: selectedLocations.map(loc => loc.locationId)
    };

    showLoader();
    try {
      const res = await saveOrUpdateUserLocationMappingService(dto);
      hideLoader();

      if (res?.status) {
        showSnackbar('Mapping saved successfully', 'success');
        refreshList();
        handleClose();
      } else {
        showSnackbar(res?.message || 'Failed to save mapping', 'error');
      }
    } catch (err) {
      hideLoader();
      showSnackbar('Error saving mapping', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative', backgroundColor: 'primary.lighter' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            {mode === 'edit' ? 'Edit User-Location Mapping' : 'Map User to Locations'}
          </Typography>
          <Button autoFocus color="inherit" onClick={onSave} variant="contained">
            <SaveAsIcon fontSize="small" sx={{ mr: 1 }} /> Save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3 }}>
        <Autocomplete
          disabled={mode === 'edit'}
          options={userList || []}
          value={selectedUser}
          getOptionLabel={(option) => ` ${option.userFirstname} ${option.userLastname} - ${option.loginId} (${option.roleDescription})`}
          onChange={(e, newValue) => setSelectedUser(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select User *" size="small" fullWidth />
          )}
        />
        <Autocomplete
          multiple
          options={locationList}
          value={selectedLocations}
          getOptionLabel={(option) => option.locationName}
          onChange={(e, newValue) => setSelectedLocations(newValue)}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              {option.locationName}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Select Locations *" size="small" fullWidth sx={{ mt: 2 }} />
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateEditUserLocationMappingDialog;
