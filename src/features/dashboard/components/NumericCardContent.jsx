import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

function NumericCardContent(props) {
    return (
        <Stack gap={1}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h2' alignSelf={'flex-end'}>
                    {props.count || ""}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography color='primary.dark' variant='body2'>+{props.incrementStat || 0}</Typography>
                    <Typography color='secondary.main' variant='small'>This Month</Typography>
                </Box>
            </Box>
            <Box>
                <LinearProgress variant="determinate" value={props.progressBarParcentage || 0} color={props.progressBarColor || "primary"}/>
            </Box>

        </Stack>
    );
}

export default NumericCardContent;