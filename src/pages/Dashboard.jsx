import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContainer from '../features/dashboard/components/CardContainer';
import NumericCardContent from '../features/dashboard/components/NumericCardContent';
import TableCardContent from '../features/dashboard/components/TableCardContent';
import Grid from '@mui/material/Grid2';
import ChartCardContent from '../features/dashboard/components/ChartCardContent';
import ActionTakenCardContent from '../features/dashboard/components/ActionTakenCardContent';
import CumulativeStatus from '../features/dashboard/components/CumulativeStatus';
function Dashboard(props) {
    return (
       <Box sx={
        {
            width: 'full',
            mb: 8
        }
       }>
            {/*<CardContainer> 
                <NumericCardContent />
            </CardContainer>*/}
            {/* First Row Mini Cards */}
            <Grid container spacing={2}>
                <CumulativeStatus />
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <CardContainer title="Product Sent"> 
                        <NumericCardContent progressBarColor="info"  progressBarParcentage={82} count={1204} incrementStat={30}/>
                    </CardContainer>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <CardContainer title="Not Started"> 
                        <NumericCardContent progressBarColor="secondary" progressBarParcentage={20} count={84} incrementStat={3}/>
                    </CardContainer>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <CardContainer title="In Progress"> 
                        <NumericCardContent progressBarColor="warning" progressBarParcentage={90} count={952} incrementStat={5}/>
                    </CardContainer>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <CardContainer title="Completed"> 
                        <NumericCardContent  progressBarColor="primary" progressBarParcentage={25} count={102} incrementStat={34}/>
                    </CardContainer>
                </Grid>
                {/* First Row Table Cards and Chart  */}
                <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                    <CardContainer title="Outstanding Actions" showbutton={"true"} height={"60vh"}> 
                        <TableCardContent />
                    </CardContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <CardContainer title="Overview" height={"60vh"}> 
                        <ChartCardContent chartType="pie" />
                    </CardContainer>
                </Grid>
                {/* First Row Table Cards and Chart  */}
                {/* <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                    <CardContainer title="Last Action Taken" height={"60vh"} showbutton={"true"}> 
                        <ActionTakenCardContent />
                    </CardContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <CardContainer title="Metrics" height={"60vh"}> 
                        <ChartCardContent chartType="bar" />
                    </CardContainer>
                </Grid> */}
                {/* <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                   <Box >
                    <Divider></Divider>
                    <Box sx={
                        {
                            minHeight: 80,
                            display: 'flex',
                            alignItems: 'center',
                            gap:2,
                            mt:1,
                            flexDirection:{
                                xs: 'column-reverse', // Small screens
                                sm: 'column-reverse',
                                md: 'row',
                                lg: 'row'
                            },
                            justifyContent: 'space-between'
                        }
                    }>
                        <Typography>
                          
                        </Typography>
                        <Box sx={
                        {
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    }>
                            <Typography>
                                Quick Links: 
                            </Typography>                       
                            <Link 
                            href="" 
                            target="_blank"
                            sx={
                                {
                                    px:2,
                                    py:1,
                                    borderRadius:3,
                                    fontWeight: 'bold',
                                    color: 'text.lightest',
                                    cursor: 'pointer',
                                    backgroundColor: 'primary.light',
                                    '&:hover': {
                                    backgroundColor: 'primary.dark', // background color on hover
                                    },
                                }
                            }>
                            THP
                            </Link>
                            <Link 
                            href="" 
                            target="_blank"
                            sx={
                                {
                                    px:2,
                                    py:1,
                                    borderRadius:3,
                                    fontWeight: 'bold',
                                    color: 'text.lightest',
                                    cursor: 'pointer',
                                    backgroundColor: 'primary.light',
                                    '&:hover': {
                                    backgroundColor: 'primary.dark', // background color on hover
                                    },
                                }
                            }>
                            BHP
                            </Link>
                            <Link 
                            href="" 
                            target="_blank"
                            sx={
                                {
                                    px:2,
                                    py:1,
                                    borderRadius:3,
                                    fontWeight: 'bold',
                                    color: 'text.lightest',
                                    cursor: 'pointer',
                                    backgroundColor: 'primary.light',
                                    '&:hover': {
                                    backgroundColor: 'primary.dark', // background color on hover
                                    },
                                }
                            }>
                            BFLP
                            </Link>
                        </Box>
                    </Box>
                   </Box>
                </Grid> */}
            </Grid>
       </Box>
    );
}

export default Dashboard;