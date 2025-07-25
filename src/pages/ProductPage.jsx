import React, { useEffect, useState } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import { useUI } from '../context/UIContext';
import AddIcon from '@mui/icons-material/Add';
import { getAllProductsService, saveOrUpdateProductService } from '../services/productService';
import { getProductCategoryListService } from '../services/productCategoryServices';
import ProductTable from '../features/product/ProductTable';
import CreateEditProductDialog from '../features/product/CreateEditProductDialog';
import ViewProductDialog from '../features/product/ViewProductDialog';
import { getAllProductFeaturesService } from '../services/productFeatureServices';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { getAcceessMatrix } from '../utils/loginUtil';
import ManageBOMDialog from '../features/bom/ManageBOMDialog';

function ProductPage() {
  const { showSnackbar, showLoader, hideLoader } = useUI();

  const [productList, setProductList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [mode, setMode] = useState('create');
  const [currentItemForEdit, setCurrentItemForEdit] = useState(null);
  const [currentItemForView, setCurrentItemForView] = useState({});
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [productFeatureList, setProductFeatureList] = useState([]);
  const [accessMatrix, setAccessMatrix] = useState({});
  const [openBOMDialog, setOpenBOMDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  

  useEffect(() => {
    getProductListAPICall(true);
    getProductCategoryListAPICall(true);
    getProductFeatureListAPICall(true)
    let access = getAcceessMatrix('Product', 'Products');
    setAccessMatrix(access);
   
  }, []);


 const getProductFeatureListAPICall = (hideSnackbar) => {
    showLoader();
    getAllProductFeaturesService()
      .then(res => {
        if (res && res.length > 0) {
          setProductFeatureList(res?.filter(x => x.activeFlag === 'Y') || []);
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
  const getProductCategoryListAPICall = (hideSnackbar) => {
    showLoader();
    getProductCategoryListService()
      .then(res => {
        if (res && res.length > 0) {
          setProductCategoryList(res?.filter(x => x.activeFlag === 'Y') || []);
          !hideSnackbar && showSnackbar('Product Categories fetched successfully!', 'success');
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

  const getProductListAPICall = (hideSnackbar) => {
    showLoader();
    getAllProductsService()
      .then(res => {
        if (res && res.length > 0) {
          setProductList(res);
          !hideSnackbar && showSnackbar('Products fetched successfully!', 'success');
        } else {
          setProductList([]);
          !hideSnackbar && showSnackbar('No Products found!', 'warning');
        }
        hideLoader();
      })
      .catch(error => {
        console.error('Error fetching Products:', error);
        setProductList([]);
        hideLoader();
        !hideSnackbar && showSnackbar('Failed to fetch Products!', 'error');
      });
  };

  const onClickEdit = (productObj) => {
    setCurrentItemForEdit(productObj);
    setMode('edit');
    setOpenDialog(true);
  };

  const onClickView = (productObj) => {
    setCurrentItemForView(productObj);
    setOpenViewDialog(true);
  };
  const onClickBOM = (productObj) => {
    setCurrentItemForView(productObj);
    setOpenBOMDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setMode('create');
    setCurrentItemForEdit({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Create New Product',
      buttonCallback: handleOpenCreateDialog,
      buttonIcon: <AddIcon fontSize='small' />,
      access: accessMatrix?.create ?? false,
    }
  ];

  return (
    <PageWrapper title="Product Management" actionButtons={ActionButtonsArr}>
      <Box sx={{ m: 2, display: 'flex', justifyContent: 'end' }} > 
           <TextField
           size={'small'}
              select
              sx={{minWidth: 200}}
              label="Filter by Product Category"s
              name="category_id"
              value={selectedCategoryId}
              onChange={(e) => {setSelectedCategoryId(e.target.value)}}
              required
            >
               <MenuItem key={0} value={0}>
                  {'All Category'}
                </MenuItem>

              {productCategoryList.map(cat => (
                <MenuItem key={cat.productCategoryId} value={cat.productCategoryId}>
                  {cat.productCategoryName}
                </MenuItem>
              ))}
            </TextField>
      </Box>
    
      <ProductTable
        productList={productList?.filter(x=> selectedCategoryId == 0 || x.productCategoryId === selectedCategoryId)}
        productCategoryList={productCategoryList}
        getProductListAPICall={getProductListAPICall}
        onClickEdit={onClickEdit}
        onClickView={onClickView}
        onClickBOM={onClickBOM}
      />
      <CreateEditProductDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        mode={mode}
        productCategoryList={productCategoryList}
        productFeatureList={productFeatureList}
        currentItemForEdit={currentItemForEdit}
        getProductListAPICall={getProductListAPICall}
      />
      <ViewProductDialog
        open={openViewDialog}
        handleClose={handleCloseViewDialog}
        currentItem={currentItemForView}
      />
      <ManageBOMDialog
        open={openBOMDialog}
        allProducts={productList}
        handleClose={() => setOpenBOMDialog(false)}
        product={currentItemForView}
      />
    </PageWrapper>
  );
}

export default ProductPage;
