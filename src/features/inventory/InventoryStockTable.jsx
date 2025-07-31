import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import DataGridTable from '../../components/Tables/DataGridTable';
import Visibility from '@mui/icons-material/Visibility';
import { Typography } from '@mui/material';


const paginationModel = { page: 0, pageSize: 10 };

function InventoryStockTable({ getInventoryStockListAPICall, inventoryList, handleOpenSerialNumberDialog }) {
//   useEffect(() => {
//     getInventoryStockListAPICall(); // Call API on mount
//   }, []);

  const columns = [
    { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 1, minWidth: 70 },
    { field: 'product_name', headerName: 'Product', headerClassName: 'table-header', flex: 2, minWidth: 150 },
    { field: 'location_name', headerName: 'Location', headerClassName: 'table-header', flex: 2, minWidth: 150 },
   
    { field: 'low_stock_threshold', headerName: 'Low Stock Threshold', headerClassName: 'table-header', flex: 1, minWidth: 60 },
    
    { field: 'quantity', headerName: 'Available Quantity', headerClassName: 'table-header', flex: 2, minWidth: 90 },
     { field: 'unit', headerName: 'Unit', headerClassName: 'table-header', flex: 1, minWidth: 80 },
    { field: 'last_update_ref', headerName: 'Last Update Ref', headerClassName: 'table-header', flex: 2, minWidth: 150 },
    {
  field: 'alert',
  headerName: 'Alert',
  flex: 1.5,
  minWidth: 120,
  sortable: false,
  filterable: false,
  headerClassName: 'table-header',
  renderCell: (params) => {
    const { quantity, low_stock_threshold } = params.row;
    const isLow = Number(quantity) <= Number(low_stock_threshold);

    return (
      <span
        style={{
          fontWeight: 600,
          color: isLow ? '#d32f2f' : '#2e7d32', // red or green
          
        }}
      >
        {isLow ? 'Low Stock' : 'Sufficient'}
      </span>
    );
  }
},
{
      field: "actions",
      headerName: "View Serial Numbers",
      headerClassName: "table-header",
      sortable: false,
      flex: 2,
      minWidth: 100,
      renderCell: (params) => {
        if(!params.row.serial_no_applicable){
          return <Typography variant='small' color='error'>
            Serial no. not applicable! 
          </Typography>
        }
        
        return (
        <Visibility
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => {handleOpenSerialNumberDialog(params.row)}}
        />
      )},
    },

  ];

  const rows = useMemo(() => {
    return (inventoryList || []).map((item, index) => ({
      slNo: index + 1,
      id: `${item.product_id}-${item.location_id}`, // Ensure unique ID
      ...item,
      low_stock_threshold: Number(item.low_stock_threshold),
      quantity: Number(item.quantity)
      
    }));
  }, [inventoryList]);

  return (
    <Box sx={{ height: '70vh'}}>
      <DataGridTable
        columns={columns}
        rows={rows}
        paginationModel={paginationModel}
        columnVisibilityModel={{ id: false }}
      />
    </Box>
  );
}

export default InventoryStockTable;
