import React, { useState, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DataGridTable from '../../components/Tables/DataGridTable';

const paginationModel = { page: 0, pageSize: 5 };

function LocationTypeTable({ getLocationTypeListAPICall, locationTypeList, onClickEdit }) {
  
  useEffect(() => {
    getLocationTypeListAPICall();
  }, []);

  const columns = [
    { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    { field: 'locationTypeName', headerName: 'Location Type Name', headerClassName: 'table-header', flex: 3, minWidth: 150 },
    { field: 'description', headerName: 'Description', headerClassName: 'table-header', flex: 3, minWidth: 250 },
    {
      field: 'actions',
      headerName: 'Action',
      headerClassName: 'table-header',
      sortable: false,
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <EditIcon
              color='primary'
              onClick={() => { onClickEdit(params.row) }}
              sx={{ cursor: 'pointer' }}
            />
          </div>
        );
      }
    }
  ];

  const rows = useMemo(() => {
    let formattedRows = locationTypeList && locationTypeList.length > 0 && locationTypeList.map((item, index) => {
      return {
        slNo: index + 1,
        id: item.locationTypeId,
        locationTypeId: item.locationTypeId,
        locationTypeName: item.locationTypeName,
        description: item.description,
        activeFlag: item.activeFlag
      };
    });
    return formattedRows || [];
  }, [locationTypeList]);

  return (
    <Box sx={{ height: '60vh', m: 2 }}>
      <DataGridTable
        columns={columns}
        rows={rows}
        columnVisibilityModel={{ id: false }}
        paginationModel={paginationModel}
      />
    </Box>
  );
}

export default LocationTypeTable;
