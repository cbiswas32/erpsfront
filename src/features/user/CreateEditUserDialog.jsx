import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ShowKeyValueView from '../../components/ShowKeyValueView';
import { useUI } from '../../context/UIContext';
import { getRoleListService, createUpdateUserService, getManagerList } from '../../services/userServices';
import { getZoneListService } from '../../services/zoneServices';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid2 from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});


const skipManagerDetailsRoleIds = [1, 2, 3] // 1: Admin, 2: PD, 3: PM

function CreateEditUserDialog({ open, handleClose, mode, currentItemForEdit, getUserListAPICall }) {
    const [userRole, setUserRole] = useState(null)
    const [userId, setUserId] = useState(0)
    const [zone, setZone] = useState(null)
    const [branch, setBranch] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [middleName, setMiddleName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [primaryMobile, setPrimaryMobile] = useState(null)
    const [secondaryMobile, setSecondaryMobile] = useState(null)
    const [primaryEmail, setPrimaryEmail] = useState(null)
    const [alternativeEmail, setAlternativeEmail] = useState(null)
    const [loginId, setloginId] = useState(null)
    const [reportingManager, setReportingManager] = useState(null);
    const [functionalManager, setFunctionalManager] = useState(null);
    const [roleList, setRoleList] = useState([])
    const [zoneList, setZoneList] = useState([])
    const [managerList , setManagerList ] = useState([])
    const [errors, setErrors] = useState({});
    const { showSnackbar, showLoader, hideLoader } = useUI()
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


    const getRoleListAPICall = (hideSnackbar) => {
        showLoader()
        getRoleListService().then(res => {
            if (res && res.status && res.responseObject && res.responseObject.length > 0) {
                let modList = res.responseObject?.filter(x => x.roleMasterId != 1 && x.roleMasterId != 2)?.map((item) => {
                    return { label: item.roleDescription, id: item.roleMasterId }
                }) || []
                setRoleList(modList)
                !hideSnackbar && showSnackbar('User Role list fetched successfully!', 'success')
            }
            else {
                showSnackbar('No User Role found!', 'warning')
                setRoleList([])
            }

            hideLoader()
        }).catch(error => {
            console.log("Error in Fetching User Role List!", error);
            hideLoader();
            showSnackbar('Failed to fetch user role list!', 'error')
            setUserRole([])
        })
    }

    const createEditUserAPI = () => {
        let userDto = {}
        let zoneListArr = []
        // if(zone?.id === 0){
        //     zoneListArr = zoneList?.filter(x =>  x.id != 0)?.map((item) => {
        //         const obj = {
        //             zoneId: item.id
        //           };
              
        //           if (userRole?.id && !skipManagerDetailsRoleIds?.includes(userRole.id)) {
        //             obj.reportingManagerId = reportingManager?.id;
        //             obj.functionalManagerId = functionalManager?.id;
        //           }
              
        //           return obj;
        //     }) || []
        // }
        // else{
        //     if(zone?.id){
        //         zoneListArr = zoneList?.filter(x =>  x.id != 0 && x.id === zone.id )?.map((item) => {
        //             const obj = {
        //                 zoneId: item.id
        //               };
                  
        //               if (userRole?.id && !skipManagerDetailsRoleIds?.includes(userRole.id)) {
        //                 obj.reportingManagerId = reportingManager?.id;
        //                 obj.functionalManagerId = functionalManager?.id;
        //               }
                  
        //               return obj;
        //         }) || []
        //     }
        // }

        if (mode === 'create') {
            
            userDto = {
                "userId": 0,
                "roleMasterId": userRole?.id,
                "zoneList": zoneListArr,
                "userFirstName": firstName,
                "userMiddleName": middleName,
                "userLastName": lastName,
                "mobileNumber": primaryMobile,
                "mobileNumberSecondary": secondaryMobile,
                "email": primaryEmail,
                "emailSecondary": alternativeEmail,
                "loginId": "FRNM" + loginId,
                "userActiveFlag": 'Y'
            }
        }
        else if (mode === 'edit') {
            userDto = {
                "userId": userId,
                "roleMasterId": userRole?.id,
                "zoneList": zoneListArr,
                "userFirstName": firstName,
                "userMiddleName": middleName,
                "userLastName": lastName,
                "mobileNumber": primaryMobile,
                "mobileNumberSecondary": secondaryMobile,
                "email": primaryEmail,
                "emailSecondary": alternativeEmail,
                "loginId": "FRNM" + loginId,
                "userActiveFlag": 'Y'
            }
        }
        showLoader();
        createUpdateUserService(userDto).then(res => {
            if (res.status) {
                showSnackbar(`User ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');
                hideLoader();
                clearAndCloseDialog()
                getUserListAPICall(true)
            }
            else {
                hideLoader()
                showSnackbar(res.message, 'error')
            }
            let hideUserListAPISnackBar = true

            handleClose();
        }).catch(error => {
            hideLoader()
            console.log("Error in Creating/Updating User!", error);
            showSnackbar(`User ${mode === 'edit' ? 'updation' : 'creation'} failed!`, 'error')


        })
    }

    const getManagerListAPICall = (role) => {
        showLoader() 
        if (!role || !role?.id) {
            setManagerList([])
            showSnackbar('Please select user role first!', 'warning')
            hideLoader()
            return
        }
        getManagerList(role?.id).then(res => {
            if (res && res.status && res.responseObject && res.responseObject.length > 0) {
                let modList = res.responseObject?.map((item) => {
                    return { label: [item?.userFirstName, item?.userMiddleName, item?.userLastName].filter(Boolean).join(" ") , id: item.userId, zoneList: item.zoneList }
                }) || []
                setManagerList(modList)
                //showSnackbar('Manager list fetched successfully!', 'success')
            }
            else {
                showSnackbar('No Manager found!', 'warning')
                setManagerList([])
            }
            hideLoader()
        }).catch(error => {
            console.log("Error in Fetching Manager List!", error);
            hideLoader();
            showSnackbar('Failed to fetch manager list!', 'error')
            setManagerList([])
        })
    }


    useEffect(() => {
        if (open) {
             getRoleListAPICall(true)
            // getZoneListAPICall(true)

            if (mode === 'create') {
                setUserRole(null)
                setZone(null)
                setFirstName('')
                setMiddleName('')
                setLastName('')
                setPrimaryMobile('')
                setSecondaryMobile('')
                setPrimaryEmail('')
                setAlternativeEmail('')
                setloginId('')
                setReportingManager(null)
                setFunctionalManager(null)
            }
            else if (mode === 'edit' || mode === 'view') {
                if (!currentItemForEdit) {
                    showSnackbar('Something went wrong! No User found!', 'warning')
                    clearAndCloseDialog()
                    return

                }

                setUserId(currentItemForEdit?.userId)
                console.log("Current Item For Edit", { label: currentItemForEdit?.roleDescription, id: currentItemForEdit?.roleId })
                setUserRole(currentItemForEdit?.roleDescripton && currentItemForEdit?.roleId ? { label: currentItemForEdit?.roleDescripton, id: currentItemForEdit?.roleId } : null)
                if (currentItemForEdit?.zoneIdList?.length > 0) {
                    if (currentItemForEdit.zoneIdList.length > 1) {
                        setZone({ label: "All Zone", id: 0 });
                    } else {
                        setZone({
                            label: currentItemForEdit.zoneNameList[0],
                            id: currentItemForEdit.zoneIdList[0]
                        });
                    }
                } else {
                    setZone(null);
                }
                setFirstName(currentItemForEdit?.userFirstName)
                setMiddleName(currentItemForEdit?.userMiddleName)
                setLastName(currentItemForEdit?.userLastName)
                setPrimaryMobile(currentItemForEdit?.mobileNumber)
                setSecondaryMobile(currentItemForEdit?.mobileNumberSecondary)
                setPrimaryEmail(currentItemForEdit?.primaryEmail)
                setAlternativeEmail(currentItemForEdit?.emailSecondary)
                setloginId(currentItemForEdit?.loginId?.slice(4))
                // if(currentItemForEdit?.roleId && !skipManagerDetailsRoleIds?.includes(currentItemForEdit?.roleId)){
                //     getManagerListAPICall({ id: currentItemForEdit?.roleId })
                // }
                // setReportingManager(currentItemForEdit?.reportingManagerId && currentItemForEdit?.reportingManagerFirstName ? { label: [currentItemForEdit?.reportingManagerFirstName,  currentItemForEdit?.reportingManagerLastName].filter(Boolean).join(" "), id: currentItemForEdit?.reportingManagerId } : null)
                // setFunctionalManager(currentItemForEdit?.functionalManagerId && currentItemForEdit?.functionalManagerFirstName ? { label: [currentItemForEdit?.functionalManagerFirstName, currentItemForEdit?.functionalManagerLastName].filter(Boolean).join(" "), id: currentItemForEdit?.functionalManagerId } : null)
                // setBranch(currentItemForEdit?.branchName && currentItemForEdit?.branchId ? { label: currentItemForEdit?.branchName, id: currentItemForEdit?.branchId } : null)
                // reporting manager and functional manager
            }

        }
    }, [open])

    const clearAndCloseDialog = () => {
        setUserRole(null)
        setZone(null)
        setFirstName('')
        setMiddleName('')
        setLastName('')
        setPrimaryMobile('')
        setSecondaryMobile('')
        setPrimaryEmail('')
        setAlternativeEmail('')
        setloginId('')
        setReportingManager(null)
        setFunctionalManager(null)  
        setErrors({})
        handleClose()

    }


    const validate = () => {
        const newErrors = {};

        if (!userRole) newErrors.userRole = 'Role is required';
        //if (!zone) newErrors.zone = 'Zone is required';
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';

        if (!primaryMobile || !/^\d{10}$/.test(primaryMobile)) {
            newErrors.primaryMobile = 'Enter a valid 10-digit mobile number';
        }

        if (secondaryMobile && !/^\d{10}$/.test(secondaryMobile)) {
            newErrors.secondaryMobile = 'Enter a valid 10-digit mobile number';
        }

        if (!primaryEmail || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(primaryEmail)) {
            newErrors.primaryEmail = 'Enter a valid email address';
          
        }
       
     

        if (alternativeEmail && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(alternativeEmail)) {
            newErrors.alternativeEmail = 'Enter a valid email address';
           
        }

        if (!loginId || !/^\d{6}$/.test(loginId)) {
            newErrors.loginId = 'Login ID must be exactly 6 digits';
        }
        // if (userRole  && userRole?.id && !skipManagerDetailsRoleIds.includes(userRole?.id) && !reportingManager?.id) {
        //     newErrors.reportingManager = 'Reporting Manager is required';
        // }
        // if ( userRole  && userRole?.id && !skipManagerDetailsRoleIds.includes(userRole?.id) && !functionalManager?.id) {
        //     newErrors.functionalManager = 'Functional Manager is required';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveUserOnClick = () => {
        if (!validate()) {
            showSnackbar('Please correct the errors before saving', 'error')
            return;
        }
        createEditUserAPI()



    }


    return (
        <Dialog

            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: 'primary.lighter' }}>
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='inherit'
                        onClick={clearAndCloseDialog}
                        aria-label='close'
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant='h5' component='div'>
                        {mode === 'view' ? 'View User' : mode === 'edit' ? 'Edit User' : 'Create User'}
                    </Typography>
                    {mode != 'view' && <Button autoFocus variant='contained' onClick={saveUserOnClick}>
                        <SaveAsIcon fontSize='small' sx={{ mr: 1 }} />Save
                    </Button>}
                </Toolbar>
            </AppBar>
            <DialogContent sx={{

                minHeight: '100px',
                minWidth: { xs: "100%", sm: "100%", md: "400px" }
            }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <AccountBoxIcon sx={{ mr: 1 }} /> User Details
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2, pt: 0 }}>
                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='First Name' value={firstName} /> :
                            <TextField
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                }}
                                size='small'
                                label='First Name*'
                                placeholder='Enter first name'
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                sx={{ width: 200 }}
                            />}
                    </Paper>
                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Middle Name' value={middleName} /> :
                            <TextField
                                value={middleName}
                                onChange={(e) => {
                                    setMiddleName(e.target.value)
                                }}
                                size='small'
                                label='Middle Name'
                                placeholder='Enter middle name'
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                error={!!errors.middleName}
                                helperText={errors.middleName}
                                sx={{ width: 200 }}
                            />}
                    </Paper>
                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Last Name' value={lastName} /> :
                            <TextField
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                }}
                                size='small'
                                label='Last Name*'
                                placeholder='Enter last name'
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                sx={{ width: 200 }}
                            />}
                    </Paper>


                    


                    <Paper elevation={0}>{mode === 'view' ?
                        <ShowKeyValueView title='Login Id' value={loginId} /> :
                        <TextField
                            value={loginId}
                            onChange={(e) => {
                                setloginId(e.target.value)
                            }}
                            size='small'
                            name='disable-autocomplete-login-id'
                            label='Login Id*'
                            id='outlined-start-adornment'
                            autoComplete='new-password'
                            sx={{ width: 200 }}
                            error={!!errors.loginId}
                            helperText={errors.loginId}
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position='start'>FRNM</InputAdornment>,
                                },
                            }}
                        />}
                    </Paper>

                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Role' value={userRole?.label} /> :
                            <Autocomplete
                                disablePortal
                               
                                value={userRole}
                                options={roleList}
                                sx={{ width: 200 }}
                                onChange={(e, newValue) => {
                                    setUserRole(newValue)
                                    // setReportingManager(null)
                                    // setFunctionalManager(null)
                                    // if(newValue && newValue?.id && skipManagerDetailsRoleIds?.includes(newValue?.id)){ 
                                    //   setZone({label: "All Zone", id: 0})
                                    //   setManagerList([])
                                    // }
                                    // else{
                                    //     setZone(null)
                                    // }
                                    // if(newValue && newValue?.id && !skipManagerDetailsRoleIds?.includes(newValue?.id)){ 
                                    //     getManagerListAPICall(newValue)
                                    // }
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small'
                                        placeholder='Select Role'
                                        label='User Role*'
                                        error={!!errors.userRole}
                                        helperText={errors.userRole}
                                        slotProps={{
                                            inputLabel: { shrink: true },
                                        }}
                                    />
                                )}
                            />}
                    </Paper>

                    {/* <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Zone' value={zone?.label} /> :
                            <Autocomplete
                                disabled={userRole?.id && skipManagerDetailsRoleIds?.includes(userRole?.id)}
                                disablePortal
                                value={zone}
                                onChange={(e, newValue) => {
                                    setZone(newValue)
                                }}
                                options={skipManagerDetailsRoleIds.includes(userRole?.id) ? zoneList : zoneList?.slice(1) }
                                sx={{ width: 200 }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small'
                                        error={!!errors.zone}
                                        helperText={errors.zone}
                                        placeholder='Select Zone'
                                        label='Zone*'
                                        slotProps={{
                                            inputLabel: { shrink: true },
                                        }}
                                    />
                                )}
                            />}
                    </Paper> */}

                    {/*userRole && userRole?.id && ![1,2, 3]?.includes(userRole?.id) && <Paper elevation={0}>
                       
                        {mode === 'view' ? (
                            <ShowKeyValueView title="Reporting Manager" value={reportingManager?.label} />
                        ) : (
                            <Autocomplete
                                disablePortal
                                disabled={!userRole}
                                value={reportingManager}
                                options={managerList}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <div>
                                            <strong>{option.label}</strong>
                                            <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 2 }}>
                                                {option.zoneList?.length > 1 ?  <div>All Zone</div> : option.zoneList?.map((zone, index) => (
                                                    <div key={index}>{zone.zoneName}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </li>
                                  )}
                                sx={{ width: 200 }}
                                onChange={(e, newValue) => {
                                    setReportingManager(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select Reporting Manager"
                                        label="Reporting Manager*"
                                        error={!!errors.reportingManager}
                                        helperText={errors.reportingManager}
                                        slotProps={{
                                            inputLabel: { shrink: true },
                                        }}
                                    />
                                )}
                            />
                        )}
                    </Paper> */}

                    {/* userRole && userRole?.id && !skipManagerDetailsRoleIds?.includes(userRole?.id) &&<Paper elevation={0} >
                     
                        {mode === 'view' ? (
                            <ShowKeyValueView title="Functional Manager" value={functionalManager?.label} />
                        ) : (
                            <Autocomplete
                                disablePortal
                                disabled={!userRole}
                                value={functionalManager}
                                options={managerList}
                                sx={{ width: 200 }}
                                onChange={(e, newValue) => {
                                    setFunctionalManager(newValue);
                                }}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <div>
                                            <strong>{option.label}</strong>
                                            <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 2 }}>
                                                {option.zoneList?.length > 1 ?  <div>All Zone</div> : option.zoneList?.map((zone, index) => (
                                                    <div key={index}>{zone.zoneName}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </li>
                                  )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select Functional Manager"
                                        label="Functional Manager*"
                                        error={!!errors.functionalManager}
                                        helperText={errors.functionalManager}
                                        slotProps={{
                                            inputLabel: { shrink: true },
                                        }}
                                    />
                                )}
                            />
                        ) */}
 
                </Box>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <ContactMailIcon sx={{ mr: 1 }} /> Contact Details
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                </Box>


                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2, pt: 0 }}>

                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Primary Mobile No.' value={primaryMobile} /> :
                            <TextField
                                value={primaryMobile}
                                onChange={(e) => {
                                    setPrimaryMobile(e.target.value)
                                }}
                                size='small'
                                label='Primary Mobile No.*'
                                placeholder='Enter primary mobile no'
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                error={!!errors.primaryMobile}
                                helperText={errors.primaryMobile}
                                sx={{ width: 200 }}
                            />}
                    </Paper>
                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Secondary Mobile No.' value={secondaryMobile} /> :
                            <TextField
                                value={secondaryMobile}
                                onChange={(e) => {
                                    setSecondaryMobile(e.target.value)
                                }}
                                size='small'
                                label='Secondary Mobile No.'
                                placeholder='Enter secondary mobile no'
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                error={!!errors.secondaryMobile}
                                helperText={errors.secondaryMobile}
                                sx={{ width: 200 }}
                            />}
                    </Paper>
                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Primary Email' value={primaryEmail} /> :
                            <TextField
                                value={primaryEmail}
                                onChange={(e) => {
                                    setPrimaryEmail(e.target.value)
                                }}
                                size='small'
                                label='Primary Email*'
                                placeholder='Enter primary email'
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                error={!!errors.primaryEmail}
                                helperText={errors.primaryEmail}
                                sx={{ width: 200 }}
                            />}
                    </Paper>
                    <Paper elevation={0}>
                        {mode === 'view' ?
                            <ShowKeyValueView title='Alternative Email' value={alternativeEmail} /> :
                            <TextField
                                value={alternativeEmail}
                                onChange={(e) => {
                                    setAlternativeEmail(e.target.value)
                                }}
                                size='small'
                                label='Alternative Email'
                                placeholder='Enter alternative email'
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                error={!!errors.alternativeEmail}
                                helperText={errors.alternativeEmail}
                                sx={{ width: 200 }}
                            />}
                    </Paper>

                </Box>

                {/* 
                <Grid container justifyContent={'center'} spacing={3}>


                    <Grid xs={12} md={6} lg={4} xl={4}>
                        <Paper elevation={0}>
                            {mode === 'view' ?
                                <ShowKeyValueView title='Branch' value={branch} /> :
                                <Autocomplete
                                    disablePortal
                                    value={branch}
                                    onChange={(e, newValue) => {
                                        setBranch(newValue)
                                    }}
                                    options={branchList}
                                    sx={{ width: 200 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size='small'
                                            placeholder='Select Branch'
                                            label='Branch*'
                                            slotProps={{
                                                inputLabel: { shrink: true },
                                            }}
                                        />
                                    )}
                                />}
                        </Paper>
                    </Grid>




                </Grid> */}

            </DialogContent>

        </Dialog>
    );
}

export default CreateEditUserDialog;