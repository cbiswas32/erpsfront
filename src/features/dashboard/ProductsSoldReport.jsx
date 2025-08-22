import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { fetchProductsSoldReportService } from "../../services/dashboardService";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const PERIODS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 15 Days", value: "15days" },
  { label: "1 Month", value: "1month" }
];

export default function ProductsSoldReport() {
  const [period, setPeriod] = useState("today");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const chartRef = useRef(null);

  const loadReport = async (selectedPeriod) => {
    setLoading(true);
    try {
      const data = await fetchProductsSoldReportService(selectedPeriod);
      setReport(data || []);
    } catch (err) {
      console.error("Failed to fetch products sold report", err);
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(period);
  }, [period]);

  // Pie Chart Init
  useEffect(() => {
    if (!report || report.length === 0) return;

    let root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(40)
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Sales",
        valueField: "total_quantity_sold",
        categoryField: "product_name"
      })
    );

    series.data.setAll(report);

    // Cleanup
    return () => {
      root.dispose();
    };
  }, [report]);

  return (
    <Card sx={{ height: "90%", display: "flex", flexDirection: "column", boxShadow: 'none'}}>
      <CardContent sx={{ flex: "0 0 auto" }}>
        {/* <Typography variant="h6" gutterBottom>
          Products Sold Report
        </Typography> */}

        {/* Modern Tabs */}
        <Tabs
          value={period}
          onChange={(e, val) => setPeriod(val)}
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              borderRadius: "12px",
              mx: 0.5,
              fontWeight: 500,
              minHeight: "36px"
            },
            "& .Mui-selected": {
              backgroundColor: "primary.main",
              color: "white !important"
            },
            "& .MuiTabs-indicator": {
              display: "none"
            }
          }}
        >
          {PERIODS.map((p) => (
            <Tab key={p.value} label={p.label} value={p.value} />
          ))}
        </Tabs>
      </CardContent>

      <Box sx={{ flex: "1 1 auto", overflow: "auto", px: 2, py: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Chart */}
            {report.length > 0 && <Box ref={chartRef} sx={{ width: "100%", height: "300px", mb: 3 }} />}

            {/* Table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Sl. No.", "Product Name", "Product Code", "Quantity Sold"].map((head, i) => (
                      <TableCell key={i} sx={{ fontWeight: "bold" }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.length > 0 ? (
                    report.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.product_name}</TableCell>
                        <TableCell>{row.product_code}</TableCell>
                        <TableCell>{row.total_quantity_sold} {row.uom}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Card>
  );
}
