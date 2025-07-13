import React, { useEffect, useState } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import { useUI } from '../context/UIContext';
import { getLocationTypeListService } from '../services/locationTypeServices';
import LocationTypeTable from '../features/location-type/LocationTypeTable';
import CreateEditLocationTypeDialog from '../features/location-type/CreateEditLocationTypeDialog';
import { getAcceessMatrix } from '../utils/loginUtil';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

function LocationType() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [locationTypeList, setLocationTypeList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState('create');
  const [currentItemForEdit, setCurrentItemForEdit] = useState(null);
  const [accessMatrix, setAccessMatrix] = useState({});

  const onClickEdit = (locationTypeObj) => {
    setCurrentItemForEdit(locationTypeObj);
    setMode('edit');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenCreateDialog = () => {
    setMode('create');
    setCurrentItemForEdit({});
    setOpenDialog(true);
  };

  useEffect(() => {
    let access = getAcceessMatrix('Location Management', 'Location Type');
    setAccessMatrix(access);
  }, []);

  useEffect(() => {
    getLocationTypeListAPICall();
  }, []);

  const getLocationTypeListAPICall = (hideSnackbar) => {
    showLoader();
    getLocationTypeListService()
      .then(res => {
        if (res) {
          setLocationTypeList(res);
          !hideSnackbar && showSnackbar('Location Types fetched successfully!', 'success');
        } else {
          !hideSnackbar && showSnackbar('No Location Types found!', 'warning');
          setLocationTypeList([]);
        }
        hideLoader();
      })
      .catch(error => {
        console.log("Error fetching Location Types!", error);
        hideLoader();
        !hideSnackbar && showSnackbar('Failed to fetch Location Types!', 'error');
        setLocationTypeList([]);
      });
  };

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Create New Location Type',
      buttonCallback: handleOpenCreateDialog,
      buttonIcon: <AddIcon fontSize='small' />,
      access: accessMatrix?.create ?? false,
    }
  ];

  return (
    <PageWrapper title={"Location Type"} actionButtons={ActionButtonsArr}>
      <Box sx={{ m: 2 }} />
      <LocationTypeTable
        locationTypeList={locationTypeList}
        getLocationTypeListAPICall={getLocationTypeListAPICall}
        onClickEdit={onClickEdit}
      />
      <CreateEditLocationTypeDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        mode={mode}
        getLocationTypeListAPICall={getLocationTypeListAPICall}
        currentItemForEdit={currentItemForEdit}
      />
    </PageWrapper>
  );
}

export default LocationType;
