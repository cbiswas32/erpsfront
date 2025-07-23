import React, { useEffect, useState } from 'react';
import {
  Box, Button, Grid, TextField, Autocomplete,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { saveOrUpdateInvoiceService } from '../../services/invoicePaymentsService';
import { useUI } from '../../context/UIContext';
import { listAllPOsByVendorService } from '../../services/purchaseOrderService';

const InvoiceForm = ({ invoice, onClose, onSaved, vendorList }) => {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [poList, setPoList] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);

  const [form, setForm] = useState({
    invoiceNumber: '',
    invoiceDate: dayjs().format('YYYY-MM-DD'),
    vendorId: '',
    poId: '',
    invoiceAmount: '',
    cgstAmount: '',
    sgstAmount: '',
    igstAmount: '',
    totalTaxAmount: '',
    totalInvoiceAmount: '',
    remarks: '',
  });

  useEffect(() => {
    if (invoice) {
      setForm({
        invoiceNumber: invoice.invoice_number,
        invoiceDate: dayjs(invoice.invoice_date).format('YYYY-MM-DD'),
        vendorId: invoice.vendor_id,
        poId: invoice.po_id,
        invoiceAmount: invoice.invoice_amount,
        cgstAmount: invoice.cgst_amount,
        sgstAmount: invoice.sgst_amount,
        igstAmount: invoice.igst_amount,
        totalTaxAmount: invoice.total_tax_amount,
        totalInvoiceAmount: invoice.total_invoice_amount,
        remarks: invoice.remarks || '',
      });

      if (invoice.vendor_id) {
        fetchALLPOsByVendors(invoice.vendor_id);
      }
    }
  }, [invoice]);
  useEffect(() => {
  const invoiceAmount = parseFloat(form.invoiceAmount) || 0;
  const cgst = parseFloat(form.cgstAmount) || 0;
  const sgst = parseFloat(form.sgstAmount) || 0;
  const igst = parseFloat(form.igstAmount) || 0;

  const totalTax = cgst + sgst + igst;
  const totalInvoice = invoiceAmount + totalTax;

  setForm(prev => ({
    ...prev,
    totalTaxAmount: totalTax.toFixed(2),
    totalInvoiceAmount: totalInvoice.toFixed(2),
  }));
}, [form.invoiceAmount, form.cgstAmount, form.sgstAmount, form.igstAmount]);


  const fetchALLPOsByVendors = (vendorId) => {
    showLoader();
    listAllPOsByVendorService(vendorId)
      .then((res) => setPoList(res || []))
      .catch(() => showSnackbar('Failed to fetch PO list', 'error'))
      .finally(() => hideLoader());
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const { invoiceNumber, vendorId, poId, totalInvoiceAmount, totalTaxAmount } = form;

    if (!invoiceNumber || !vendorId || !poId) {
      showSnackbar('Please fill required fields - invoice number, vendor, po number', 'error');
      return;
    }
    //console.log(parseFloat(totalInvoiceAmount || 0) <= 0)
    if(parseFloat(totalInvoiceAmount || 0) <= 0){
         showSnackbar('Total Invoice Amount can not be zero!', 'error');
         return;
    }

    if(parseFloat(totalTaxAmount || 0) < 0){
         showSnackbar('Total Tax Amount can not be negetive!', 'error');
         return;
    }

    showLoader();

    saveOrUpdateInvoiceService({
      ...form,
      invoiceId: invoice?.invoice_id || null
    })
      .then(() => {
        showSnackbar('Invoice saved successfully', 'success');
        onSaved?.();
      })
      .catch(() => showSnackbar('Failed to save invoice', 'error'))
      .finally(() => hideLoader());
  };

  return (
    <Box mt={2}>
      <Grid container spacing={2}>
         <Grid item xs={6}>
          <Autocomplete
            size="small"
            options={vendorList}
            getOptionLabel={(o) => o.vendorName || ''}
            value={vendorList.find(v => v.vendorId === form.vendorId) || null}
            onChange={(_, newValue) => {
              handleChange('vendorId', newValue?.vendorId || '');
              handleChange('poId', '');
              fetchALLPOsByVendors(newValue?.vendorId);
            }}
            renderInput={(params) => <TextField {...params} label="Vendor" />}
          />
        </Grid>

        <Grid item xs={6}>
          <Autocomplete
            size="small"
            options={poList}
            getOptionLabel={(o) => o.po_number || ''}
            value={poList.find(p => p.po_id === form.poId) || null}
            onChange={(_, newValue) => {
                handleChange('poId', newValue?.po_id || '')
                if(newValue?.po_id){
                    setSelectedPO(poList.find(p => p.po_id === newValue.po_id))
                }
            }}
            renderInput={(params) => <TextField {...params} label="PO Number" />}
          />
        </Grid>
       {selectedPO && typeof selectedPO === 'object' && Object.keys(selectedPO).length > 0 && (
  <Grid item xs={12}>
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        background: '#f9f9f9',
        boxShadow: 1,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Selected Purchase Order
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">PO Number</Typography>
          <Typography variant="body1">{selectedPO.po_number}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Status</Typography>
          <Typography variant="body1">{selectedPO.status}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Total Amount</Typography>
          <Typography variant="body1">₹ {parseFloat(selectedPO.total_amount).toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Payment Terms</Typography>
          <Typography variant="body1">{selectedPO.payment_terms}</Typography>
        </Grid>
      </Grid>
    </Box>
  </Grid>
)}

        <Grid item xs={12}>
          <TextField
            fullWidth
             size="small"
            label="Invoice Number"
            value={form.invoiceNumber}
            onChange={e => handleChange('invoiceNumber', e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
             size="small"
            label="Invoice Date"
            type="date"
            value={form.invoiceDate}
            onChange={e => handleChange('invoiceDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

       

        <Grid item xs={6}>
          <TextField
            fullWidth
             size="small"
            label="Invoice Amount"
            type="number"
            value={form.invoiceAmount}
            onChange={e => handleChange('invoiceAmount', e.target.value)}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
             size="small"
            label="CGST"
            type="number"
            value={form.cgstAmount}
            onChange={e => handleChange('cgstAmount', e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="SGST"
             size="small"
            type="number"
            value={form.sgstAmount}
            onChange={e => handleChange('sgstAmount', e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="IGST"
             size="small"
            type="number"
            value={form.igstAmount}
            onChange={e => handleChange('igstAmount', e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
             size="small"
            label="Total Tax Amount"
            type="number"
            value={form.totalTaxAmount}
            onChange={e => handleChange('totalTaxAmount', e.target.value)}
            disabled
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
             size="small"
            label="Total Invoice Amount"
            type="number"
            value={form.totalInvoiceAmount}
            onChange={e => handleChange('totalInvoiceAmount', e.target.value)}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
          multiline
          rows={2}
            fullWidth
            size="small"
            label="Remarks"
            value={form.remarks}
            onChange={e => handleChange('remarks', e.target.value)}
           
          />
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleSubmit}>
            {invoice ? 'Update' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceForm;
