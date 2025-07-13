import React, { useState, useEffect } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CreateEditUserDialog from '../features/user/CreateEditUserDialog';
import { fetchUserListService } from '../services/userServices';
import { useUI } from '../context/UIContext';
import UserListTable from '../features/user/UserListTable';
import { getAcceessMatrix } from '../utils/loginUtil';
import { getZoneListService } from '../services/zoneServices';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { resetPasswordByAdminService } from '../services/authenticationServices';


function User() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [accessMatrix, setAccessMatrix] = useState({})
  const [zoneList, setZoneList] = useState([])
  const [selectedZone, setSelectedZone] = useState({ label: 'All Zone', id: 0 })
  const [filteredUserList, setFilteredUserList] = useState([]);

  const [openResetPasswordConfirmationDialog, setOpenResetPasswordConfirmationDialog] = useState(false)

  const [currentItemForEdit, setCurrentItemForEdit] = useState(null);
  
  useEffect(() => {
    if (!selectedZone || selectedZone?.id === 0) {
      setFilteredUserList(userList);
    } else {
      const filtered = userList.filter((user) => {
        let zoneIdList =  user?.zoneList?.map(x=>x.zoneId) || []
        return zoneIdList?.includes(selectedZone?.id)
      }
       
      );
      setFilteredUserList(filtered);
    }
  }, [selectedZone, userList]);
  

  const getZoneListAPICall = (hideSnackbar) => {
    showLoader()
    getZoneListService().then(res => {
      if (res) {
        let modList = res?.map((item) => {
          return { label: item.zoneName, id: item.zoneId }
        }) || []
        modList.unshift({ label: 'All Zone', id: 0 })
        setZoneList(modList)
        !hideSnackbar && showSnackbar('Zone list fetched successfully!', 'success')
      }
      else {

        !hideSnackbar && showSnackbar('Zone List is Empty!', 'warning')
        setZoneList([])
      }
      hideLoader()
    }).catch(error => {
      console.log("Error in Fetching Zone List!", error);
      hideLoader();
      setZoneList([])
      !hideSnackbar && showSnackbar('Failed to fetch zone list!', 'error')
    })

  }

 
  const getUserListAPICall = (hideSnackbar) => {
    showLoader()
    fetchUserListService().then(res => {
      console.log("User List Response", res)
      if (res && res.status && res.responseObject) {
        setUserList(res.responseObject)
        !hideSnackbar && showSnackbar('User list fetched successfully!', 'success')
      }
      else {

        !hideSnackbar && showSnackbar('No User found!', 'warning')
        setUserList([])
      }
      hideLoader()
    }).catch(error => {
      console.log("Error in Fetching User List!", error);
      hideLoader();
      !hideSnackbar && showSnackbar('Failed to fetch user list!', 'error')
      setUserList([])
    })
  }

  useEffect(() => {
    //getZoneListAPICall(true)
    let access = getAcceessMatrix('System Administration', 'User Management')
    console.log('System Administration', 'User Management', access)
    setAccessMatrix(access)
  }, [])
  const onCreateClick = () => {
    setSelectedMode('create')
    setOpenUserDialog(true);
  }

  const handleResetPassword = () => {
    showLoader()
    let userId = currentItemForEdit?.userId
    if(!userId){
      showSnackbar('User ID not found!', 'error')
      return
    }
    resetPasswordByAdminService(userId).then(res => {
      if (res && res.status) {
        showSnackbar('Password reset successfully!', 'success')
        hideLoader()
      }
      else {
        hideLoader()
        showSnackbar(res.message, 'error')
      }
      setOpenResetPasswordConfirmationDialog
  }).catch(error => {
      hideLoader()
      console.log(error)
      showSnackbar('Failed to reset password!', 'error')
    }).finally(() => {
      setOpenResetPasswordConfirmationDialog(false)
      
    })
  }




  const handleCloseUserDialog = () => {
    setOpenUserDialog(false)
  }

  const HeaderActionButtons = [
    {
      "showHeaderButton": true,
      "buttonText": "Create New User",
      "buttonCallback": onCreateClick,
      "access": accessMatrix?.create ?? false,
      "buttonIcon": <PersonAddIcon fontSize='small' />
    }
  ]

  return (
    <PageWrapper title={"User"} actionButtons={HeaderActionButtons}>
      <Box sx={
        {
          m: 2,
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
        {/* <Autocomplete
          disablePortal
          value={selectedZone}
          options={zoneList}
          onChange={(event, newValue) => {
            setSelectedZone(newValue)
          }}
          sx={
            {
              minWidth: 200
            }
          }
          renderInput={(params) => <TextField {...params} size="small" placeholder='Select Zone' label="Zone*" slotProps={{
            inputLabel: {
              shrink: true
            },
          }} />}
        /> */}
        {/* <Autocomplete
              disablePortal
              value={{ label: 'All Branch', id: 0 }}
              options={branchList}
              sx={
                {
                  minWidth: 200
                }
              }
              renderInput={(params) => <TextField {...params}  size="small" placeholder='Select Branch' label="Branch*" slotProps={{
                inputLabel : {
                    shrink: true
                },}} />}
            /> */}
        {/* <Button variant='contained'>Get Details</Button> */}
      </Box>

      <UserListTable userList={filteredUserList} getUserListAPICall={getUserListAPICall} setSelectedMode={setSelectedMode} setOpenUserDialog={setOpenUserDialog} setCurrentItemForEdit={setCurrentItemForEdit} setOpenResetPasswordConfirmationDialog={setOpenResetPasswordConfirmationDialog}/>

      <CreateEditUserDialog open={openUserDialog} handleClose={handleCloseUserDialog} mode={selectedMode} getZoneListAPICall={getZoneListAPICall} currentItemForEdit={currentItemForEdit} getUserListAPICall={getUserListAPICall}/>
    <ConfirmationDialog openDialog={openResetPasswordConfirmationDialog} dialogText = {"Do you want to reset password?"} handleClose ={()=> {setOpenResetPasswordConfirmationDialog(false)}} aggreeFunction={handleResetPassword}/>
    </PageWrapper>
  );
}

export default User;