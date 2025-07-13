import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import DataGridTable from '../../components/Tables/DataGridTable';

const paginationModel = { page: 0, pageSize: 5 };


function DistrictTable({ getDistrictListAPICall, districtList, onClickEdit }) {
    useEffect(() => {
      getDistrictListAPICall();
    }, []);
    const columns = [
        { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 2, minWidth: 250 },
        { field: 'districtName', headerName: 'District Name',  headerClassName: 'table-header', flex: 3, minWidth: 250 },
         {
          field: 'actions',
          headerName: 'Action',
          headerClassName: 'table-header',
          sortable: false,
          flex: 1, 
          minWidth: 80, 
          renderCell: (params) => {
            return (
              <div sx={{
                display: 'flex',
                gap: 1
              }}>
                 
                 <EditIcon color='primary' onClick={()=> {onClickEdit(params.row)}} sx={{
                  mr: 1,
                  cursor: 'pointer'
                 }}/>
              </div>
            );
          }
        }
        
      ];

    const rows = useMemo(() => {
        let convertDistrictList =  districtList && districtList.length > 0 && districtList.map((item, index) => {
            return {
                slNo: index + 1,
                id: item.districtId,
                districtId: item.districtId,
                stateId: item.stateId,
                districtName: item.districtName
            }
        })
        return convertDistrictList || []
        
      }, [districtList]);

    return (
        <Box sx={{ height: '60vh', m:2}}>
            <DataGridTable columns={columns} rows={rows} columnVisibilityModel={{id: false}} paginationModel={paginationModel} />
        </Box>
    );
}

export default DistrictTable;