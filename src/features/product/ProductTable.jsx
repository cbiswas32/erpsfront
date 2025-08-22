import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DataGridTable from '../../components/Tables/DataGridTable';
import DescriptionIcon from '@mui/icons-material/Description';

const paginationModel = { page: 0, pageSize: 10 };

function ProductTable({ productList, getProductListAPICall, onClickEdit, onClickView, onClickBOM }) {

  useEffect(() => {
    getProductListAPICall();
  }, []);

  const columns = [
    { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 1, minWidth: 80 },
    { field: 'productCode', headerName: 'Product Code', headerClassName: 'table-header', flex: 2, minWidth: 150 },
    { field: 'productName', headerName: 'Product Name', headerClassName: 'table-header', flex: 2, minWidth: 180 },
    { field: 'category', headerName: 'Category', headerClassName: 'table-header', flex: 2, minWidth: 160 },
    { field: 'brand', headerName: 'Brand', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    { field: 'unit', headerName: 'Unit', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    // { field: 'unitPrice', headerName: 'Unit Price', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    // { field: 'hsnCode', headerName: 'HSN Code', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    // { field: 'gstPercentage', headerName: 'GST %', headerClassName: 'table-header', flex: 1, minWidth: 100 },
    // { field: 'description', headerName: 'Description', headerClassName: 'table-header', flex: 2, minWidth: 150 },
    // { field: 'isAvailableForSale', headerName: 'Available for Sale', headerClassName: 'table-header', flex: 1, minWidth: 150 },
    // { field: 'serialNoApplicable', headerName: 'Serial No. Applicable', headerClassName: 'table-header', flex: 1, minWidth: 180 },
    {
      field: 'activeFlag',
      headerName: 'Status',
      headerClassName: 'table-header',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 'Y' ? 'Active' : 'Inactive'}
          color={params.value === 'Y' ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Action',
      headerClassName: 'table-header',
      sortable: false,
      flex: 1,
      minWidth: 100,
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
      isFinalVeichle:  item.isFinalVeichle
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
    </Box>
  );
}

export default ProductTable;
