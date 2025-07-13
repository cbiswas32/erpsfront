import React, { useEffect, useState } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import { useUI } from '../context/UIContext';
import { getUserLocationMappingsService } from '../services/userLocationServices';
import UserLocationMappingTable from '../features/user-location-mapping/UserLocationMappingTable';
import CreateEditUserLocationMappingDialog from '../features/user-location-mapping/CreateEditUserLocationMappingDialog';
import { fetchUserListService } from '../services/userServices';
import { getAllLocationListService } from '../services/locationService';
import { getAcceessMatrix } from '../utils/loginUtil';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

function UserLocationMapping() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [mappingList, setMappingList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState('create');
  const [currentUser, setCurrentUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [accessMatrix, setAccessMatrix] = useState({});

  const handleOpenCreateDialog = () => {
    setMode('create');
    setCurrentUser(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchUserLocationMapping = () => {
    showLoader();
    getUserLocationMappingsService()
      .then(res => {
        setMappingList(res || []);
        hideLoader();
      })
      .catch(() => {
        showSnackbar('Failed to fetch mappings', 'error');
        hideLoader();
      });
  };

  const fetchUserAndLocationData = async () => {
    try {
      const [usersRes, locations] = await Promise.all([
        fetchUserListService(),
        getAllLocationListService()
      ]);
      setUserList(usersRes?.responseObject || []);
      setLocationList(locations || []);
    } catch (error) {
      showSnackbar('Failed to load user/location data', 'error');
    }
  };

  useEffect(() => {
    let access = getAcceessMatrix('Location Management', 'User Location Map');
    setAccessMatrix(access);
    fetchUserLocationMapping();
    fetchUserAndLocationData();
  }, []);

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Map User to Locations',
      buttonCallback: handleOpenCreateDialog,
      buttonIcon: <AddIcon fontSize='small' />,
      access: accessMatrix?.create ?? false,
    }
  ];

  return (
    <PageWrapper title="User-Location Mapping" actionButtons={ActionButtonsArr}>
      <Box sx={{ m: 2 }} />
      <UserLocationMappingTable
        mappingList={mappingList}
        openEditDialog={(user) => {
          setMode('edit');
          setCurrentUser(user);
          setOpenDialog(true);
        }}
      />
      <CreateEditUserLocationMappingDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        userList={userList}
        locationList={locationList}
        mode={mode}
        currentUser={currentUser}
        refreshList={fetchUserLocationMapping}
      />
    </PageWrapper>
  );
}

export default UserLocationMapping;
