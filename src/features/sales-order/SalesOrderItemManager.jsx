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
import {useUI} from '../../context/UIContext'

const defaultItem = {
  productId: "",
  quantity: "",
  unitPrice: "",
  uom: "",
  productName: "",
  hsnCode: "",
  availableQuantity: 0,
  discountPercent: 0,
  discountAmount: 0,
  cgstPercent: 0,
  sgstPercent: 0,
  igstPercent: 0,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  totalAmount: 0,
  productDescription: ""
};


export default function SalesOrderItemManager({ productList = [], taxType, onItemsChange, poItems = [], setPoItems }) {
  //const [poItems, setPoItems] = useState([]);
  const [formItem, setFormItem] = useState(defaultItem);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const { showSnackbar, showLoader, hideLoader } = useUI();

  const handleChange = (field, value) => {
    let updated = { ...formItem, [field]: value };

    if (field === "productId") {
      const selected = productList.find(p => p.productId === parseInt(value));
      if (selected) {
        updated.unitPrice = selected.unitPrice;
        updated.productName = selected.productName;
        updated.uom = selected.uom;
        updated.availableQuantity =  selected.availableQuantity
        updated.productDescription = selected.description;
        updated.hsnCode = selected.hsnCode;
        updated.discountPercent = 0;

        if(taxType === "INTER"){
      updated.cgstPercent = 0;
        updated.sgstPercent = 0;
        updated.igstPercent = parseFloat(selected.gstPercentage || 0) ; // You may dynamically calculate based on state
        }
        else if(taxType === "INTRA"){
        updated.cgstPercent = parseFloat(selected.gstPercentage || 0) / 2;
        updated.sgstPercent = parseFloat(selected.gstPercentage || 0) / 2;
        updated.igstPercent = 0; // You may dynamically calculate based on state
        }
        
      }
    }

    // If quantity or price or GST changes
    if (["quantity", "unitPrice", "cgstPercent", "sgstPercent", "igstPercent", "discountPercent"].includes(field)) {
      const qty = parseFloat(updated.quantity || 0);
      const price = parseFloat(updated.unitPrice || 0);
       const discount = parseFloat((( qty * price * updated.discountPercent) / 100) || 0);
      const baseAmount = (qty * price) - discount ;


      const cgst = (baseAmount * updated.cgstPercent) / 100;
      const sgst = (baseAmount * updated.sgstPercent) / 100;
      const igst = (baseAmount * updated.igstPercent) / 100;

      
     
      const total = baseAmount + cgst + sgst + igst ;

      updated.discountAmount =  discount
      updated.cgstAmount = cgst;
      updated.sgstAmount = sgst;
      updated.igstAmount = igst;
      updated.totalAmount = total;
    }

    setFormItem(updated);
  };

  const handleAdd = () => {
    //if (!formItem.productId || !formItem.quantity || !formItem.unitPrice) return;
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
    if( Number(formItem.quantity || 0) <= 0){
      showSnackbar('Product quantity should be positive number!', 'error')
      return
    }
    if( Number(formItem.quantity || 0) > Number(formItem.availableQuantity || 0)){
      showSnackbar('Product quantity can not be greater than available quantity in the location!', 'error')
      return
    }
    if(!formItem.unitPrice){
      showSnackbar('Please specify  product unit price to add!', 'error')
      return
    }
    const updated = [...poItems, { ...formItem }];
    setPoItems(updated);
    setFormItem(defaultItem);
    onItemsChange && onItemsChange(updated);
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
      if( Number(formItem.quantity || 0) <= 0){
      showSnackbar('Product quantity should be positive number!', 'error')
      return
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
      <Typography variant="h6" gutterBottom>Order Items</Typography>

      {/*
      <Stack spacing={2} direction="row" flexWrap="wrap" mb={2}>
        <TextField
          select
          label="Product"
          size="small"
          sx={{ minWidth: 200 }}
          value={formItem.productId}
          onChange={(e) => handleChange("productId", e.target.value)}
        >
          {productList.map((p) => (
            <MenuItem key={p.productId} value={p.productId}>
              {p.productName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Quantity"
          size="small"
          type="number"
          value={formItem.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
        />

        <TextField
          label="Unit Price"
          size="small"
          type="number"
          value={formItem.unitPrice}
          onChange={(e) => handleChange("unitPrice", e.target.value)}
        />

        <TextField
          label="UOM"
          size="small"
          value={formItem.uom}
          disabled
        />

        <TextField
          label="CGST %"
          size="small"
          type="number"
          value={formItem.cgstPercent}
          onChange={(e) => handleChange("cgstPercent", e.target.value)}
        />

        <TextField
          label="SGST %"
          size="small"
          type="number"
          value={formItem.sgstPercent}
          onChange={(e) => handleChange("sgstPercent", e.target.value)}
        />

        <TextField
          label="IGST %"
          size="small"
          type="number"
          value={formItem.igstPercent}
          onChange={(e) => handleChange("igstPercent", e.target.value)}
        />

        <TextField
          label="Total"
          size="small"
          value={formItem.totalAmount.toFixed(2)}
          disabled
        />

        <Box alignSelf="center">
          <Button variant={isEdit ? "contained" : "outlined"} onClick={isEdit ? handleUpdate : handleAdd}>
            {isEdit ? "Update Item" : "Add Item"}
          </Button>
        </Box>
      </Stack> 
      */}

      <Paper
  elevation={3}
  sx={{
    p: 3,
    borderRadius: 2,
    backgroundColor: "#f9f9f9",
    mb: 3,
  }}
>
  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb:2 }}>
    Add Items
  </Typography>

  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={4}>
      {/*<TextField
        select
        fullWidth
        label="Product"
        size="small"
        value={formItem.productId}
        onChange={(e) => handleChange("productId", e.target.value)}
      >
        {productList.map((p) => (
          <MenuItem key={p.productId} value={p.productId}>
            {p.productName}
          </MenuItem>
        ))}
      </TextField>*/}
      <Autocomplete
        fullWidth
        size="small"
        options={productList}
        getOptionLabel={(option) => `${option.productName} - ${option.productCode}`  || ""}
        value={productList.find(p => p.productId === formItem.productId) || null}
        onChange={(e, newValue) => handleChange("productId", newValue?.productId || "")}
        renderInput={(params) => (
          <TextField {...params} label="Product" variant="outlined" />
        )}
      />
    </Grid>
     <Grid item xs={6} sm={3} md={2}>
      <TextField
        fullWidth
        label="Available Quantity"
        size="small"
        type="text"
        value={`${formItem.availableQuantity || 0} ${formItem.uom}`}
        disabled
      />
     </Grid>
    

    <Grid item xs={6} sm={3} md={2}>
      <TextField
        fullWidth
        label="Quantity"
        size="small"
        type="number"
        value={formItem.quantity}
        onChange={(e) => handleChange("quantity", e.target.value)}
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
        label="Discount %"
        size="small"
         type="number"
        value={formItem.discountPercent}
        onChange={(e) => handleChange("discountPercent", e.target.value)}
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

    <Grid item xs={12} sm={4} md={2} alignSelf="center">
      <Button
        fullWidth
        variant={isEdit ? "contained" : "outlined"}
        onClick={isEdit ? handleUpdate : handleAdd}
        sx={{ height: "100%" }}
      >
        {isEdit ? "Update Item" : "+ Add Item"}
      </Button>
    </Grid>
  </Grid>
</Paper>

      {/* Table View */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sl.</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>UOM</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Before Tax</TableCell>
            <TableCell>CGST</TableCell>
            <TableCell>SGST</TableCell>
            <TableCell>IGST</TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {poItems?.length>0 ? poItems.map((item, index) => {
           // const product = productList?.find(p => p.productId == item.productId);
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography> {item?.productName || item.productId}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      HSN: {item.hsnCode ? item.hsnCode : "Not Available" }
                    </Typography>
                 </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <Typography>{Number(item.discountAmount || 0).toFixed(2)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Number(item.discountPercent || 0).toFixed(2)}%
                    </Typography>
                    {parseFloat(item.quantity || 0) >  1 && (parseFloat(item.discountPercent || 0)) > 0 && <Typography fontSize="0.6rem" color="text.secondary">
                      {` ₹${Number(parseFloat(item.discountPercent || 0) * 0.01 * parseFloat(item.unitPrice || 0)).toFixed(2)}/unit`}
                    </Typography>}
                  </Box>
                </TableCell>
                <TableCell>
                  
                  {Number(parseFloat(item.unitPrice || 0) * parseFloat(item.quantity || 0) - parseFloat(item.discountAmount || 0)).toFixed(2)}</TableCell>
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
                  <IconButton color="error" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          }) : <TableRow><TableCell align="center" colSpan={10}>No Items Added.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </Box>
  );
}
