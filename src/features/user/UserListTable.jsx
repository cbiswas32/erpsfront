import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockResetIcon from '@mui/icons-material/LockReset';
import Tooltip from '@mui/material/Tooltip';
import DataGridTable from '../../components/Tables/DataGridTable';

const paginationModel = { page: 0, pageSize: 5 };


function UserListTable({ setCurrentItemForEdit, getUserListAPICall, userList, setSelectedMode, setOpenUserDialog, setOpenResetPasswordConfirmationDialog }) {
  useEffect(() => {
    getUserListAPICall();
  }, []);


  const columns = [
    { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    { field: 'name', headerName: 'Name', headerClassName: 'table-header', flex: 2, minWidth: 200 },
    { field: 'roleDescripton', headerName: 'Role', headerClassName: 'table-header', flex: 2, minWidth: 120 },
    { field: 'loginId', headerName: 'Login Id', headerClassName: 'table-header', flex: 2, minWidth: 180 },
    { field: 'status', headerName: 'Status', headerClassName: 'table-header', flex: 2, minWidth: 180 },
    { field: 'mobileNumber', headerName: 'Mobile Number', headerClassName: 'table-header', flex: 3, minWidth: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      headerClassName: 'table-header',
      sortable: false,
      flex: 2,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div sx={{
            display: 'flex',
            gap: 1
          }}>
            <Tooltip title="View" placement="top" arrow>
              <VisibilityIcon color='primary' onClick={() => {
                setSelectedMode('view');
                setOpenUserDialog(true);
                setCurrentItemForEdit(params.row);
              }} sx={{
                mr: 1,
                cursor: 'pointer'
              }} />
            </Tooltip>
            <Tooltip title="Edit" placement="top" arrow>
              <EditIcon color='primary' onClick={() => {
                setSelectedMode('edit');
                setOpenUserDialog(true);
                setCurrentItemForEdit(params.row);
              }} sx={{
                mr: 1,
                cursor: 'pointer'
              }} />
            </Tooltip>
            <Tooltip title="Reset Password" placement="top" arrow>
              <LockResetIcon color='error' sx={{
                mr: 1,
                cursor: 'pointer'
              }} onClick={() => {
                setCurrentItemForEdit(params.row);
                setOpenResetPasswordConfirmationDialog(true);

              }} />
            </Tooltip>
            {/* <Tooltip title="Disable User" placement="top" arrow>
            <RemoveCircleIcon color='error' sx={{
              mr: 1,
              cursor: 'pointer'
            }} />
            </Tooltip> */}
          </div>
        );
      }
    }

  ];

  const rows = useMemo(() => {
    let convertUserList = userList && userList.length > 0 && userList.map((item, index) => {
      return {
        slNo: index + 1,
        id: index + 1,
        name: [item.userFirstname, item.userMiddlename, item.userLastname].filter(Boolean).join(" "),
        userFirstName: item.userFirstname,
        userMiddleName: item.userMiddlename,
        userLastName: item.userLastname,
        userId: item.userId,
        primaryEmail: item.userEmailPrimary,
        emailSecondary: item.userEmailSecondary,
        mobileNumber: item.userMobilePrimary,
        mobileNumberSecondary: item.userMobileSecondary,
        roleId: item.roleId,
        roleShortname: item.roleShortname,
        roleDescripton: item.roleDescription,
        userActiveFlag: item.userActiveFlag,
        zoneId: item.zoneId,
        zoneName: item.zoneName,
        reportingManagerId: item.reportingManagerId,
        reportingManagerFirstName: item.reportingManagerFirstName,
        reportingManagerLastName: item.reportingManagerLastName,
        functionalManagerId: item.functionalManagerId,
        functionalManagerFirstName: item.functionalManagerFirstName,
        functionalManagerLastName: item.functionalManagerLastName,
        zoneIdList: item.zoneList?.map(x => x.zoneId),
        zoneNameList: item.zoneList?.map(x => x.zoneName),
        loginId: item.loginId,

        status: item.userActiveFlag === 'Y' ? 'Active' : 'In-Active'


      }
    })
    return convertUserList || []

  }, [userList]);

  return (
    <Box sx={{ height: '60vh', m: 2 }}>
      <DataGridTable columns={columns} rows={rows} columnVisibilityModel={{ id: false }} paginationModel={paginationModel} />
    </Box>
  );
}

export default UserListTable;