import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUI } from "../../context/UIContext";

import {
  getBOMByProductIdService,
  saveOrUpdateBOMService,
} from "../../services/bomServices";
import * as XLSX from "xlsx";

function ManageBOMDialog({ open, handleClose, product, allProducts = [] }) {
  const [bomList, setBOMList] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const { showSnackbar, showLoader, hideLoader } = useUI()
  console.log("bomList", bomList);



const handleExportToExcel = () => {
  const productName = product?.productName || 'N/A';
  const productCode = product?.productCode || 'N/A';
  const todayDate = new Date().toLocaleDateString();

  const totalItems = bomList?.length || 0;

  const worksheetHeader = [
    ["Product Name", productName],
    ["Product Code", productCode],
    ["Grand Total", grandTotal],
    ["Total Items Needed", totalItems],
    ["Date", todayDate],
    [], // Empty row for spacing
  ];

  const worksheetColumns = [
    ["Component Name", "Product Code", "Quantity", "Unit", "Unit Price (Rs.)", "Total Price (Rs.)"],
  ];

  const worksheetData = bomList?.map(item => {
    const product = allProducts?.find(p => p.productId === Number(item.componentProductId)) || {};
    return [
      product.productName || 'N/A',
      product.productCode || 'N/A',
      item.quantity,
      item.unit || '',
      item.unitPrice || 0,
      (parseFloat(item.unitPrice || 0) * parseFloat(item.quantity || 0)).toFixed(2)
    ];
  });

  const finalSheet = [...worksheetHeader, ...worksheetColumns, ...worksheetData];

  const worksheet = XLSX.utils.aoa_to_sheet(finalSheet);

  // Set column widths for better display
  worksheet['!cols'] = [
    { wch: 30 }, // Component Name
    { wch: 20 }, // Product Code
    { wch: 10 }, // Quantity
    { wch: 10 }, // Unit
    { wch: 15 }, // Unit Price
    { wch: 15 }, // Total Price
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'BOM');

  XLSX.writeFile(workbook, `BOM_${productName.replace(/\s+/g, '_')}.xlsx`);
};


  useEffect(() => {
    if (open && product?.productId) {
      fetchBOM(product.productId);
    }
  }, [open, product]);
  useEffect(() => {
    const totalCost = bomList?.reduce((sum, item) => {
      const price = parseFloat(item.unitPrice || 0);
      const qty = parseFloat(item.quantity || 0);
      return sum + price * qty;
    }, 0);

    const roundedTotal = totalCost.toFixed(2);
    setGrandTotal(roundedTotal || 0);
  }, [open, bomList]);

  const fetchBOM = async (productId) => {
    try {
      showLoader()
      const res = await getBOMByProductIdService(productId);
      const processed = (res || []).map((item) => ({
        tempId: Date.now() + Math.random(),
        componentProductId: item.componentProductId,
        quantity: item.quantity,
        ...item,
      }));
      setBOMList(processed);
      hideLoader()
    } catch {
      hideLoader()
      setBOMList([]);
      showSnackbar('Failed to fetch BOM List', 'error')
    }
  };

  const handleAdd = () => {
    setBOMList((prev) => [
      ...prev,
      {
        tempId: Date.now(),
        componentProductId: "",
        quantity: 1,
      },
    ]);
  };

  const handleChange = (tempId, field, value) => {
    setBOMList((prev) =>
      prev.map((item) =>
        item.tempId === tempId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDelete = (tempId) => {
    setBOMList((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  const handleSave = async () => {
    showLoader()
    const bomDTO = {
      productId: product.productId,
      bomName: `BOM-${product.productId}`,
      componentList: bomList.map((c) => ({
        componentProductId: Number(c.componentProductId),
        quantity: Number(c.quantity),
        parentComponentId: null,
      })),
    };

    try {
      await saveOrUpdateBOMService(bomDTO);
      handleClose();
      hideLoader()
    } catch (err) {
      hideLoader()
      showSnackbar('Failed to save BOM', 'error')
      console.error("Error saving BOM:", err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Manage BOM for {product?.productName}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleExportToExcel}
            disabled={bomList?.length === 0}
            startIcon={<FileDownloadIcon />}
            sx={{ mb: 2 }}
          >
            Download Excel
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={handleAdd}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mb: 2 }}
          >
            Add Component
          </Button>
          <Typography fontWeight={500}>
            Grand Total: Rs. {grandTotal}
          </Typography>
        </Box>

        {bomList.length > 0 ? (
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price (Rs.)</TableCell>
                  <TableCell>Total Price (Rs.)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bomList.map((row) => {
                  console.log("row", row);
                  return (
                    <TableRow key={row.tempId}>
                      <TableCell>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={row.componentProductId || ""}
                          onChange={(e) => {
                            let selectedProduct =
                              allProducts?.find(
                                (x) => x.productId === e.target.value
                              ) || {};
                            handleChange(
                              row.tempId,
                              "componentProductId",
                              e.target.value
                            );
                            handleChange(
                              row.tempId,
                              "unit",
                              selectedProduct?.unit
                            );
                            handleChange(
                              row.tempId,
                              "unitPrice",
                              selectedProduct?.unitPrice
                            );
                          }}
                        >
                          <MenuItem value="">-- Select --</MenuItem>
                          {allProducts.map((p) => (
                            <MenuItem
                              key={p.productId}
                              value={p.productId}
                              unit={p.unit}
                            >
                              {p.productName} ({p.productCode})
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          fullWidth
                          value={row.quantity || ""}
                          onChange={(e) =>
                            handleChange(row.tempId, "quantity", e.target.value)
                          }
                          slotProps={{
                            input: {
                              endAdornment: (
                                <Typography sx={{ fontSize: "0.7rem", p: 1 }}>
                                  {row.unit}
                                </Typography>
                              ),
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          fullWidth
                          disabled
                          value={row.unitPrice || ""}
                          //onChange={(e) => handleChange(row.tempId, 'quantity', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          fullWidth
                          disabled
                          value={
                            (parseFloat(row.unitPrice) || 0) *
                            (parseFloat(row.quantity) || 0).toFixed(2)
                          }
                          //onChange={(e) => handleChange(row.tempId, 'quantity', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row.tempId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Typography>No BOM defined.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save BOM
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManageBOMDialog;
