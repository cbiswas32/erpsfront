import { Box } from '@mui/material';
import React from 'react';
import PieChart from '../../../components/Charts/PieChart';
import BarChart from '../../../components/Charts/BarChart';

function ChartCardContent(props) {
    const chartType = props.chartType;
    return (
        <Box height={"100%"} padding={"5px 0px"}>
            {chartType === "pie" && <PieChart /> }
            {chartType === "bar" && <BarChart />}
            
        </Box>
    );
}

export default ChartCardContent;