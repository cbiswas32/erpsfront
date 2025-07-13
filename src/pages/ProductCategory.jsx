import React, { useEffect, useState } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import { useUI } from '../context/UIContext';
import { getProductCategoryListService, saveOrUpdateProductCategoryService } from '../services/productCategoryServices';
import CreateEditProductCategoryDialog from '../features/product/CreateEditProductCategoryDialog';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import ProductCategoryTable from '../features/product/ProductCategoryTable';
import { getAcceessMatrix } from '../utils/loginUtil';

function ProductCategory() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState('create');
  const [currentItemForEdit, setCurrentItemForEdit] = useState({});
    const [accessMatrix, setAccessMatrix] = useState({});

  useEffect(() => {
    let access = getAcceessMatrix('Product', 'Product Category');
    setAccessMatrix(access);
    getProductCategoryListAPICall();
  }, []);


  const getProductCategoryListAPICall = () => {
    showLoader();
    getProductCategoryListService()
      .then(res => {
        if (res && res.length > 0) {
          setProductCategoryList(res);
          showSnackbar('Product Categories fetched successfully!', 'success');
        } else {
          setProductCategoryList([]);
          showSnackbar('No Product Categories found!', 'warning');
        }
        hideLoader();
      })
      .catch(err => {
        console.error('Error fetching Product Categories:', err);
        setProductCategoryList([]);
        hideLoader();
        showSnackbar('Failed to fetch Product Categories!', 'error');
      });
  };

  const handleOpenCreateDialog = () => {
    setMode('create');
    setCurrentItemForEdit({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditClick = (item) => {
    setMode('edit');
    setCurrentItemForEdit(item);
    setOpenDialog(true);
  };

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Create New Product Category',
      buttonCallback: handleOpenCreateDialog,
      buttonIcon: <AddIcon fontSize='small' />,
      access: true,  // adjust if you need role-based access control
    },
  ];

  return (
    <PageWrapper title={"Product Category"} actionButtons={ActionButtonsArr}>
      <Box sx={{ m: 2 }} />
      <ProductCategoryTable
        productCategoryList={productCategoryList}
        onClickEdit={handleEditClick}
      />
      <CreateEditProductCategoryDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        mode={mode}
        currentItemForEdit={currentItemForEdit}
        getProductCategoryListAPICall={getProductCategoryListAPICall}
      />
    </PageWrapper>
  );
}

export default ProductCategory;
