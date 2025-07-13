import React from 'react';
import { Box, Typography } from '@mui/material';

function ShowKeyValueView({title, value}) {
    return (
        <Box sx={
            {
                display: 'flex',
                //flexDirection: 'column',
                minWidth: 200
            }
        }>
          
                       <Typography variant="body2"><b>{title}:</b> {value || 'N/A'}</Typography>
                      
                       

        </Box>
    );
}

export default ShowKeyValueView;