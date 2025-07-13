import React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DataGridTable from '../../components/Tables/DataGridTable';

function UserLocationMappingTable({ mappingList, openEditDialog }) {
  const columns = [
    { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 0.5, minWidth: 80 },
    { field: 'loginId', headerName: 'Login ID', headerClassName: 'table-header', flex: 1, minWidth: 150 },
    { field: 'userName', headerName: 'User Name', headerClassName: 'table-header', flex: 2, minWidth: 200 },
    { field: 'mobile', headerName: 'Mobile', headerClassName: 'table-header', flex: 1, minWidth: 150 },
    { field: 'locations', headerName: 'Mapped Locations', headerClassName: 'table-header', flex: 3, minWidth: 300, renderCell: (params) => params.value.join(', ') },
    {
      field: 'actions',
      headerName: 'Action',
      headerClassName: 'table-header',
      sortable: false,
      flex: 1,
      minWidth: 80,
      renderCell: (params) => (
        <EditIcon color="primary" sx={{ cursor: 'pointer' }} onClick={() => openEditDialog(params.row)} />
      )
    }
  ];

  const rows = mappingList?.map((item, index) => ({
    slNo: index + 1,
    id: index + 1,
    ...item
  }));

  return (
    <Box sx={{ height: '60vh', m: 2 }}>
      <DataGridTable
        columns={columns}
        rows={rows}
        columnVisibilityModel={{ id: false }}
        paginationModel={{ page: 0, pageSize: 10 }}
      />
    </Box>
  );
}

export default UserLocationMappingTable;
