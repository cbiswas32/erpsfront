import React, { useState, useEffect, forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useUI } from '../../context/UIContext';
import { saveOrUpdateProductService } from '../../services/productService';
import { units } from '../../utils/unitUtil';
import ProductFeatureSection from './product-feature/ProductFeatureSection';
import { getProductFeaturesByProductIdService } from '../../services/productService';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateEditProductDialog({
  open,
  handleClose,
  mode,
  getProductListAPICall,
  currentItemForEdit,
  productFeatureList = [],
  productCategoryList = []
}) {
  const { showSnackbar, showLoader, hideLoader } = useUI();

  const [productId, setProductId] = useState(0);
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [gstPercentage, setGstPercentage] = useState('');
  const [gstPercentagePurchase, setGstPercentagePurchase] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailableForSale, setIsAvailableForSale] = useState(false);
  const [isFinalVeichle, setIsFinalVeichle] = useState(false);
  const [serialNoApplicable, setSerialNoApplicable] = useState(false);
  const [category, setCategory] = useState(null);
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [productFeatureMap, setProductFeatureMap] = useState([])

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && currentItemForEdit) {
        if(currentItemForEdit.productId)
        {
          getProductFeaturesByProductIdAPICall()
        }
        console.log("currentItemForEdit", currentItemForEdit)
        setProductId(currentItemForEdit.productId || 0);
        setProductCode(currentItemForEdit.productCode || '');
        setProductName(currentItemForEdit.productName || '');
        
        setBrand(currentItemForEdit.brand || '');
        setUnit(currentItemForEdit.unit || '');
        setUnitPrice(currentItemForEdit.unitPrice || '');
        setHsnCode(currentItemForEdit.hsnCode || '');
        setGstPercentage(currentItemForEdit.gstPercentage || '');
        setGstPercentagePurchase(currentItemForEdit.gstPercentagePurchase || '');
        setDescription(currentItemForEdit.description || '');
        setIsAvailableForSale(currentItemForEdit.isAvailableForSale );
        setIsFinalVeichle(currentItemForEdit.isFinalVeichle)
        setSerialNoApplicable(currentItemForEdit.serialNoApplicable );
        setLowStockThreshold(currentItemForEdit.lowStockThreshold || '')
        setCategory(productCategoryList.find(cat => cat.productCategoryId === currentItemForEdit.categoryId) || null);
      } else {
        setProductId(0);
        setProductCode('');
        setProductName('');
        setBrand('');
        setUnit('');
        setUnitPrice('');
        setHsnCode('');
        setGstPercentage('');
        setGstPercentagePurchase( '');
        setDescription('');
        setIsAvailableForSale(false);
         setIsFinalVeichle(false)
        setSerialNoApplicable(false);
        setCategory(null);
        setProductFeatureMap([])
      }
      setErrors({});
    }
  }, [open, mode, currentItemForEdit, productCategoryList]);


   const getProductFeaturesByProductIdAPICall = (hideSnackbar) => {
      showLoader();
      getProductFeaturesByProductIdService(currentItemForEdit.productId)
        .then(res => {
          if (res && res.length > 0) {
            let modList = res?.map(x => {
              return {
                "selectedOption": {
                  "featureId" : x.featureId,
                  "featureName": x.featureName,
                  "unit": x.featureUnit
                },
                "value":x.featureValue
              }
            }) || []
            setProductFeatureMap(modList);
            console.log("setProductFeatureMap", res)
            !hideSnackbar && showSnackbar('Features for slected product fetched successfully!', 'success');
          } else {
            setProductFeatureMap([]);
            !hideSnackbar && showSnackbar('No features for slected product found!', 'warning');
          }
          hideLoader();
        })
        .catch(error => {
          console.error('Error fetching Product Features:', error);
          setProductFeatureMap([]);
          hideLoader();
          !hideSnackbar && showSnackbar('Failed to fetch Product Features!', 'error');
        });
    };

  const validateBeforeSave = () => {
    const newErrors = {};
    if (!productCode.trim()) newErrors.productCode = 'Product Code is required';
    if (!productName.trim()) newErrors.productName = 'Product Name is required';
    if (!category) newErrors.category = 'Category is required';
    if (!unit) newErrors.category = 'Unit is required';
    if (!unitPrice || parseFloat(unitPrice) <= 0) newErrors.unitPrice = 'Unit Price must be greater than zero';
    // Validate productFeatureMap
    productFeatureMap.forEach((item, index) => {
      if (!item.selectedOption || !item.selectedOption.featureId) {
        newErrors[`feature-${index}`] = 'Feature is required';
      }
      if (!item.value || item.value.trim() === '') {
        newErrors[`featureValue-${index}`] = 'Feature detail is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrUpdateProductAPI = () => {
    const featuresList =  productFeatureMap?.map(x=> {
      return {
          "featureId": x?.selectedOption?.featureId, 
          "featureValue" : x?.value
      }
     
    })
    const productDTO = {
      productId: productId || 0,
      productCode: productCode.trim(),
      productName: productName.trim(),
      brand: brand.trim(),
      unit: unit.trim() || '',
      unitPrice: parseFloat(unitPrice),
      hsnCode: hsnCode.trim(),
      gstPercentage: parseFloat(gstPercentage) || 0,
      gstPercentagePurchase: parseFloat(gstPercentagePurchase) || 0,
      description: description.trim(),
      isAvailableForSale: isAvailableForSale ? true : false,
      serialNoApplicable: serialNoApplicable ? true : false,
      isFinalVeichle: isFinalVeichle ? true : false,
      productCategoryId: category?.productCategoryId,
      lowStockThreshold: parseInt(lowStockThreshold) || 0,
      activeFlag: 'Y',
      features: featuresList || []
    };

    showLoader();
    saveOrUpdateProductService(productDTO)
      .then((res) => {
        hideLoader();
        if (res.status) {
          showSnackbar(`Product ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');
          getProductListAPICall(true);
          clearAndCloseDialog();
        } else {
          showSnackbar(res.message || 'Operation failed', 'error');
        }
      })
      .catch(() => {
        hideLoader();
        showSnackbar('Operation failed', 'error');
        getProductListAPICall(true);
        clearAndCloseDialog();
      });
  };

  const saveButtonOnClick = () => {
    console.log("productFeatureMap", productFeatureMap)
    
    if (validateBeforeSave()) {
      createOrUpdateProductAPI();
    } else {
      showSnackbar('Please correct the highlighted errors.', 'error');
    }
  };

  const clearAndCloseDialog = () => {
    setProductCode('');
    setProductName('');
    setBrand('');
    setUnit('');
    setUnitPrice('');
    setHsnCode('');
    setGstPercentage('');
    setDescription('');
    setLowStockThreshold('')
    setIsAvailableForSale(false);
    setSerialNoApplicable(false);
    setIsFinalVeichle(false)
    setCategory(null);
    setErrors({});
    setProductFeatureMap([])
    handleClose();
  };

  return (
    <Dialog open={open} onClose={clearAndCloseDialog} TransitionComponent={Transition} maxWidth="sm" fullWidth>
      <AppBar sx={{ position: 'relative', backgroundColor: 'primary.lighter' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={clearAndCloseDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h5" component="div">
            {mode === 'edit' ? 'Edit Product' : 'Create Product'}
          </Typography>
          <Button sx={{ ml: 4 }} autoFocus variant="contained" onClick={saveButtonOnClick}>
            <SaveAsIcon fontSize="small" sx={{ mr: 1 }} /> Save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <TextField label="Product Code*" value={productCode} onChange={e => setProductCode(e.target.value)} error={!!errors.productCode} helperText={errors.productCode} size="small" fullWidth />

        <TextField label="Product Name*" value={productName} onChange={e => setProductName(e.target.value)} error={!!errors.productName} helperText={errors.productName} size="small" fullWidth />

        <Autocomplete options={productCategoryList} getOptionLabel={option => option.productCategoryName || ''} isOptionEqualToValue={(option, value) => option.productCategoryId === value.productCategoryId} value={category} onChange={(e, val) => setCategory(val)} renderInput={(params) => <TextField {...params} label="Category*" error={!!errors.category} helperText={errors.category} size="small" />} />

        <TextField label="Brand" value={brand} onChange={e => setBrand(e.target.value)} size="small" fullWidth />

        <Autocomplete options={units} getOptionLabel={option => option.value} isOptionEqualToValue={(option, value) => option.id === value.id} value={units.find(u => u.value === unit) || null} onChange={(e, val) => setUnit(val ? val.value : '')} renderInput={(params) => <TextField {...params} label="Unit" size="small" />} />

        <TextField
          label="Unit Price*"
          value={unitPrice}
          onChange={e => setUnitPrice(e.target.value)}
          error={!!errors.unitPrice}
          helperText={errors.unitPrice}
          type="number"
          size="small"
            slotProps={{
                      input: {
                        endAdornment: unit &&  <Typography sx={{fontSize: '0.7rem', p:1, }}>{`/${unit}`}</Typography> ,
                        startAdornment: <Typography sx={{fontSize: '0.7rem', p:1, }}>{`INR`}</Typography> ,
                      },
                    }}
          fullWidth
        />

        <TextField label="HSN Code" value={hsnCode} onChange={e => setHsnCode(e.target.value)} size="small" fullWidth />

        <TextField
          label="Purchase GST Percentage"
          value={gstPercentagePurchase}
          onChange={e => setGstPercentagePurchase(e.target.value)}
          type="number"
          size="small"
            slotProps={{
                      input: {
                        endAdornment: <Typography sx={{fontSize: '0.7rem', p:1, }}>{"%"}</Typography> ,
                      },
                    }}
          fullWidth
        />
        <TextField
          label="Selling GST Percentage"
          value={gstPercentage}
          onChange={e => setGstPercentage(e.target.value)}
          type="number"
          size="small"
            slotProps={{
                      input: {
                        endAdornment: <Typography sx={{fontSize: '0.7rem', p:1, }}>{"%"}</Typography> ,
                      },
                    }}
          fullWidth
        />

        <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} size="small" multiline rows={2} fullWidth />

        <TextField
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
          size="small"
          label="Minimum Stock (Low Stock Threshold)"
          placeholder="Enter Minimum Stock"
          slotProps={{
                      input: {
                        endAdornment: unit &&  <Typography sx={{fontSize: '0.7rem', p:1, }}>{unit}</Typography> ,
                      },
                    }}
          //sx={{ width: 300 }}
          type="number"
          fullWidth
        />

        <FormControlLabel control={<Checkbox checked={isAvailableForSale} onChange={(e) => setIsAvailableForSale(e.target.checked)} />} label="Available for Sale" />

        <FormControlLabel control={<Checkbox checked={serialNoApplicable} onChange={(e) => setSerialNoApplicable(e.target.checked)} />} label="Serial Number Applicable" />
        <FormControlLabel control={<Checkbox checked={isFinalVeichle} onChange={(e) => setIsFinalVeichle(e.target.checked)} />} label="Final Manufractured Product (E-Vehicle)" />
        <ProductFeatureSection
          productFeatureMap={productFeatureMap}
          setProductFeatureMap={setProductFeatureMap}
          productFeatureList={productFeatureList}
          errors={errors}
        />

      </DialogContent>
    </Dialog>
  );
}

export default CreateEditProductDialog;
