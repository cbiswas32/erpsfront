import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DataGridTable from '../../components/Tables/DataGridTable';

const MissingProductsDialog = ({ open, onClose, inventoryList = [], productList = [], getProductListAPICall }) => {
  // Define DataGrid columns
  const columns = [
    { field: 'slNo', headerName: 'SL No.', flex: 1, headerClassName: 'table-header',  minWidth: 70 },
    { field: 'productName', headerName: 'Product Name', headerClassName: 'table-header',  flex: 3, minWidth: 200 },
    { field: 'productCode', headerName: 'Product Code', headerClassName: 'table-header',  flex: 2, minWidth: 150 },
    { field: 'alert', headerName: 'Alert', headerClassName: 'table-header',  flex: 2, minWidth: 150, renderCell: (params) => (
    <span style={{ color: '#d32f2f', fontWeight: 600 }}>
      {params.value}
    </span>
  )}
  ];

  useEffect(() => {
    console.log(productList)
    if(open && productList?.length === 0){
            getProductListAPICall(true)
    }


  }, [open])

  // Derive missing products from inventory vs productList
  const missingProducts = useMemo(() => {
    const stockedProductIds = new Set(inventoryList.map(item => item.product_id));
    return productList
      .filter(product => !stockedProductIds.has(product.productId))
      .map((product, index) => ({
        ...product,
        id: product.productId,
        slNo: index + 1,
        alert: 'Never stocked in any location!',
      }));
  }, [inventoryList, productList]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Products Not Stocked Yet
      <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {missingProducts.length === 0 ? (
          <Typography>No missing products. All products are in stock.</Typography>
        ) : (
          <Box sx={{ height: 600 }}>
            <DataGridTable
              rows={missingProducts}
              columns={columns}
              paginationModel={{ page: 0, pageSize: 10 }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MissingProductsDialog;
