import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Grid, Paper, TextField, MenuItem
} from '@mui/material';
import dayjs from 'dayjs';
import PageWrapper from '../../layouts/PageWrapper';
import SalesmanActivityReportAccordion from '../../features/reports/salesman-activity-report/SalesmanActivityReportAccordion';

import { getDealerVisitLogsService } from '../../services/dealerService';

import { useUI } from '../../context/UIContext';
import { fetchUserListService } from '../../services/userServices';
import VisitSummary from '../../features/reports/salesman-activity-report/VisitSummary';

export default function SalesmanActivityReportPage() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [salesmen, setSalesmen] = useState([]);
  const [logs, setLogs] = useState([]);
  const [userList, setUserList] = useState([]);
  const [filters, setFilters] = useState({
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    salesmanId: ''
  });

  useEffect(() => {
    getUserListAPICall(true)
  }, []);


  const fetchReport = async () => {
    if (!filters.startDate || !filters.endDate || !filters.salesmanId) {
      showSnackbar('Please select start date, end date, and salesman', 'error');
      return;
    }
    showLoader();
    try {
      const data = await getDealerVisitLogsService(filters);
      setLogs(data || []);
    } catch (err) {
      showSnackbar('Error fetching report', 'error');
      console.error(err);
    }
    hideLoader();
  };

    const getUserListAPICall = (hideSnackbar) => {
      showLoader()
      fetchUserListService().then(res => {
        console.log("User List Response", res)
        if (res && res.status && res.responseObject) {
          setUserList(res.responseObject)
          let salesPersonList =  res.responseObject?.filter(u => u.roleShortname === "SALESMAN")?.map( x => {
            return {
                salesmanId: x.userId,
                salesmanName: x.userFirstname + " " + x.userLastname,
                loginId: x.loginId
            }
          })
          if(salesPersonList && salesPersonList?.length > 0){
            setSalesmen(salesPersonList)
            showSnackbar('Salesman list fetched successfully!', 'success')
          }
          else{
            setSalesmen(salesPersonList)
            showSnackbar('No Salesman found!', 'warning')
          }
          !hideSnackbar && showSnackbar('User list fetched successfully!', 'success')
        }
        else {
  
          showSnackbar('No Salesman found!', 'warning')
          setUserList([])
          setSalesmen([])
        }
        hideLoader()
      }).catch(error => {
        console.log("Error in Fetching User List!", error);
        hideLoader();
        setSalesmen([])
        showSnackbar('Failed to fetch sales men list!', 'error')
        setUserList([])
      })
    }
  

  return (
    <PageWrapper title="Salesman Activity Report">
      {/* Filter Section */}
      <Box display="flex" flexWrap="wrap" gap={2} my={3} justifyContent={'center'}  maxWidth="md" mx="auto">
        <TextField
          type="date"
          label="Start Date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          type="date"
          label="End Date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          select
          label="Salesman"
          value={filters.salesmanId}
          onChange={(e) => setFilters({ ...filters, salesmanId: e.target.value })}
          size="small"
          sx={{ minWidth: 200 }}
        >
          {salesmen.map((sm) => (
            <MenuItem key={sm.salesmanId} value={sm.salesmanId}>
              {sm.salesmanName} ({sm.loginId})
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={fetchReport}
          sx={{ minWidth: 120 }}
        >
          Get Report
        </Button>
      </Box>

      {/* Report List */}
      {logs.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No activities found for the selected filters
        </Typography>
      ) : (
      <>
      <VisitSummary data={logs} filters={filters} />
      <SalesmanActivityReportAccordion data={logs} />
      </>
      
      )}
    </PageWrapper>
  );
}
