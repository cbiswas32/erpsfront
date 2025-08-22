import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { listInactiveSalesmenService } from "../../services/dashboardService";

function InactiveSalesmenTable() {
  const [salesmenList, setSalesmenList] = useState([]);
  const [period, setPeriod] = useState(1); // default "today"
  const [loading, setLoading] = useState(false);

  const fetchInactiveSalesmen = async () => {
    try {
      setLoading(true);
      const data = await listInactiveSalesmenService(period);
      setSalesmenList(data);
    } catch (error) {
      console.error("Error fetching inactive salesmen:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveSalesmen();
  }, [period]);

  return (
    <Box p={0.5}>
     {/* Duration Filter Section */}
<Box
  sx={{
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 3,
    p: 2,
    mb: 2,
    borderRadius: 2,
    bgcolor: "background.paper",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
  }}
>
  {/* Left: Dropdown box (1/3) */}
  <Box sx={{ flex: 1 }}>
    <FormControl fullWidth size="small">
      <InputLabel id="duration-label">Duration</InputLabel>
      <Select
        labelId="duration-label"
        value={period}
        label="Duration"
        onChange={(e) => setPeriod(e.target.value)}
        sx={{
          borderRadius: 2,
          bgcolor: "background.default",
        }}
      >
        <MenuItem value={1}>Today</MenuItem>
        <MenuItem value={7}>Last 7 Days</MenuItem>
        <MenuItem value={15}>Last 15 Days</MenuItem>
        <MenuItem value={30}>Last 30 Days</MenuItem>
      </Select>
    </FormControl>
  </Box>

  {/* Right: Disclaimer (2/3) */}
  <Box
    sx={{
      flex: 2,
      display: "flex",
      alignItems: "center",
      gap: 1.2,
      px: 2,
      py: 1.5,
      borderRadius: 2,
      bgcolor: "error.light",
      color: "error.dark",
      fontSize: 14,
      fontStyle: "italic",
      border: "1px solid",
      borderColor: "error.main",
    }}
  >
    <span role="img" aria-label="warning">⚠️</span>
    The above salesmen are inactive (no dealer visits in the selected period).
  </Box>
</Box>


      

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "error.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sl.</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Salesman Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Code</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Mobile</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesmenList.length > 0 ? (
                salesmenList.map((salesman, index) => (
                  <TableRow
                    key={salesman.user_id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "grey.100" },
                      "&:hover": { backgroundColor: "error.light", color: "white" },
                      transition: "0.3s"
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {salesman.salesman_name}
                    </TableCell>
                    <TableCell>{salesman.login_id}</TableCell>
                    <TableCell  sx={{ color: "red", fontWeight: "bold", display: 'flex', alignItems: 'center' }}>
                      <PhoneIphoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {salesman.primary_mobile}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No inactive salesmen found
                    <Button
                      startIcon={<AutorenewIcon />}
                      onClick={fetchInactiveSalesmen}
                      sx={{ ml: 2 }}
                    >
                      Refresh
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      
    </Box>
  );
}

export default InactiveSalesmenTable;
