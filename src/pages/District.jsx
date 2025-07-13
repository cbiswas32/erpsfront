import React, {useEffect, useState} from 'react';
import PageWrapper from '../layouts/PageWrapper';
import DistrictTable from '../features/district/DistrictTable';
import {useUI} from '../context/UIContext';
import {getDistrictListService} from '../services/districtServices';
import {getStateListService} from '../services/stateServices'
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete"; 
import TextField from "@mui/material/TextField";
import CreateEditDistrictDialog from '../features/district/CreateEditDistrictDialog';
import { getAcceessMatrix } from '../utils/loginUtil';
import AddIcon from '@mui/icons-material/Add';


function District() {
    const { showSnackbar, showLoader, hideLoader } = useUI()
    const [districtList, setDistrictList] = useState([]);
    const [filteredDistrictList, setFilteredDistrictList] = useState([]);
    const [stateDropDown, setStateDropDown] = useState([]);
    const [selectedState, setSelectedState] = useState({ label: 'All State', id: 0 });
    const [openDialog, setOpenDialog] = useState(false);
    const [mode, setMode] = useState('edit');
    const [currentItemForEdit, setCurrentItemForEdit] = useState(null);
    const [accessMatrix, setAccessMatrix] = useState({});

    const onClickEdit = (districtObj) => {
      setCurrentItemForEdit(districtObj)
      setOpenDialog(true)
      setMode('edit')
    }

     const handleCloseDialog = () =>{
        setOpenDialog(false)
      }
     const handleOpenCreateDialog = () =>{
      setMode('create')
        setOpenDialog(true)
        setCurrentItemForEdit({})
      }


     useEffect(()=>{
          let access = getAcceessMatrix('Location Management', 'District')
          console.log('Location Management', 'Zone', access)
          setAccessMatrix(access)
        },[])

    useEffect(()=>{
      getStateListAPICall()
    },[])

    const getStateListAPICall = (hideSnackbar) => {
      //showLoader()
      getStateListService().then(res => {
        if(res){
          let dropdownArray = [{ label: 'All State', id: 0 }]
          res?.forEach(x=>{
            let curr =  {
              label: x.stateName,
              id: x.stateId
            }
            dropdownArray.push(curr)
          })
        
          setStateDropDown(dropdownArray)
        }
        else{
          
          !hideSnackbar && showSnackbar('Failed to fetch state list!', 'error' )
          setStateDropDown([])
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
          if(selectedState?.id === 0){
            setFilteredDistrictList(res)
          }
          else{
             let filterlist =  res?.filter(x => x.stateId === selectedState?.id)
             setFilteredDistrictList(filterlist)
          }
         
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
      
      let filterDistrict = districtList?.filter(x => x.stateId == stateId)
      setFilteredDistrictList(filterDistrict)
     
    }

     const ActionButtonsArr = [
          {
            "showHeaderButton": true,
            "buttonText": "Create New District",
            "buttonCallback": handleOpenCreateDialog,
            "buttonIcon": <AddIcon fontSize='small' />,
            "access": accessMatrix?.create ?? false
          }
        ]
   
  
    return (
        <PageWrapper title={"District"} actionButtons={ActionButtonsArr} >
            <Box sx={
              {
                m:2,
                display: 'flex',
                flexDirection: {
                  xs: 'column', 
                  sm: 'column', 
                  md: 'row',
                  lg: 'row'    
                },
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
              }
            }>
              <Autocomplete
                disablePortal
                value={selectedState}
                options={stateDropDown}
                onChange={(e, newValue) => {
                  setSelectedState(newValue)
                  if(newValue && newValue?.id != 0){
                    getDistrictLisByStateId(newValue?.id)
                  }
                  else{
                    setFilteredDistrictList(districtList)
                  }
                 
                }}
                sx={
                  {
                    minWidth: 280
                  }
                }
                renderInput={(params) => <TextField {...params}  size="small" placeholder='Select State' label="Filter by State*" slotProps={{
                  inputLabel : {
                      shrink: true
                  },}} />}
              />
              
            </Box>
            <DistrictTable  districtList={filteredDistrictList} getDistrictListAPICall={getDistrictListAPICall} onClickEdit={onClickEdit}/>
            <CreateEditDistrictDialog open={openDialog} handleClose={handleCloseDialog} mode={mode} getDistrictListAPICall={getDistrictListAPICall} currentItemForEdit={currentItemForEdit} stateList={stateDropDown} districtList={districtList}/>
        </PageWrapper>
    );
}

export default District;