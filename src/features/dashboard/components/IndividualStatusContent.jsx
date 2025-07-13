import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

function IndividualStatusContent(props) {
    return (
       <Stack gap={1}>
                   <Box sx={{
                       display: 'flex',
                       justifyContent: 'space-between',
                       alignItems: 'center'
                   }}>
                       <Box sx={{
                           display: 'flex',
                           flexDirection: 'column'
                       }}>
                           {props.icon}
                           <Typography color='secondary.main' variant='h6'>{props.mainTitle}</Typography>
                       </Box>
                       <Typography variant='h2' alignSelf={'center'}>
                           {props.count || ""}
                       </Typography>
                       
                   </Box>
       
               </Stack>
    );
}

export default IndividualStatusContent;