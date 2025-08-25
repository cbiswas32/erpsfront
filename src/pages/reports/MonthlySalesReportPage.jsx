import React, { useState } from "react";
import * as XLSX from "xlsx";
import DownloadIcon from '@mui/icons-material/Download';
import {
    Box,
    Button,
    Typography,
    Grid,
    Paper,
    TextField,
    MenuItem,
    Divider,
    Popover,
    List,
    ListItem,
    ListItemText,
    Chip,
    useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MonthlySalesBarChart from "./MonthlySalesBarChart";
import DealerSalesChart from "./DealerSalesChart";

import PageWrapper from "../../layouts/PageWrapper";
import { useUI } from "../../context/UIContext";
import { getMonthlySalesReportService } from "../../services/salesService";

import dayjs from "dayjs";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getDealerOrderMap(data = [], includeSales = false) {
    return data?.reduce((acc, curr) => {
        if (curr.dealer_name) {
            if (!acc[curr.dealer_name]) {
                acc[curr.dealer_name] = includeSales
                    ? { orders: 0, totalSales: 0 }
                    : 0;
            }

            if (includeSales) {
                acc[curr.dealer_name].orders += Number(curr.total_orders || 0);
                acc[curr.dealer_name].totalSales += Number(curr.total_sales || 0);
            } else {
                acc[curr.dealer_name] += Number(curr.total_orders || 0);
            }
        }
        return acc;
    }, {});
}

// Transform API response
const transformReport = (data = []) => {
    const grouped = {};
    data?.forEach((item) => {
        const date = dayjs(item.sales_date).format("YYYY-MM-DD");
        if (!grouped[date]) grouped[date] = [];

        grouped[date].push({
            dealer_name: item.dealer_name || "Walk-in / Customer",
            order_code: item.sales_order_code || "Not Available",
            location_name: item.location_name,
            sales_amount: parseFloat(item.total_sales),
            total_orders: parseInt(item.total_orders),
            subtotal: parseFloat(item.total_subtotal),
            tax: parseFloat(item.total_tax),
        });
    });

    return Object.keys(grouped).map((date) => ({
        date,
        sales: grouped[date],
        totalSum: grouped[date].reduce((sum, s) => sum + s.sales_amount, 0),
    }));
};

export default function MonthlySalesReportPage() {
    const { showSnackbar, showLoader, hideLoader } = useUI();
    const [filters, setFilters] = useState({
        month: dayjs().month() + 1,
        year: dayjs().year(),
    });
    const [report, setReport] = useState([]);
    const [dealerOrdermapReport, setDealerOrdermapReport] = useState({});

    // for popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const exportExcel = () => {
        const wb = XLSX.utils.book_new();

        // Monthly Summary
        const monthsMap = {};
        report.forEach(r => {
            const monthKey = dayjs(r.date).format("YYYY-MM");
            if (!monthsMap[monthKey]) monthsMap[monthKey] = [];
            monthsMap[monthKey].push(r);
        });

        const monthlyData = Object.entries(monthsMap).map(([month, monthData]) => ({
            Month: dayjs(month + "-01").format("MMMM YYYY"),
            "Total Orders": monthData.reduce(
                (sum, day) => sum + (day.sales?.length || 0),
                0
            ),
            "Total Sales": monthData.reduce(
                (sum, day) => sum + (day.totalSum || 0),
                0
            ),
        }));

        const monthlyWS = XLSX.utils.json_to_sheet(monthlyData);
        XLSX.utils.book_append_sheet(wb, monthlyWS, "Monthly Summary");

        // Day-wise Details
        const daywiseData = report.flatMap(day =>
            day.sales.map(s => ({
                Date: dayjs(day.date).format("DD-MM-YYYY"),
                Dealer: s.dealer_name,
                "Order Code": s.order_code,
                Location: s.location_name,
                "Total Orders": Number(s.total_orders),
                "Subtotal (₹)": Number(s.subtotal.toFixed(2)),
                "Tax (₹)": Number(s.tax.toFixed(2)),
                "Sales Amount (₹)": Number(s.sales_amount.toFixed(2)),
            }))
        );

        const daywiseWS = XLSX.utils.json_to_sheet(daywiseData);
        XLSX.utils.book_append_sheet(wb, daywiseWS, "Day-wise Orders");

        // Direct download in browser
        XLSX.writeFile(wb, `MonthlySales_${filters.year}_${filters.month}.xlsx`);
    };

    const fetchReport = async () => {
        if (!filters.month || !filters.year) {
            showSnackbar("Please select month and year", "error");
            return;
        }
        showLoader();
        try {
            const data = await getMonthlySalesReportService(filters.year, filters.month);
            if (data && data.length > 0) {
                setReport(transformReport(data) || []);
                setDealerOrdermapReport(getDealerOrderMap(data, true))
            }
            else {
                setReport([]);
                setDealerOrdermapReport({});
                showSnackbar("No data found for selected month and year", "warning");
            }

        } catch (err) {
            console.error(err);
            showSnackbar("Error fetching monthly sales report", "error");
        }
        hideLoader();
    };

    const handleOpen = (event, dayReport) => {
        setAnchorEl(event.currentTarget);
        setSelectedDay(dayReport);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedDay(null);
    };

    const open = Boolean(anchorEl);

    return (
        <PageWrapper title="Monthly Sales Report">
            {/* Filter Section */}
            <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                my={3}
                justifyContent="center"
                maxWidth={isMobile ? "100%" : "md"}
                mx="auto"
                sx={{ flexDirection: isMobile ? "column" : "row" }}
            >
                <TextField
                    select label="Month" value={filters.month}
                    onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    size="small" sx={{ minWidth: 150, width: isMobile ? "100%" : "auto" }}
                >
                    {months.map((m, idx) => (
                        <MenuItem key={idx + 1} value={idx + 1}>{m}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Year" type="number" value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    size="small" sx={{ minWidth: 120, width: isMobile ? "100%" : "auto" }}
                />

                <Button
                    variant="contained"
                    onClick={fetchReport}
                    sx={{ minWidth: 120, width: isMobile ? "100%" : "auto" }}
                >
                    Get Report
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: isMobile ? "stretch" : "stretch",
                    flexDirection: isMobile ? "column" : "row",
                    height: isMobile ? "auto" : "400px",
                    m: 2
                }}
            >
                {/* Left: Monthly Summary Cards (35%) */}
                <Box
                    sx={{
                        flex: isMobile ? "1 1 100%" : "0 0 35%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        overflowY: isMobile ? "visible" : "auto",
                    }}
                >
                    {(() => {
                        const monthsMap = {};
                        report.forEach(r => {
                            const monthKey = dayjs(r.date).format("YYYY-MM");
                            if (!monthsMap[monthKey]) monthsMap[monthKey] = [];
                            monthsMap[monthKey].push(r);
                        });

                        return Object.entries(monthsMap).map(([month, monthData]) => {
                            const totalOrders = monthData.reduce(
                                (sum, day) => sum + (day.sales?.length || 0),
                                0
                            );
                            const totalSales = monthData.reduce(
                                (sum, day) => sum + (day.totalSum || 0),
                                0
                            );
                            return (
                                <Paper
                                    key={month}
                                    sx={{
                                        p: isMobile ? 2 : 3,
                                        borderRadius: 4,
                                        flex: "1 1 0",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        background: "linear-gradient(135deg, #f0f4ff 0%, #d9e6ff 100%)",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                        transition: "transform 0.3s, box-shadow 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 16px 30px rgba(0,0,0,0.18)",
                                        },
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                                        {dayjs(month + "-01").format("MMMM YYYY")}
                                    </Typography>

                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Total Orders
                                        </Typography>
                                        <Typography variant="h5" fontWeight="700">
                                            {totalOrders}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Total Sales
                                        </Typography>
                                        <Typography variant="h5" fontWeight="700" color="success.main">
                                            ₹{totalSales.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="flex-end" mb={2}>
                                        <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={exportExcel}>
                                            Export to Excel
                                        </Button>
                                    </Box>
                                </Paper>
                            );
                        });
                    })()}
                </Box>

                {/* Right: Dealer Sales Chart (65%) */}
                <Box
                    sx={{
                        flex: isMobile ? "1 1 100%" : "0 0 65%",
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                    }}
                >
                    <DealerSalesChart dealerData={dealerOrdermapReport || {}} />
                </Box>
            </Box>

            {/* Responsive chart section */}
            <Box sx={{ width: "100%", maxWidth: isMobile ? "100vw" : "1100px", mx: "auto", my: 2 }}>
                <MonthlySalesBarChart data={report || []} />
            </Box>

            {/* Calendar Report */}
            {report && report?.length > 0 && (
                <Box m={2}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: isMobile ? 1.5 : 2, borderRadius: 3, boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                📅 {months[filters.month - 1]} {filters.year} - Sales Calendar View
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {/* Weekday headers */}
                            <Grid container columns={7} sx={{ mb: 1 }}>
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                                    <Grid item xs={1} key={d}>
                                        <Typography align="center" fontWeight="bold" fontSize={isMobile ? "0.9rem" : "1rem"}>{d}</Typography>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Calendar days */}
                            <Grid container columns={7} spacing={isMobile ? 0.5 : 1}>
                                {(() => {
                                    const daysInMonth = dayjs(`${filters.year}-${filters.month}-01`).daysInMonth();
                                    const firstDay = dayjs(`${filters.year}-${filters.month}-01`).day();
                                    const blanks = (firstDay + 6) % 7; // shift so Mon=0

                                    const calendarCells = [];
                                    for (let i = 0; i < blanks; i++) {
                                        calendarCells.push(<Grid item xs={1} key={`blank-${i}`} />);
                                    }

                                    for (let d = 1; d <= daysInMonth; d++) {
                                        const date = dayjs(`${filters.year}-${filters.month}-${d}`).format("YYYY-MM-DD");
                                        const dayReport = report.find((r) => r.date === date);

                                        calendarCells.push(
                                            <Grid item xs={1} key={date}>
                                                <Paper
                                                    sx={{
                                                        p: isMobile ? 0.5 : 1,
                                                        height: isMobile ? 120 : 200,
                                                        borderRadius: 2,
                                                        bgcolor:
                                                            dayReport?.totalSum > 0
                                                                ? `rgba(102, 187, 106, ${Math.min(1, (dayReport.totalSum / 100000) + 0.2)})` // green with dynamic opacity
                                                                : "rgba(244, 67, 54, 0.3)",
                                                        border: "1px solid #ddd",
                                                        overflow: "hidden",
                                                        cursor: dayReport ? "pointer" : "default",
                                                        minWidth: 0,
                                                    }}
                                                    onClick={dayReport ? (e) => handleOpen(e, dayReport) : undefined}
                                                >
                                                    <Typography variant="subtitle2" fontWeight="bold">{d}</Typography>
                                                    <Divider sx={{ my: 0.5 }} />

                                                    {!dayReport ? (
                                                        <Typography variant="caption" color="text.secondary">
                                                            No sales
                                                        </Typography>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                maxHeight: isMobile ? 110 : 190,
                                                                overflowY: "auto",
                                                                mt: 1,
                                                                mb: 0.5,
                                                                scrollbarWidth: "none",
                                                                "&::-webkit-scrollbar": { display: "none" },
                                                                msOverflowStyle: "none",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                gap: 1.2,
                                                            }}
                                                        >
                                                            {/* Total Sale */}
                                                            <Box
                                                                sx={{
                                                                    p: 1,
                                                                    borderRadius: 2,
                                                                    bgcolor: "rgba(0, 123, 255, 0.15)", // soft blue overlay
                                                                    color: "#0d47a1",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",
                                                                    boxShadow: 1,
                                                                }}
                                                            >
                                                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                                    Total Sale
                                                                </Typography>
                                                                <Typography variant="h6" fontWeight="bold" fontSize={isMobile ? "1rem" : "1.25rem"}>
                                                                    ₹{Number(dayReport.totalSum || 0).toLocaleString()}
                                                                </Typography>
                                                            </Box>

                                                            {/* Dealer/Customer Count */}
                                                            <Box
                                                                sx={{
                                                                    p: 1,
                                                                    borderRadius: 2,
                                                                    bgcolor: "rgba(134, 125, 255, 0.2)", // soft green overlay
                                                                    color: "#0e4912ff",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",

                                                                }}
                                                            >
                                                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                                    Dealers / Customers
                                                                </Typography>
                                                                <Typography variant="h6" fontWeight="bold" fontSize={isMobile ? "1rem" : "1.25rem"}>
                                                                    {dayReport?.sales?.length || 0}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            </Grid>
                                        );
                                    }
                                    return calendarCells;
                                })()}
                            </Grid>
                        </Paper>
                    </Grid>
                </Box>
            )}

            {/* Popover for details */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: 6,
                        minWidth: isMobile ? "90vw" : 360,
                        maxHeight: isMobile ? 350 : 420,
                        p: isMobile ? 1 : 2,
                    },
                }}
            >
                <Box sx={{ p: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Sales Details ({dayjs(selectedDay?.date).format("DD-MMM-YYYY")})
                    </Typography>

                    {selectedDay?.sales?.length > 0 ? (
                        <List sx={{ maxHeight: isMobile ? 220 : 340, overflowY: "auto" }}>
                            {selectedDay.sales.map((s, idx) => (
                                <React.Fragment key={idx}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{ py: isMobile ? 0.6 : 1.2, borderBottom: "1px dashed #ddd" }}
                                    >
                                        <Box display="flex" alignItems="flex-start" gap={1}>
                                            {/* Number Badge */}
                                            <Chip
                                                size="small"
                                                color="primary"
                                                label={idx + 1}
                                                sx={{
                                                    minWidth: 25,
                                                    fontWeight: "bold",
                                                    borderRadius: "50%",
                                                }}
                                            />

                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2" fontWeight="bold" fontSize={isMobile ? "1rem" : "1.1rem"}>
                                                        {s.dealer_name}{" "}
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            ({s.location_name})
                                                        </Typography>
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box mt={0.5}>
                                                        <Typography variant="caption" display="block">
                                                            <strong>Order Code:</strong> {s.order_code}
                                                        </Typography>
                                                        <Typography variant="caption" display="block">
                                                            <strong>Subtotal:</strong> ₹{s.subtotal.toFixed(2)}
                                                        </Typography>
                                                        <Typography variant="caption" display="block">
                                                            <strong>Tax:</strong> ₹{s.tax.toFixed(2)}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            display="block"
                                                            fontWeight="bold"
                                                            color="success.main"
                                                        >
                                                            <strong>Sales Amount:</strong> ₹
                                                            {s.sales_amount.toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </Box>
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No details available
                        </Typography>
                    )}
                </Box>
            </Popover>
        </PageWrapper>
    );
}
