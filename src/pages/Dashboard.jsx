import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CardContainer from '../features/dashboard/components/CardContainer';
import NumericCardContent from '../features/dashboard/components/NumericCardContent';
import CumulativeStatus from '../features/dashboard/components/CumulativeStatus';
import { listTodayUsersTimeService, getDashboardSummaryService } from '../services/dashboardService';
import { CircularProgress } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import UserTimeTable from '../features/dashboard/UserTimeTable';
import ProductsSoldReport from '../features/dashboard/ProductsSoldReport';
import { useNavigate } from 'react-router-dom';
import InactiveSalesmenTable from '../features/dashboard/InactiveSalesmenTable';
import DashboardSummaryPage from '../features/dashboard/DashboardSummaryPage';

function Dashboard({logout}) {
    const navigate = useNavigate()
    const [userTimeList, setUserTimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      
        fetchUserTimeSpentData();
    }, []);

    async function fetchUserTimeSpentData() {
            try {
                const response = await listTodayUsersTimeService();
                setUserTimeList(response || []);
            } catch (error) {
                console.error("Error fetching today's user time:::", error);
                if(error.status === 403 && error?.response?.data?.message === "Invalid or expired token"){
                    logout()
                    console.log("Logged Out As Token Expired!")
                }
                setUserTimeList([]);
            } finally {
                setLoading(false);
            }
    }
 

    return (
        <Box sx={{ width: 'full', mb: 8 }}>
            <Grid container spacing={2}>
                {/* <CumulativeStatus /> */}
                <DashboardSummaryPage />

                {/* Example Card */}
                {/* <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                    <CardContainer title="Product Sent">
                        <NumericCardContent progressBarColor="info" progressBarParcentage={82} count={1204} incrementStat={30}/>
                    </CardContainer>
                </Grid> */}

                {/* Users Time Spent Today */}
                <Grid size={{ xs: 12, sm: 12, md: 7 }}>
                    <CardContainer title="Users Time Spent Today" height={"55vh"} >
                         <Box sx={{ height: "100%", overflow: "auto", pb:4 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <UserTimeTable userTimeList={userTimeList} fetchUserTimeSpentData={fetchUserTimeSpentData} />
                        )}
                        </Box>
                    </CardContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 5 }}>
                    <CardContainer title="Inactive Sales Person" buttontitle={"View Activites"} showbutton={true} buttonicon ={<LaunchIcon />} 
                        buttonclick={() => {
                            navigate('/report/salesman-activity')
                        }} height={"55vh"} >
                         <Box sx={{ height: "100%", overflow: "auto", pb:4 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <InactiveSalesmenTable />
                        )}
                        </Box>
                    </CardContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <CardContainer title="Product Sold Metrics" showbutton={true} buttonicon ={<LaunchIcon />} 
                        buttonclick={() => {
                            navigate('/sales/orders')
                        }}
                            maxHeight={"85vh"} >
                         <Box sx={{ height: "100%", overflow: "auto", pb:4 }}>
                            <ProductsSoldReport />
                        </Box>
                    </CardContainer>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
