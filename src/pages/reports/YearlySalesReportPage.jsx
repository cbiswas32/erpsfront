import React, { useState, useEffect  } from "react";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import YearlySalesSummaryBarChart from "./YearlySalesSummaryBarChart";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  InputLabel, 
  MenuItem,
  FormControl,
  Divider,
  Select 
} from "@mui/material";
import PageWrapper from "../../layouts/PageWrapper";
import { useUI } from "../../context/UIContext";
import { getYearlySalesReportService } from "../../services/salesService";

export default function YearlySalesReportPage() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  
  useEffect(() => {
    generateYearOptions();
  }, []);

  const generateYearOptions = () => {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let y = startYear; y <= currentYear; y++) {
      options.push({
        label: `${y}-${String(y + 1).slice(-2)}`, // 2025-26
        value: y, // value is 2025
      });
    }

    setYearOptions(options);
    setYear(currentYear); // default select current year
  };

  const fetchReport = async () => {
    if (!year) {
      showSnackbar("Please enter year", "error");
      return;
    }
    showLoader();
    try {
      const data = await getYearlySalesReportService(year);
      if (data && data.length > 0) {
        setReport(data);
      } else {
        setReport([]);
        showSnackbar("No data found", "warning");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error fetching report", "error");
    }
    hideLoader();
  };

 const exportExcel = () => {
  const wb = XLSX.utils.book_new();

  // Financial Year Label
  const fyLabel = `${year}-${String(year + 1).slice(-2)}`;

  // Summary Data
  const summaryData = [
    { 
      Financial_Year: fyLabel,
      Total_Orders: report.reduce((sum, r) => sum + Number(r.total_orders || 0), 0),
      Total_Tax: report.reduce((sum, r) => sum + Number(r.total_tax || 0), 0),
      Total_Sales: report.reduce((sum, r) => sum + Number(r.total_sales || 0), 0),
    },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // Detailed Report
  const detailedData = report.map((r) => ({
    Financial_Year: fyLabel,
    Month: r.month_name,
    Orders: r.total_orders,
    Subtotal: r.total_subtotal,
    CGST: r.total_cgst || 0,
    SGST: r.total_sgst || 0,
    IGST: r.total_igst || 0,
    Total_Tax: r.total_tax,
    Total_Sales: r.total_sales,
  }));

  const wsDetails = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(wb, wsDetails, "Monthwise Report");

  //  Save File
  XLSX.writeFile(wb, `YearlySalesReport_${fyLabel}.xlsx`);
};


  return (
    <PageWrapper title="Yearly Sales Report">
      {/* Filter Section */}
      <Box m={3}>
            <Box display="flex" gap={2} my={3}  justifyContent="center">
        <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Financial Year</InputLabel>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              label="Financial Year"
            >
              {yearOptions.map((y) => (
                <MenuItem key={y.value} value={y.value}>
                  {y.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        <Button variant="contained" onClick={fetchReport}>
          Get Report
        </Button>
      </Box>
{/* Export Button */}
      {report.length > 0 && (
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={exportExcel}
          >
            Export to Excel
          </Button>
        </Box>
      )}
      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="caption">Total Orders</Typography>
            <Typography variant="h5" fontWeight={700}>
              {report.reduce((sum, r) => sum + Number(r.total_orders || 0), 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="caption">Total Tax</Typography>
            <Typography variant="h5" fontWeight={700} color="warning.main">
              ₹
              {report
                .reduce((sum, r) => sum + Number(r.total_tax || 0), 0)
                .toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="caption">Total Sales</Typography>
            <Typography variant="h5" fontWeight={700} color="success.main">
              ₹
              {report
                .reduce((sum, r) => sum + Number(r.total_sales || 0), 0)
                .toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Report Table */}
<Paper sx={{ p: 3, borderRadius: 3, mb: 3, overflowX: "auto" }}>
  <Typography variant="h6" gutterBottom>
    Month-wise Report
  </Typography>
  <Divider sx={{ mb: 2 }} />
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr style={{ background: "#f5f5f5" }}>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Month</th>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Orders</th>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Subtotal (₹)</th>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>CGST (₹)</th>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>SGST (₹)</th>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>IGST (₹)</th>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Total Tax (₹)</th>
        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Total Sales (₹)</th>
      </tr>
    </thead>
    <tbody>
      {report.length === 0 ? (
        <tr>
          <td colSpan={8} align="center" style={{ padding: "12px" }}>
            No data available
          </td>
        </tr>
      ) : (
        report.map((r, idx) => (
          <tr key={idx}>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {r.month_name}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {r.total_orders}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              ₹{Number(r.total_subtotal).toLocaleString()}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              ₹{Number(r.total_cgst || 0).toLocaleString()}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              ₹{Number(r.total_sgst || 0).toLocaleString()}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              ₹{Number(r.total_igst || 0).toLocaleString()}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              ₹{Number(r.total_tax).toLocaleString()}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              ₹{Number(r.total_sales).toLocaleString()}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</Paper>

{ report && report.length > 0 &&<YearlySalesSummaryBarChart data={report || []} /> }

      </Box>
  


      
    </PageWrapper>
  );
}
