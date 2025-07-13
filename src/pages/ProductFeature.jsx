import React, { useEffect, useState } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import { useUI } from '../context/UIContext';
import AddIcon from '@mui/icons-material/Add';
import { getAllProductFeaturesService, saveOrUpdateProductFeatureService } from '../services/productFeatureServices';
import ProductFeatureTable from '../features/product/ProductFeatureTable';
import CreateEditProductFeatureDialog from '../features/product/CreateEditProductFeatureDialog';
import Box from '@mui/material/Box';
import { getAcceessMatrix } from '../utils/loginUtil';

function ProductFeature() {
  const { showSnackbar, showLoader, hideLoader } = useUI();

  const [productFeatureList, setProductFeatureList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState('create');
  const [currentItemForEdit, setCurrentItemForEdit] = useState(null);
    const [accessMatrix, setAccessMatrix] = useState({});

  useEffect(() => {
    getProductFeatureListAPICall(true);
     let access = getAcceessMatrix('Product', 'Product Feature');
    setAccessMatrix(access);
  }, []);
 

  const getProductFeatureListAPICall = (hideSnackbar) => {
    showLoader();
    getAllProductFeaturesService()
      .then(res => {
        if (res && res.length > 0) {
          setProductFeatureList(res);
          !hideSnackbar && showSnackbar('Product Features fetched successfully!', 'success');
        } else {
          setProductFeatureList([]);
          !hideSnackbar && showSnackbar('No Product Features found!', 'warning');
        }
        hideLoader();
      })
      .catch(error => {
        console.error('Error fetching Product Features:', error);
        setProductFeatureList([]);
        hideLoader();
        !hideSnackbar && showSnackbar('Failed to fetch Product Features!', 'error');
      });
  };

  const onClickEdit = (featureObj) => {
    setCurrentItemForEdit(featureObj);
    setMode('edit');
    setOpenDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setMode('create');
    setCurrentItemForEdit({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Create New Feature',
      buttonCallback: handleOpenCreateDialog,
      buttonIcon: <AddIcon fontSize='small' />,
      access: accessMatrix?.create ?? false
    }
  ];

  return (
    <PageWrapper title="Product Feature Management" actionButtons={ActionButtonsArr}>
      <Box sx={{ m: 2 }} />
      <ProductFeatureTable
        productFeatureList={productFeatureList}
        getProductFeatureListAPICall={getProductFeatureListAPICall}
        onClickEdit={onClickEdit}
      />
      <CreateEditProductFeatureDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        mode={mode}
        currentItemForEdit={currentItemForEdit}
        getProductFeatureListAPICall={getProductFeatureListAPICall}
        productFeatureList={productFeatureList}
      />
    </PageWrapper>
  );
}

export default ProductFeature;
