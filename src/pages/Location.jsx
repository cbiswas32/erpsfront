import React, { useEffect, useState } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import { useUI } from '../context/UIContext';
import { getAllLocationListService } from '../services/locationService';
import LocationTable from '../features/location/LocationTable';
import CreateEditLocationDialog from '../features/location/CreateEditLocationDialog';
import { getAcceessMatrix } from '../utils/loginUtil';
import AddIcon from '@mui/icons-material/Add';
import { getStateListService } from '../services/stateServices';
import { getDistrictListService } from '../services/districtServices';
import { getLocationTypeListService } from '../services/locationTypeServices';
import Box from '@mui/material/Box';

function Location() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [locationList, setLocationList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState('create');
  const [currentItemForEdit, setCurrentItemForEdit] = useState(null);
  const [accessMatrix, setAccessMatrix] = useState({});

  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [filteredDistrictList, setFilteredDistrictList] = useState([]);
  const [locationTypeList, setLocationTypeList] = useState([]);

  useEffect(() => {
    getStateListAPICall(true)
    getDistrictListAPICall(true)
    getLocationTypeListAPICall(true)
  }, [])
  
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

      const getStateListAPICall = (hideSnackbar) => {
        //showLoader()
        getStateListService().then(res => {
          if(res){
            // let dropdownArray = [{ label: 'All State', id: 0 }]
            // let dropdownArray = []
            // res?.forEach(x=>{
            //   let curr =  {
            //     label: x.stateName,
            //     id: x.stateId
            //   }
            //   dropdownArray.push(curr)
            // })
          
            setStateList(res)
          }
          else{
            
            !hideSnackbar && showSnackbar('Failed to fetch state list!', 'error' )
            setStateList([])
          }
          //hideLoader()
        }).catch(error => {
          console.log("Error in Fetching State List!", error);
          setStateDropDown([])
          //hideLoader();
          !hideSnackbar && showSnackbar('Failed to fetch state list!', 'error' )
        })
  
      }
  
      const getDistrictListAPICall = (hideSnackbar) => {
        showLoader()
        getDistrictListService().then(res => {
          if(res){
            setDistrictList(res)
          
            
           
            !hideSnackbar && showSnackbar('District list fetched successfully!', 'success' )
          }
          else{
            
            !hideSnackbar && showSnackbar('District List is Empty!', 'warning' )
            setDistrictList([])
            setFilteredDistrictList([])
          }
          hideLoader()
        }).catch(error => {
          console.log("Error in Fetching District List!", error);
          hideLoader();
          !hideSnackbar && showSnackbar('Failed to fetch District list!', 'error' )
        })
  
      }
  
      const getDistrictLisByStateId = (stateId) => {
        let dropdownArray = []
            districtList?.forEach(x=>{
              let curr =  {
                label: x.districtName,
                id: x.districtId,
                stateId: x.stateId
              }
              dropdownArray.push(curr)
            })
        
        let filterDistrict = dropdownArray?.filter(x => x.stateId == stateId)
        setFilteredDistrictList(filterDistrict)
       
      }
  





  const onClickEdit = (locationObj) => {
    setCurrentItemForEdit(locationObj);
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
    let access = getAcceessMatrix('Location Management', 'Location');
    setAccessMatrix(access);
  }, []);

  useEffect(() => {
    getLocationListAPICall();
  }, []);

  const getLocationListAPICall = (hideSnackbar) => {
    showLoader();
    getAllLocationListService()
      .then(res => {
        if (res && res.length > 0) {
          setLocationList(res);
          !hideSnackbar && showSnackbar('Locations fetched successfully!', 'success');
        } else {
          setLocationList([]);
          !hideSnackbar && showSnackbar('No Locations found!', 'warning');
        }
        hideLoader();
      })
      .catch(error => {
        console.error('Error fetching Locations!', error);
        setLocationList([]);
        hideLoader();
        !hideSnackbar && showSnackbar('Failed to fetch Locations!', 'error');
      });
  };

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Create New Location',
      buttonCallback: handleOpenCreateDialog,
      buttonIcon: <AddIcon fontSize='small' />,
      access: accessMatrix?.create ?? false,
    }
  ];

  return (
    <PageWrapper title={"Location"} actionButtons={ActionButtonsArr}>
      <Box sx={{ m: 2 }} />
      <LocationTable
        locationList={locationList}
        getLocationListAPICall={getLocationListAPICall}
        onClickEdit={onClickEdit}
      />
      <CreateEditLocationDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        mode={mode}
        currentItemForEdit={currentItemForEdit}
        getLocationListAPICall={getLocationListAPICall}
        stateList={stateList || []}
        districtList={districtList || []}
        locationTypeList={locationTypeList || []}
        getDistrictLisByStateId={getDistrictLisByStateId}
      />
    </PageWrapper>
  );
}

export default Location;
