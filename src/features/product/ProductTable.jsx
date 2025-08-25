import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import DataGridTable from '../../components/Tables/DataGridTable';

const paginationModel = { page: 0, pageSize: 10 };

function ProductTable({ productList, getProductListAPICall, onClickEdit, onClickView, onClickBOM, onToggleStatus }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProductListAPICall();
  }, []);

  const handleStatusClick = (row) => {
    setSelectedProduct(row);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedProduct) {
      onToggleStatus(selectedProduct); // call parent API handler
    }
    setConfirmOpen(false);
    setSelectedProduct(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setSelectedProduct(null);
  };

  const columns = [
    { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 1, minWidth: 80 },
    { field: 'productCode', headerName: 'Product Code', headerClassName: 'table-header', flex: 2, minWidth: 150 },
    { field: 'productName', headerName: 'Product Name', headerClassName: 'table-header', flex: 2, minWidth: 180 },
    { field: 'category', headerName: 'Category', headerClassName: 'table-header', flex: 2, minWidth: 160 },
    { field: 'brand', headerName: 'Brand', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    { field: 'unit', headerName: 'Unit', headerClassName: 'table-header', flex: 1, minWidth: 100 },

    {
      field: 'activeFlag',
      headerName: 'Status',
      headerClassName: 'table-header',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'Y' ? 'Active' : 'Inactive'}
          color={params.value === 'Y' ? 'success' : 'error'}
          size="small"
          sx={{ cursor: 'pointer' }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Action',
      headerClassName: 'table-header',
      sortable: false,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <EditIcon
            color="primary"
            onClick={() => onClickEdit(params.row)}
            sx={{ cursor: 'pointer' }}
          />
          <VisibilityIcon
            color="primary"
            onClick={() => onClickView(params.row)}
            sx={{ cursor: 'pointer' }}
          />
         
          <DescriptionIcon
            color="primary"
            onClick={() => onClickBOM(params.row)}
            sx={{ cursor: 'pointer' }}
          />

           {
            params.row.activeFlag === "Y" ? <ToggleOnIcon  color="primary"
            onClick={() => handleStatusClick(params.row)}
            sx={{ cursor: 'pointer' }} /> : <ToggleOffIcon  color="error"
            onClick={() => handleStatusClick(params.row)}
            sx={{ cursor: 'pointer' }} />
          }
        </div>
      ),
    },
  ];

  const rows = useMemo(() => {
    return (productList || []).map((item, index) => ({
      slNo: index + 1,
      id: index + 1,
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      category: item.productCategoryName,
      categoryId: item.productCategoryId,
      brand: item.brand,
      unit: item.unit,
      unitPrice: item.unitPrice,
      hsnCode: item.hsnCode,
      gstPercentage: item.gstPercentage,
      gstPercentagePurchase: item.gstPercentagePurchase,
      description: item.description,
      lowStockThreshold: item.lowStockThreshold,
      isAvailableForSale: item.isAvailableForSale,
      serialNoApplicable: item.serialNoApplicable,
      activeFlag: item.activeFlag,
      isFinalVeichle: item.isFinalVeichle
    }));
  }, [productList]);

  return (
    <Box sx={{ height: '65vh', m: 2 }}>
      <DataGridTable
        columns={columns}
        rows={rows}
        columnVisibilityModel={{ id: false }}
        paginationModel={paginationModel}
      />

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedProduct?.activeFlag === 'Y' ? 'deactivate' : 'activate'}{' '}
            <b>{selectedProduct?.productName}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">Cancel</Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductTable;
