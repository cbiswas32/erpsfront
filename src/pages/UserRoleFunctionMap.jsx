import React, { useState, useEffect } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { fetchFunctionsListService, fetchRoleMapDetailsService, fetchAccessTypeListService, saveRoleFunctionMapService } from '../services/userRoleFuntionMapServices';
import { useUI } from '../context/UIContext';
import { getAcceessMatrix } from '../utils/loginUtil';
import RoleFunctionAccordianTable from '../features/user-role-function-map/RoleFunctionAccordianTable';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useNavigate } from 'react-router-dom';

const UserRoleFunctionMap = () => {
  const { showSnackbar, showLoader, hideLoader } = useUI();

  const [accessMatrix, setAccessMatrix] = useState({});
  const [functionsList, setFunctionsList] = useState([]);
  const [roleMapDetails, setRoleMapDetails] = useState([]);
  const [accessTypeList, setAccessTypeList] = useState([]);
  const [mainMenuListDropDownList, setMainMenuListDropDownList] = useState([]);
  const [selectedMainMenu, setSelectedMainMenu] = useState(null);
  const [currentSubfunctionList, setCurrentSubfunctionList] = useState([]);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    showLoader();
    try {
      const [functionsRes, roleMapRes, accessTypeRes] = await Promise.all([
        fetchFunctionsListService(),
        fetchRoleMapDetailsService(),
        fetchAccessTypeListService()
      ]);

      if (functionsRes) {
        setFunctionsList(functionsRes || []);
      }

      if (roleMapRes) {
        setRoleMapDetails(roleMapRes || []);
      }

      if (accessTypeRes) {
        setAccessTypeList(accessTypeRes || []);
      }

      //showSnackbar("All data fetched successfully!", "success");
    } catch (error) {
      console.error("Error fetching user role mapping data:", error);
      showSnackbar("Failed to fetch user role mapping data!", "error");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    // Fetching functions list, role map details, and access type list on component mount
    fetchAllData();
    const access = getAcceessMatrix('System Administration', 'Access Management');
    setAccessMatrix(access);
  }, []);

  useEffect(() => {
    // Updating the DropDown Data
    console.log("functionsList", functionsList)
    let mainDropDown = functionsList?.map((item) => {
      return { id: item.mainFunctionId, label: item.mainFunctionName }
    }) || []
    setMainMenuListDropDownList(mainDropDown);

    // console.log("Functions List:", functionsList);
    console.log("Role Map Details:", roleMapDetails);
    // console.log("Access Type List:", accessTypeList);

  }, [functionsList, roleMapDetails, accessTypeList]);

  useEffect(() => {
  
    if (selectedMainMenu || selectedMainMenu?.id !== 0) {
      showLoader();
      let currMenuDetails = functionsList?.find((item) => item.mainFunctionId === selectedMainMenu?.id);
       // console.log("selectedMainMenu", currMenuDetails )
      if (currMenuDetails) {
        
        let modifiedSubFunctionList = currMenuDetails?.subFunctionList?.map((subFun) => {
          return {
            subFunctionId: subFun.subFunctionId,
            subFunctionName: subFun.subFunctionName,
            subFunctionSortOrder: subFun.subFunctionSortOrder,
            subFunctionActiveFlag: subFun.subFunctionActiveFlag,
            roleAccessDetails: getSubFunctionRoleAccessDetails(subFun.subFunctionId, subFun.subFunctionName),
          }

        })
        console.log("Sub Function List::::::", modifiedSubFunctionList)
        setCurrentSubfunctionList(modifiedSubFunctionList || [])
      }
      hideLoader();
    }
  }, [selectedMainMenu, roleMapDetails])


  const accessTypeCheckBoxOnClick = (subFunctionId, accessId, roleMasterId) => {
    //console.log("Sub Function Id", subFunctionId, "Access Id", accessId, "Role Master Id", roleMasterId)
    setCurrentSubfunctionList((prevList) => {
      return prevList.map((subFunction) => {
        if (subFunction.subFunctionId === subFunctionId) {

          return {
            ...subFunction,
            roleAccessDetails: subFunction.roleAccessDetails.map((role) => {
              //console.log(role)
              if (role.roleMasterId === roleMasterId) {

                return {
                  ...role,
                  accessTypeList: role.accessTypeList.map((access) => {
                    if (access.accessId === accessId) {
                      console.log("Access Type List", access, role)
                      return { ...access, value: !access.value };
                    }
                    return access;
                  }),
                };
              }
              return role;
            }),
          };
        }
        //console.log("Sub Function List", subFunction) 
        return subFunction;

      });
    })

  }

  const getSubFunctionRoleAccessDetails = (subFunctionId, subFunctionName) => {
    let roleList = []
    if (subFunctionId) {
      
      roleList = roleMapDetails?.map((item) => {

        let currentMenu = item?.mainFunctionDTOList?.find((menu) => menu?.functionMasterId === selectedMainMenu?.id);

        let currentSubFunction = currentMenu?.subMenuDetailList?.find((subFun) => subFun?.subFunctionMasterId === subFunctionId);
        console.log("CB", subFunctionId ,   item)

        let acceesNameList = currentSubFunction?.accessDetailList?.map((access) => access?.accessType) || []
        //console.log("Sub Function Id", subFunctionId, "Sub Function Name", currentSubFunction, subFunctionName,  acceesNameList, item?.roleMasterDTO?.roleShortName )

        let accessList = accessTypeList?.map((access) => {
          return {
            accessId: access?.accessId,
            accessType: access?.accessType,
            value: acceesNameList?.includes(access?.accessType) ? true : false
          }
        }
        ) || []

        return {
          roleMasterId: item?.roleMasterDTO?.roleMasterId,
          roleShortName: item?.roleMasterDTO?.roleShortName,
          roleDescription: item?.roleMasterDTO?.roleDescription,
          accessTypeList: accessList,

        }
      })
    }

    console.log("Role List:::::", roleList)

    return roleList || []

  }




  const handleSaveDetails = () => {
    const getSubFunctionMasterDTOList = (roleMasterId) => {
      let finalList = currentSubfunctionList?.map((subFunction) => {
        let accessDetailList = subFunction?.roleAccessDetails?.find(item =>
          item.roleMasterId === roleMasterId)?.accessTypeList?.filter(access =>
            access.value === true)?.map((access) => {
              return {
                accessType: access?.accessId,

              }
            }) || []

        return {
          subFunctionMasterId: subFunction?.subFunctionId,
          accessDetailList: accessDetailList

        }

      })
      return finalList || []
    }

    let apiRequest = roleMapDetails?.map((item) => {
      let roleMasterDTO = {
        roleMasterId: item?.roleMasterDTO?.roleMasterId,
      }
      return {
        roleMasterDTO: roleMasterDTO,
        subFunctionMasterDTOList: getSubFunctionMasterDTOList(item?.roleMasterDTO?.roleMasterId)
      }
    }) || []

    console.log("Final Role Access List", apiRequest)

    if (!selectedMainMenu || selectedMainMenu?.id === 0) {
      showSnackbar("Please select Main Function!", "warning")
      return
    }

    if (!apiRequest?.length) {
      showSnackbar("Something went wrong", "warning")
      return
    }
    showLoader()
    saveRoleFunctionMapService(apiRequest).then(res => {
      console.log("Save Role Function Map Response", res)
      if (res?.status) {
        hideLoader()
        showSnackbar("User Role Function Mapping Saved Successfully!", "success")
        fetchAllData()
      }
      else {
        hideLoader()
        showSnackbar(res?.message || "Failed to save User Role Function Mapping!", "error")
      }
    }).catch(error => {
      console.error("Error saving User Role Function Mapping:", error);
      showSnackbar("Failed to save User Role Function Mapping!", "error")
      hideLoader()
    }

    )
  }

  const ActionButtonsArr = [
    {
      "showHeaderButton": true,
      "buttonText": "Save Details",
      "buttonCallback": () => { handleSaveDetails() },
      "buttonIcon": <SaveOutlinedIcon fontSize='small' />,
      "access": accessMatrix?.create ?? false
    }
  ]

  return (
    <PageWrapper title={"Access Management"}  >
      <Box sx={{ height: '70vh', overflowY: 'auto', }}>
        {/* Sticky Header Box */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'white', // Important to avoid transparency over scroll
            p: 2,
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'row',
              lg: 'row'
            },
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: 2,
            //boxShadow: 2, // Optional for visual separation
          }}
        >
          <Autocomplete
            disablePortal
            disableClearable
            value={selectedMainMenu}
            options={mainMenuListDropDownList}
            sx={{ minWidth: 200 }}
            onChange={(event, newValue) => setSelectedMainMenu(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select Main Function"
                label="Main Function*"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />

        </Box>

        {/* Scrollable Accordion Table */}
        <RoleFunctionAccordianTable
          currentSubFunctionList={currentSubfunctionList}
          mainMenuId={selectedMainMenu?.id}
          accessTypeCheckBoxOnClick={accessTypeCheckBoxOnClick}
        />
        { accessMatrix?.create && selectedMainMenu?.id && currentSubfunctionList?.length > 0 && <Box sx={{ maxWidth: 'md', mx: 'auto', p: 1, display: 'flex', justifyContent: 'space-start', gap: 2, alignItems: 'center' }}>
          <Button variant='outlined' onClick={handleSaveDetails}><SaveOutlinedIcon fontSize='small' /><Typography ml={1} sx={{ mr: 1 }}>Save Details</Typography></Button>
          <Button variant="outlined" color="error" onClick={() => { navigate('/dashboard') }}>Cancel</Button>

        </Box> }
      </Box>


    </PageWrapper>
  );
};

export default UserRoleFunctionMap;