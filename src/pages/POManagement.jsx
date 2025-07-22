import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { getPOSummaryService, listAllPOsService, saveOrUpdatePOService } from '../services/purchaseOrderService';
import { getAllVendorsService } from '../services/vendorService';
import Close from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import CreateOrEditPOForm from '../features/purchase-order/CreateOrEditPOForm';
import PageWrapper from '../layouts/PageWrapper';
import { useUI } from '../context/UIContext';
import { getAcceessMatrix } from '../utils/loginUtil';
import { getAllLocationListService } from '../services/locationService';
import { getAllProductsService } from '../services/productService';
import { useTheme } from '@emotion/react';



const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return 'warning';
    case 'SUBMITTED': return 'primary';
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'error';
    default: return 'default';
  }
};

const PoManagement = () => {
  const theme = useTheme();

  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [poList, setPoList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [filters, setFilters] = useState({
    vendorId: '',
    vendorName: '',
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
  });
  const [accessMatrix, setAccessMatrix] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [mode, setMode] = useState('create');

  useEffect(() => {
    getLocationListAPICall(true)
    getProductListAPICall(true)
    fetchVendors(true);
    fetchPOs();
    const access = getAcceessMatrix('Inventory Management', 'Purchase Order');
    setAccessMatrix(access);
  }, []);

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


  const getLocationListAPICall = (hideSnackbar) => {
    showLoader();
    getAllLocationListService()
      .then(res => {
        if (res && res.length > 0) {
          setLocationList(res);
          !hideSnackbar && showSnackbar('Locations fetched successfully!', 'success');
        } else {
          setLocationList([]);
          !hideSnackbar && showSnackbar('No Locations found!', 'warning');
        }
        hideLoader();
      })
      .catch(error => {
        console.error('Error fetching Locations!', error);
        setLocationList([]);
        hideLoader();
        showSnackbar('Failed to fetch Locations!', 'error');
      });
  };


  const fetchVendors = (hideSnackbar) => {
    showLoader();

    getAllVendorsService()
      .then((res) => {
        if (res && res.length > 0) {
          setVendorList(res);
          !hideSnackbar && showSnackbar('Vendor list fetched successfully!', 'success');
        } else {
          setVendorList([]);
          showSnackbar('Vendor list is empty!', 'warning');
        }
      })
      .catch((error) => {
        console.error('Error fetching vendors:', error);
        setVendorList([]);
        showSnackbar('Failed to fetch vendor list!', 'error');
      })
      .finally(() => {
        hideLoader();
      });
  };


  const fetchPOs = (hideSnackbar) => {
    if (!filters.startDate || !filters.endDate) {
      setError('Start Date and End Date are required.');
      setPoList([])
      return;
    }
    if (!filters.vendorId) {
      setError('Vendor is required. Please select vendor first to get PO list!');
      setPoList([])
      return;
    }

    if (dayjs(filters.endDate).isBefore(dayjs(filters.startDate))) {
      setError('End Date cannot be earlier than Start Date.');
      setPoList([])
      return;
    }

    setError('');
    showLoader();

    listAllPOsService(
      filters.startDate,
      filters.endDate,
      filters.vendorId
    )
      .then((res) => {
        if (res && res.length > 0) {
          setPoList(res);
          !hideSnackbar && showSnackbar('Purchase orders fetched successfully!', 'success');
        } else {
          setPoList([]);
          !hideSnackbar && showSnackbar('No purchase orders found!', 'warning');
        }
      })
      .catch((error) => {
        console.error('Error fetching POs:', error);
        !hideSnackbar && showSnackbar('Failed to fetch purchase orders!', 'error');
        setPoList([]);

      })
      .finally((d) => {
        console.log("d", hideSnackbar)
        hideLoader();
      });
  };


  const handleStatusChange = async (poId, newStatus) => {
    await saveOrUpdatePOService({ poId, status: newStatus });
    fetchPOs();
  };

  const handleDialogOpen = (po = null, currMode) => {
    setEditData(po);
    setMode(currMode)
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditData(null);
    setOpenDialog(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Create PO',
      buttonCallback: () => { handleDialogOpen() },
      buttonIcon: <AddIcon fontSize='small' />,
      access: true //accessMatrix?.create ?? false,
    }
  ];

  return (
    <PageWrapper title={"Purchase Order Management"} actionButtons={ActionButtonsArr} >
      <Box>
        {/* <Typography variant="h5" gutterBottom>Purchase Order Management</Typography> */}

        <Stack direction="row" spacing={2} my={2} flexWrap="wrap" alignItems="center" justifyContent={"center"}>
          {/* <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Vendor</InputLabel>
                        <Select
                            value={filters.vendorId}
                            label="Vendor"
                            onChange={(e) => handleFilterChange('vendorId', e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {vendorList.map((v) => (
                                <MenuItem key={v.vendorId} value={v.vendorId}>
                                    {v.vendorName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

          <Autocomplete
            size="small"
            options={vendorList}
            getOptionLabel={(option) => option.vendorName || ''}
            value={vendorList.find(v => v.vendorId === filters.vendorId) || null}
            onChange={(event, newValue) => {
              setFilters(prev => ({
                ...prev,
                vendorId: newValue?.vendorId || '',
                vendorName: newValue?.vendorName || ''
              }));
              setPoList([])
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Vendor"
                variant="outlined"
                size="small"
                fullWidth // makes it match width of typical input like date
              />
            )}
            isOptionEqualToValue={(option, value) => option.vendorId === value.vendorId}
            renderOption={(props, option) => (
              <li
                {...props}
                style={{
                  color: option.status ? '#1976d2' : '#d32f2f',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                {option.vendorName}
              </li>
            )}
            sx={{ minWidth: 180 }} // Adjust to match your date field width exactly
          />

          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date"
            type="date"
            size="small"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button variant="contained" onClick={() => { fetchPOs() }}>
            Get PO List
          </Button>

        </Stack>

        {error && (
          <Box display={'flex'} justifyContent={'center'}>

            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          </Box>
        )}

        {/* <Grid container spacing={2}>
                    {poList.map((po) => (
                        <Grid item xs={12} md={6} key={po.poId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">PO Number: {po.poNumber}</Typography>
                                    <Typography>Vendor: {po.vendorName}</Typography>
                                    <Typography>Status: <Chip label={po.status} size="small" /></Typography>
                                    <Typography variant="subtitle2" mt={1}>Items:</Typography>
                                    <ul>
                                        {po?.poItems?.map(item => (
                                            <li key={item.itemId}>{item.productName} - {item.quantity} {item.unit}</li>
                                        ))}
                                    </ul>
                                    {po.status === 'DRAFT' && (
                                        <Stack direction="row" spacing={1}>
                                            <Button size="small" onClick={() => handleDialogOpen(po)}>Edit</Button>
                                            <Button size="small" color="success" onClick={() => handleStatusChange(po.poId, 'SUBMITTED')}>Submit</Button>
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid> */}
        <Grid container spacing={3} >
          {poList?.map((po, index) => (
            <Grid item xs={12} sm={6} md={4} key={po.po_id}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #e3f2fd, #fce4ec)',
                  border: '1px solid #bbdefb',
                  borderRadius: 3,
                  boxShadow: 2,
                  height: '100%',
                  display: 'flex',
                  m: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="overline" color="text.secondary">
                      #{index + 1}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        backgroundColor: '#90caf9',
                        color: '#0d47a1',
                        borderRadius: 1,
                        fontWeight: 600,
                      }}
                    >
                      {po.po_number}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 600 }}>
                      ₹ {po.total_amount ?? '—'}
                    </Typography>
                    <Chip
                      size="small"
                      color={getStatusColor(po.status)}
                      sx={{ fontSize: '0.6rem' }}
                      label={po.status}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    <strong>Vendor:</strong> {filters.vendorName || '—'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    <strong>Tax:</strong> {(po.tax_type === "INTER" ? "IGST" : "CGST + SGST") || '—'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Delivery Terms:</strong> {po.delivery_terms || '—'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Payment Terms:</strong> {po.payment_terms || '—'}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>PO Date:</strong> {dayjs(po.poDate).format('DD MMMM YYYY') || '—'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Expected Delivery Date:</strong> {dayjs(po.expected_delivery_date).format('DD MMMM YYYY') || '—'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  {po.status === "DRAFT" && <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<Edit />}
                    onClick={() => handleDialogOpen(po, 'edit')}
                  >
                    Edit
                  </Button>}
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<Visibility />}
                    onClick={() => handleDialogOpen(po, 'view')}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {openDialog && (
          <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="lg" fullWidth>
            <DialogTitle>
              {mode === 'view' ? 'View Purchase Order' : editData ? 'Edit Purchase Order' : 'Create Purchase Order'}
              <IconButton onClick={handleDialogClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <CreateOrEditPOForm
                editData={editData}
                onClose={handleDialogClose}
                onSuccess={() => { fetchPOs(true) }}
                vendorList={vendorList}
                locationList={locationList}
                productList={productList}
                mode={mode}
              />
              {/* <PurchaseOrderA4View poData = {data}/> */}
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </PageWrapper>
  );

};

export default PoManagement;
