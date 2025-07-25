import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Autocomplete  from "@mui/material/Autocomplete";
import Collapse from '@mui/material/Collapse';

import {useUI} from '../../context/UIContext'
import { useEffect } from "react";

const defaultItem = {
  productId: "",
  pName: "",
  poId: "",
  poItemId: "",
  quantity: "",
  receivedQuantity: "",
  unitPrice: "",
  uom: "",
  cgstPercent: 0,
  sgstPercent: 0,
  igstPercent: 0,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  totalAmount: 0,
  productDescription: ""
};


export default function GrnItemManager({ productList = [], taxTypeOrg, onItemsChange, poItems = [], setPoItems }) {
  //const [poItems, setPoItems] = useState([]);
  const [formItem, setFormItem] = useState(defaultItem);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [taxType, setTaxType] = useState('')
  const { showSnackbar, showLoader, hideLoader } = useUI();

  useEffect(() => {
    setTaxType(taxTypeOrg)
  }, [taxTypeOrg])

  const handleChange = (field, value) => {
    let updated = { ...formItem, [field]: value };

    if (field === "productId") {
      const selected = productList.find(p => p.productId === parseInt(value));
      if (selected) {
        updated.unitPrice = selected.unitPrice;
        updated.uom = selected.unit;
        updated.productDescription = selected.description;
        if(taxType === "INTER"){
      updated.cgstPercent = 0;
        updated.sgstPercent = 0;
        updated.igstPercent = parseFloat(selected.gstPercentagePurchase) ; // You may dynamically calculate based on state
        }
        else if(taxType === "INTRA"){
        updated.cgstPercent = parseFloat(selected.gstPercentagePurchase) / 2;
        updated.sgstPercent = parseFloat(selected.gstPercentagePurchase) / 2;
        updated.igstPercent = 0; // You may dynamically calculate based on state
        }
        
      }
    }

    // If quantity or price or GST changes
    if (["quantity", "receivedQuantity", "unitPrice", "cgstPercent", "sgstPercent", "igstPercent"].includes(field)) {
      const qty = parseFloat(updated.receivedQuantity || 0);
      const price = parseFloat(updated.unitPrice || 0);
      const baseAmount = qty * price;

      const cgst = (baseAmount * updated.cgstPercent) / 100;
      const sgst = (baseAmount * updated.sgstPercent) / 100;
      const igst = (baseAmount * updated.igstPercent) / 100;
      const total = baseAmount + cgst + sgst + igst;

      updated.cgstAmount = cgst;
      updated.sgstAmount = sgst;
      updated.igstAmount = igst;
      updated.totalAmount = total;
    }

    setFormItem(updated);
  };

  const handleAdd = () => {

    showSnackbar('Adding new items is not allowed. Only updates are permitted.', 'warning');
    return

    //if (!formItem.productId || !formItem.quantity || !formItem.unitPrice) return;
    // if(!taxType){
    //   showSnackbar('Please specify the tax type to add any item!', 'error')
    //   return
    // }
    // if(!formItem.productId){
    //   showSnackbar('Please select a product first to add!', 'error')
    //   return
    // }
    //  if(!formItem.quantity ){
    //   showSnackbar('Please specify  product quantity to add!', 'error')
    //   return
    // }
    // if(!formItem.unitPrice){
    //   showSnackbar('Please specify  product unit price to add!', 'error')
    //   return
    // }
    // const updated = [...poItems, { ...formItem }];
    // setPoItems(updated);
    // setFormItem(defaultItem);
    // onItemsChange && onItemsChange(updated);
  };

  const handleUpdate = () => {
    if(!taxType){
      showSnackbar('Please specify the tax type to add any item!', 'error')
      return
    }
    if(!formItem.productId){
      showSnackbar('Please select a product first to add!', 'error')
      return
    }
     if(!formItem.quantity ){
      showSnackbar('Please specify  product quantity to add!', 'error')
      return
    }
   if (!formItem.receivedQuantity || formItem.receivedQuantity < 0) {
  showSnackbar('Received Quantity must be a valid positive number.', 'error');
  return;
}
  
    if(!formItem.unitPrice){
      showSnackbar('Please specify  product unit price to add!', 'error')
      return
    }
    const updated = [...poItems];
    updated[editIndex] = { ...formItem };
    setPoItems(updated);
    setFormItem(defaultItem);
    setIsEdit(false);
    setEditIndex(null);
    onItemsChange && onItemsChange(updated);
  };

  const handleEdit = (index) => {
    setFormItem(poItems[index]);
    console.log("poItems[index]", poItems[index])
    setEditIndex(index);
    setIsEdit(true);
  };

  const handleDelete = (index) => {
    const updated = poItems.filter((_, i) => i !== index);
    setPoItems(updated);
    onItemsChange && onItemsChange(updated);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Received Goods</Typography>
        
          {taxType && <Box mt={3}>
              <TextField
                  fullWidth
                  size="small"
                  select
                  label="Tax Type"
                  value={taxType || ''}

                  onChange={(e) => {
                      setTaxType(e.target.value)
                  }}
              >
                  <MenuItem value="INTRA">CGST + SGST</MenuItem>
                  <MenuItem value="INTER">IGST</MenuItem>
              </TextField>
              <Typography mt={1} mb={3} ml={1} color={'error'} variant="caption">**Please note that, Tax type mentioned in PO is {taxTypeOrg ? (taxTypeOrg === "INTRA" ? "CGST + SGST" : "IGST") : "-"}</Typography>
          </Box>}

    
<Collapse in={isEdit} timeout={400}>
<Paper
  elevation={3}
  sx={{
    p: 3,
    borderRadius: 2,
    backgroundColor: "#f9f9f9",
    mb: 3,
    mt:1
  }}
>
  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb:2 }}>
    Update GRN Items
  </Typography>

  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={4}>
     <TextField
        fullWidth
        label="Product Name"
        size="small"
       
        value={formItem.pName}
        onChange={(e) => handleChange("pName", e.target.value)}
        disabled
      />
    </Grid>

    <Grid item xs={6} sm={3} md={2}>
      <TextField
        fullWidth
        label="Quantity mention in PO"
        size="small"
        type="number"
        value={formItem.quantity}
        onChange={(e) => handleChange("quantity", e.target.value)}
        disabled
      />
    </Grid>
    <Grid item xs={6} sm={3} md={2}>
      <TextField
        fullWidth
        label="Received Quantity"
        size="small"
        type="number"
        value={formItem.receivedQuantity}
        onChange={(e) => handleChange("receivedQuantity", e.target.value)}
    
      />
    </Grid>

    <Grid item xs={6} sm={3} md={2}>
      <TextField
        fullWidth
        label="UOM"
        size="small"
        value={formItem.uom}
        disabled
      />
    </Grid>

    <Grid item xs={6} sm={3} md={2}>
      <TextField
        fullWidth
        label="Unit Price"
        size="small"
        type="number"
        value={formItem.unitPrice}
        onChange={(e) => handleChange("unitPrice", e.target.value)}
      />
    </Grid>

    

    <Grid item xs={4} sm={2}>
      <TextField
        fullWidth
        label="CGST %"
        size="small"
        type="number"
        value={formItem.cgstPercent}
        onChange={(e) => handleChange("cgstPercent", e.target.value)}
      />
    </Grid>

    <Grid item xs={4} sm={2}>
      <TextField
        fullWidth
        label="SGST %"
        size="small"
        type="number"
        value={formItem.sgstPercent}
        onChange={(e) => handleChange("sgstPercent", e.target.value)}
      />
    </Grid>

    <Grid item xs={4} sm={2}>
      <TextField
        fullWidth
        label="IGST %"
        size="small"
        type="number"
        value={formItem.igstPercent}
        onChange={(e) => handleChange("igstPercent", e.target.value)}
      />
    </Grid>

    <Grid item xs={12} sm={3} md={2}>
      <TextField
        fullWidth
        label="Total"
        size="small"
        value={Number(formItem.totalAmount || 0).toFixed(2)}
        disabled
      />
    </Grid>

    <Grid item xs={12} sm={4} md={3} alignSelf="center">
      <Button
        fullWidth
        variant={isEdit ? "contained" : "outlined"}
        onClick={isEdit ? handleUpdate : handleAdd}
        sx={{ height: "100%" }}
      >
        { "Update Item" }
      </Button>
    </Grid>
  </Grid>
</Paper>
</Collapse>


      {/* Table View */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sl.</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Qty PO</TableCell>
            <TableCell>Received</TableCell>
            <TableCell>UOM</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>CGST</TableCell>
            <TableCell>SGST</TableCell>
            <TableCell>IGST</TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {poItems?.length>0 ? poItems.map((item, index) => {
           
            return (
              <TableRow key={index} sx={{backgroundColor: parseFloat(item.quantity || 0) > parseFloat(item.receivedQuantity || 0) ? 'error.light' : parseFloat(item.quantity || 0) < parseFloat(item.receivedQuantity || 0) && 'success.light'  }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.pName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.receivedQuantity}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <Typography>{Number(item.cgstAmount || 0).toFixed(2)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Number(item.cgstPercent || 0).toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                   <Box display="flex" flexDirection="column">
                    <Typography>{Number(item.sgstAmount || 0).toFixed(2)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Number(item.sgstPercent || 0).toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                   <Box display="flex" flexDirection="column">
                    <Typography>{Number(item.igstAmount || 0).toFixed(2)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Number(item.igstPercent || 0).toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{Number(item.totalAmount || 0).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  {/* <IconButton color="error" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            );
          }) : <TableRow><TableCell align="center" colSpan={10}>No Items Added.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </Box>
  );
}
