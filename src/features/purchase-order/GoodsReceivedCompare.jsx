import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, IconButton, Alert, Stack,
    Table, TableHead, TableBody, TableRow, TableCell,
    Tooltip, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RuleIcon from '@mui/icons-material/Rule';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useNavigate } from 'react-router-dom';
import { getGRNsWithItemsByPOService } from '../../services/grnService';
import { getPOItemsByPOIdService } from '../../services/purchaseOrderService';
import dayjs from 'dayjs';
import { useUI } from '../../context/UIContext';
import { useTheme, alpha } from '@mui/material/styles';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';



function GoodsReceivedCompare({ open, onClose, poId, updatePOStatusAPICall }) {
    const { showLoader, hideLoader, showSnackbar } = useUI();
    const [poItems, setPoItems] = useState([]);
    const [grnItems, setGrnItems] = useState([]);

    const theme = useTheme(); // Access the theme palette

    // Define a consistent transparency level for subtle effects
    const subtleAlpha = 0.55; // 15% opacity, adjust as needed (0.1 to 0.3 is usually good)

    const getStatusColor = (poQty, totalReceivedQty) => {
        const pq = parseFloat(poQty);
        const rq = parseFloat(totalReceivedQty);

        if (isNaN(pq) || isNaN(rq)) {
            // Neutral color for invalid data, with transparency
            return alpha(theme.palette.grey[500], subtleAlpha);
        }

        if (rq === 0) {
            // Not started / Nothing received yet (Info color with transparency)
            return alpha(theme.palette.info.main, subtleAlpha);
        }
        if (rq < pq) {
            // Partially received (Warning color with transparency)
            return alpha(theme.palette.warning.main, subtleAlpha);
        }
        if (rq === pq) {
            // Fully received (Success color with transparency)
            return alpha(theme.palette.success.main, subtleAlpha);
        }
        if (rq > pq) {
            // Over-received (Error color with transparency)
            return alpha(theme.palette.error.main, subtleAlpha);
        }

        // Fallback for any unexpected scenario
        return alpha(theme.palette.grey[500], subtleAlpha);
    };



    const callInitialLists = () => {
        showLoader();
        Promise.all([
            getPOItemsByPOIdService(poId),
            getGRNsWithItemsByPOService(poId)
        ])
            .then(([poResp, grnResp]) => {
                const mappedItems = (poResp || []).map(item => ({
                    poItemId: item.po_item_id,
                    productId: item.product_id,
                    productName: item.product_name,
                    quantity: parseFloat(item.quantity || 0),
                    uom: item.uom,
                }));
                setPoItems(mappedItems);
                setGrnItems(grnResp || []);
            })
            .catch(() => {
                setPoItems([]);
                setGrnItems([]);
                showSnackbar('Failed to load PO and GRN Items', 'error')
            })
            .finally(() => hideLoader());
    }

    const navigate = useNavigate();

    const handleCreateGRN = () => {
        window.open('/inventoryManagemnt/grn', '_blank');
    };

    useEffect(() => {
        if (!open || !poId) return;
        callInitialLists()

    }, [open, poId]);

    const groupedGrn = grnItems.reduce((acc, grn) => {
        const key = grn.product_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(grn);
        return acc;
    }, {});

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Goods Received vs PO Comparison
                <IconButton
                    aria-label="refresh"
                    size="small"
                    onClick={() => { callInitialLists() }}
                    sx={{ ml: 1, backgroundColor: 'rgba(0, 123, 255, 0.1)' }}
                >
                    <AutorenewIcon />
                </IconButton>
                <IconButton
                    aria-label="close"
                    size="small"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {(grnItems.length === 0 && poItems.length > 0) ? (
                    <Stack spacing={2}>
                        <Alert
                            severity="warning"
                            action={
                                <Button
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCreateGRN}
                                >
                                    + Create GRN
                                </Button>
                            }
                        >
                            No GRN records found for this PO. You can create a new one.
                        </Alert>
                    </Stack>
                ) : poItems.length === 0 ? (
                    <Typography>No PO item data available.</Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>PO Qty</TableCell>
                                <TableCell>Total Received</TableCell>
                                <TableCell>Received Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {poItems.map((poItem) => {
                                const relatedGRNs = groupedGrn[poItem.productId] || [];
                                const totalReceived = relatedGRNs.reduce(
                                    (sum, item) => sum + parseFloat(item.quantity_received || 0),
                                    0
                                );
                                const statusColor = getStatusColor(poItem.quantity, totalReceived);

                                return (
                                    <TableRow key={poItem.poItemId}>
                                        <TableCell>{poItem.productName}</TableCell>
                                        <TableCell>{poItem.quantity}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    backgroundColor: statusColor,
                                                    color: 'black',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: '4px',
                                                    display: 'inline-block',
                                                    minWidth: 40,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {totalReceived}
                                            </Box>
                                        </TableCell>
                                       <TableCell colSpan={6} sx={{ p: 0, backgroundColor: '#f8f9fa' }}>
  <Box sx={{
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    mt: 1,
    mx: 1
  }}>
    <Table size="small" sx={{
      '& thead th': {
        backgroundColor: '#f0f4f8',
        fontWeight: 600,
        fontSize: '0.75rem',
        color: '#555',
        padding: '6px 8px',
      },
      '& tbody td': {
        fontSize: '0.72rem',
        color: '#333',
        padding: '6px 8px',
        borderBottom: '1px solid #eee',
      },
      '& tbody tr:last-child td': {
        borderBottom: 'none',
      },
      '& tbody tr:hover': {
        backgroundColor: '#f9f9f9',
      }
    }}>
      <TableHead>
        <TableRow>
          <TableCell>GRN #</TableCell>
          <TableCell>Date</TableCell>
          <TableCell align="right">Qty</TableCell>
          <TableCell align="right">Rate</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Remarks</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {relatedGRNs?.map((grn, i) => (
          <TableRow key={i}>
            <TableCell>{grn.grn_number}</TableCell>
            <TableCell>{dayjs(grn.grn_date).format('DD-MM-YYYY')}</TableCell>
            <TableCell align="right">{parseFloat(grn.quantity_received)}</TableCell>
            <TableCell align="right">₹{parseFloat(grn.unit_price).toFixed(2)}</TableCell>
            <TableCell align="right">₹{parseFloat(grn.total_amount).toFixed(2)}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{grn.remarks || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
</TableCell>


                                        {/* <TableCell>
                                           
                                            {relatedGRNs.map((grn) => {
                        console.log(relatedGRNs)
                        return <Tooltip
                          key={grn.grn_id || Math.random()}
                          title={`GRN: ${grn.grn_number}, Date: ${dayjs(grn.grn_date).format('DD-MM-YYYY')}`}
                        >
                          <Typography variant="body2">
                            {grn.quantity_received} @ {grn.unit_price} ({grn.uom})
                          </Typography>
                        </Tooltip>
              })}
                                        </TableCell> */}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>

            <DialogActions>
                <Button color="primary" variant="contained" onClick={() => { updatePOStatusAPICall(poId, 'GOOD RECEIVED FULL', false) }}>
                    <ChecklistRtlIcon sx={{ mr: 1 }} /> Mark as Received All Goods
                </Button>
                <Button onClick={() => { updatePOStatusAPICall(poId, 'GOOD RECEIVED PART', false) }} color="error" variant="outlined">
                    <RuleIcon sx={{ mr: 1 }} /> Mark as Goods Received Partially
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default GoodsReceivedCompare;
