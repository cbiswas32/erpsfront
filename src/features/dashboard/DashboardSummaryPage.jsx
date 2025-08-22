import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Tooltip,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { getDashboardSummaryService } from "../../services/dashboardService";
import PinDropIcon from '@mui/icons-material/PinDrop';

// Format numbers with commas
const formatNumber = (num) => num?.toLocaleString("en-IN") ?? 0;

// Get percentage change with safe handling
const getChange = (current, previous) => {
  if (!previous || previous === 0) {
    return { diff: current > 0 ? 100 : 0, isUp: current > 0 };
  }
  const diff = (((current - previous) / previous) * 100).toFixed(1);
  return { diff, isUp: current >= previous };
};

export default function DashboardSummaryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummaryService();
        setSummaryData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  const todayChange = getChange(summaryData.today.totalOrders, summaryData.yesterday.totalOrders);
  const monthChange = getChange(summaryData.thisMonth.totalOrders, summaryData.prevMonth.totalOrders);

  // Common Card Style with hover animation
  const animatedCardStyle = {
    height: 200,
    boxShadow: 3,
    borderRadius: "16px",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: 6,
    },
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Summary
      </Typography>

      {summaryData && (
        <Grid container spacing={4}>
          {/* Today's Orders */}
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Click for detailed view" arrow>
              <Card
                onClick={() => { navigate('/sales/orders'); }}
                sx={{ ...animatedCardStyle, backgroundColor: "#e3f2fd" }}
              >
                <CardContent>
                  <Typography variant="h6">Today's Orders</Typography>
                  <Typography variant="h3" color="primary">
                    {summaryData.today.totalOrders}
                  </Typography>
                  <Typography variant="subtitle1">
                    Value: ₹{formatNumber(summaryData.today.totalOrderValue)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", color: todayChange.isUp ? "green" : "red", mt: 1 }}
                  >
                    {todayChange.isUp ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                    {todayChange.diff}% vs Yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>

          {/* This Month's Orders */}
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Click for detailed view" arrow>
              <Card
                onClick={() => { navigate('/report/monthly-sales-report'); }}
                sx={{ ...animatedCardStyle, backgroundColor: "#e8f5e9" }}
              >
                <CardContent>
                  <Typography variant="h6">This Month's Orders</Typography>
                  <Typography variant="h3" color="success.main">
                    {summaryData.thisMonth.totalOrders}
                  </Typography>
                  <Typography variant="subtitle1">
                    Value: ₹{formatNumber(summaryData.thisMonth.totalOrderValue)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", color: monthChange.isUp ? "green" : "red", mt: 1 }}
                  >
                    {monthChange.isUp ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                    {monthChange.diff}% vs Last Month
                  </Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>

          {/* Low Stock */}
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Click for detailed view" arrow>
              <Card
                onClick={() => { navigate('/inventoryManagemnt/inventory'); }}
                sx={{ ...animatedCardStyle, backgroundColor: "#ffb38033" }}
              >
                <CardContent>
                  <Typography variant="h6">Low Stock Products</Typography>
                  <Typography variant="h3" color="warning.main">
                    {summaryData.inventory.lowStockProducts}
                  </Typography>
                  <Typography variant="subtitle1">Products below threshold</Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>

          {/* Dealers */}
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Click for detailed view" arrow>
              <Card
                onClick={() => { navigate('/dealer-customer/dealerManagement'); }}
                sx={{ ...animatedCardStyle, backgroundColor: "#cdffc8a1" }}
              >
                <CardContent>
                  <Typography variant="h6">Total Dealer</Typography>
                  <Typography variant="h3" color="success.main">
                    {summaryData.dealerCount}
                  </Typography>
                  <Typography variant="subtitle1">Number of Dealers</Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>

          {/* Vendors */}
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Click for detailed view" arrow>
              <Card
                onClick={() => { navigate('/inventoryManagemnt/vendor'); }}
                sx={{ ...animatedCardStyle, backgroundColor: "#fff3e0" }}
              >
                <CardContent>
                  <Typography variant="h6">Total Vendor</Typography>
                  <Typography variant="h3" color="warning.main">
                    {summaryData.vendorCount}
                  </Typography>
                  <Typography variant="subtitle1">Number of Vendors</Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>

          {/* Locations */}
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Click for detailed view" arrow>
              <Card onClick={() => {navigate('/bs/location')}} sx={{ ...animatedCardStyle, backgroundColor: "#f3e5f5" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                    <PinDropIcon sx={{ mr: 1 }} /> Locations
                  </Typography>
                  {summaryData.locations.locationWiseCount.map((loc, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {loc.location_name}
                      </Typography>
                      {index < summaryData.locations.locationWiseCount.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
