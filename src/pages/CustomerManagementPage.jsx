import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Search } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BadgeIcon from '@mui/icons-material/Badge';
import OrderPaymentHistoryDialog from '../features/sales-order/OrderPaymentHistoryDialog';
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import PageWrapper from '../layouts/PageWrapper';
import { getAllCustomersService, saveOrUpdateCustomerService } from '../services/customerService';
import { useUI } from '../context/UIContext';
import { getAcceessMatrix } from '../utils/loginUtil';



const defaultCustomer = {
  customerId: null,
  customerName: '',
  customerCode: '',
  email: '',
  phone: '',
  pan: '',
  gstin: '',
  addressline1: '' ,
  addressline2: '',
  city: '',
  district: '' ,
  state: '',
  pincode: '',
  country : '' 
};

export default function CustomerManagementPage() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [customers, setCustomers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(defaultCustomer);
  const [accessMatrix, setAccessMatrix] = useState({});
   const [openOrderPaymentDialog, setOpenOrderPaymentDialog] = useState(false);

  useEffect(() => {
    fetchCustomers();
    const access = getAcceessMatrix('Dealer and Customer Management', 'Customer Management');
    setAccessMatrix(access);
  }, []);

  const fetchCustomers = async () => {
    showLoader()
    try {
      const data = await getAllCustomersService();
      setCustomers(data);
    } catch (err) {
      showSnackbar('Failed to fetch customers', 'error');
    }
    hideLoader()
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {

    const { customerName, customerCode, email, phone, pan, gstin } = formData;

    // Validation
    if (!customerName || !customerCode || !phone) {
      return showSnackbar('All fields are required except PAN/GST and email.', 'warning');
    }
    if (!pan && !gstin) {
      return showSnackbar('Either PAN or GSTIN is required.', 'warning');
    }

    showLoader()
    try {
      await saveOrUpdateCustomerService(formData);
      showSnackbar('Customer saved successfully', 'success');
      setOpenDialog(false);
      fetchCustomers();
    } catch (err) {
      showSnackbar('Error saving customer', 'error');
    }
    hideLoader()
  };

  const handleAdd = () => {
    setFormData(defaultCustomer);
    setOpenDialog(true);
  }

  const ActionButtonsArr = [
    {
      showHeaderButton: true,
      buttonText: 'Add Customer',
      buttonCallback: () => { handleAdd() },
      buttonIcon: <Add fontSize='small' />,
      access: accessMatrix?.create ?? false,
    }
  ];


  return (
    <PageWrapper title="Customer Management" actionButtons={ActionButtonsArr}>

    <Box m={2}>
         <Grid container spacing={3}>
        {customers?.map(customer => (
          <Grid item xs={12} sm={6} md={3} key={customer.customerId}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 8
                }
              }}
            >
              {/* Card Header with Gradient and Icon */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #025f21ff, #2dbd10ff)',
                  color: '#fff',
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                {/* <Box
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    p: 1
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Box> */}
                <Box
  sx={{
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    p: 1,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#fff',
    textTransform: 'uppercase'
  }}
>
  {customer.customerName?.charAt(0) || '?'}
</Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {customer.customerName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Code: {customer.customerCode}
                  </Typography>
                </Box>
              </Box>

              {/* Card Content */}
              <CardContent sx={{ backgroundColor: '#fafafa', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{customer.phone || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{customer.email || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CreditCardIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">PAN: {customer.pan || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BadgeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">GSTIN: {customer.gstin || 'N/A'}</Typography>
                </Box>
              </CardContent>

              {/* Actions */}
              <DialogActions sx={{ px: 3, pb: 2, alignItems: 'flex-end', gap: 1, flexDirection: 'column-reverse', backgroundColor: '#fafafa' }}>
                
                   <Box  sx={{display: 'flex', justifyContent: 'flex-end', gap: 1}}>
 <Button
                                variant='contained'
                                size="small"
                                onClick={() => {
                                  setFormData(customer)
                                  setOpenOrderPaymentDialog(true)
                                }}
                                startIcon={<AccountBalanceWalletIcon />}
                              >
                                Order & Payments
                              </Button>
                   </Box>
                     <Box  sx={{display: 'flex', justifyContent: 'flex-end', gap: 1}}>
<Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setFormData(customer);
                    setOpenDialog(true);
                  }}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 'none'
                  }}
                >
                  Edit
                </Button>
                     </Box>
                
                             
                
              </DialogActions>
            </Card>
          </Grid>
        ))}
      </Grid>


    </Box>
   

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{formData.customerId ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Customer Name"
            value={formData.customerName} onChange={e => handleChange('customerName', e.target.value)}
          />
          <TextField
            fullWidth margin="dense" label="Customer Code"
            value={formData.customerCode} onChange={e => handleChange('customerCode', e.target.value)}
          />
          <TextField
            fullWidth margin="dense" label="Mobile"
            value={formData.phone} onChange={e => handleChange('phone', e.target.value)}
          />
          <TextField
            fullWidth margin="dense" label="Email"
            value={formData.email} onChange={e => handleChange('email', e.target.value)}
          />
          <TextField
            fullWidth margin="dense" label="PAN Number"
            value={formData.pan} onChange={e => handleChange('pan', e.target.value)}
          />
          <TextField
            fullWidth margin="dense" label="GST Number"
            value={formData.gstin} onChange={e => handleChange('gstin', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <OrderPaymentHistoryDialog open={openOrderPaymentDialog} 
            onClose={() => {
              setFormData(defaultCustomer || {})
              setOpenOrderPaymentDialog(false)
            }} 
            customerId={formData?.customerId}
            buyerName = {formData?.customerName}
            />

    </PageWrapper>
  );
}
