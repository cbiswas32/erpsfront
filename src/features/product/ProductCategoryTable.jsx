import React, { useState, useMemo, useEffect } from 'react';
import { Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DataGridTable from '../../components/Tables/DataGridTable';

const paginationModel = { page: 0, pageSize: 5 };

function ProductCategoryTable({  productCategoryList, onClickEdit }) {
  

  const columns = [
    { field: 'slNo', headerName: 'SL No.', headerClassName: 'table-header', flex: 1, minWidth: 80 },
    { field: 'productCategoryName', headerName: 'Product Category Name', headerClassName: 'table-header', flex: 3, minWidth: 180 },
    { field: 'description', headerName: 'Description', headerClassName: 'table-header', flex: 3, minWidth: 250 },
    {
      field: 'activeFlag',
      headerName: 'Status',
      headerClassName: 'table-header',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Chip
            label={params.value === 'Y' ? 'Active' : 'Inactive'}
            color={params.value === 'Y' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        );
      }
    },
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
              color="primary"
              onClick={() => onClickEdit(params.row)}
              sx={{ cursor: 'pointer' }}
            />
          </div>
        );
      }
    }
  ];

  const rows = useMemo(() => {
    return productCategoryList?.map((item, index) => ({
      slNo: index + 1,
      id: item.productCategoryId,
      productCategoryId: item.productCategoryId,
      productCategoryName: item.productCategoryName,
      description: item.description,
      activeFlag: item.activeFlag
    })) || [];
  }, [productCategoryList]);

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

export default ProductCategoryTable;
