import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import DataGridTable from '../../components/Tables/DataGridTable';

const paginationModel = { page: 0, pageSize: 5 };


function StateTable({onClickEdit, getStateListAPICall, stateList }) {
    useEffect(() => {
      getStateListAPICall();
    }, []);
    const columns = [
        { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 2, minWidth: 200 },
        { field: 'stateName', headerName: 'State Name',  headerClassName: 'table-header', flex: 3, minWidth: 250 },

        
      ];

    const rows = useMemo(() => {
        let convertStateList =  stateList && stateList.length > 0 && stateList.map((item, index) => {
            return {
                slNo: index + 1,
                id: item.stateId,
                stateName: item.stateName
            }
        })
        return convertStateList || []
        
      }, [stateList]);

    return (
        <Box sx={{ height: '60vh', m:2}}>
            <DataGridTable columns={columns} rows={rows} columnVisibilityModel={{id: false}} paginationModel={paginationModel} />
        </Box>
    );
}

export default StateTable;