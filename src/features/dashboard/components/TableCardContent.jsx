import React from 'react';
import { Box, TableRow, TableCell, Table, TableBody, Button, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { grey, blue, amber } from '@mui/material/colors';
function TableCardContent(props) {
    const actionColor = {
        pendingApproval: amber[200],
        pendingValidation: blue[200],
        notStarted: grey[300]
    }
    return (
        <Box
        sx={{
            overflowX: "auto", // Enable horizontal scrolling
            overflowY: "auto", // Enable horizontal scrolling
            maxHeight: "100%",
            maxWidth: "100%", // Ensure it doesn't exceed the screen width
            // Hide the scrollbar
            scrollbarWidth: "none", // For Firefox
            "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Edge
            },
        }}
        >
            <Table>
                <TableBody>
                <TableRow>
                    <TableCell>
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                Project Name
                            </Typography>
                            <Typography variant='subline' color='secondary.main'>
                                Source
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell >
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                10/01/2025
                            </Typography>
                            <Typography variant='subline' color='secondary.main'> 
                                Last Action
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant='body2' color='warning.dark' >Awaiting Approval For 15 Days!</Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Box sx={{
                            p: 1,
                            px: 0,
                            borderRadius: 1,
                            cursor: 'pointer',
                            background: actionColor.pendingApproval
                            }}>
                            <Typography lineHeight={0} variant='overline' color='secondary.dark'>
                                Pending Approval
                            </Typography>
                                    
                            
                        </Box>
                        
                    </TableCell>
                    <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                Project Name
                            </Typography>
                            <Typography variant='subline' color='secondary.main'>
                                Source
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell >
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                10/01/2025
                            </Typography>
                            <Typography variant='subline' color='secondary.main'> 
                                Last Action
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant='body2' color='warning.dark' >
                            Start Pending Since 15 Days!
                            </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Box sx={{
                            p: 1,
                            px: 0,
                            borderRadius: 1,
                            cursor: 'pointer',
                            background: actionColor.notStarted
                            }}>
                            <Typography lineHeight={0} variant='overline' color='secondary.dark'>
                                Not Started
                            </Typography>
                                    
                            
                        </Box>
                        
                    </TableCell>
                    <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                Project Name
                            </Typography>
                            <Typography variant='subline' color='secondary.main'>
                                Source
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell >
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                10/01/2025
                            </Typography>
                            <Typography variant='subline' color='secondary.main'> 
                                Last Action
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant='body2' color='warning.dark' >Awaiting Validation For 2 Days!</Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Box sx={{
                            p: 1,
                            px: 0,
                            borderRadius: 1,
                            cursor: 'pointer',
                            background: actionColor.pendingValidation
                            }}>
                            <Typography lineHeight={0} variant='overline' color='secondary.dark'>
                            Pending Validation
                            </Typography>
                                    
                            
                        </Box>
                        
                    </TableCell>
                    <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                Project Name
                            </Typography>
                            <Typography variant='subline' color='secondary.main'>
                                Source
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell >
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                02/01/2025
                            </Typography>
                            <Typography variant='subline' color='secondary.main'> 
                                Last Action
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant='body2' color='warning.dark' >
                            Start Pending Since 32 Days!
                            </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Box sx={{
                            p: 1,
                            px: 0,
                            borderRadius: 1,
                            cursor: 'pointer',
                            background: actionColor.notStarted
                            }}>
                            <Typography lineHeight={0} variant='overline' color='secondary.dark'>
                                Not Started
                            </Typography>
                                    
                            
                        </Box>
                        
                    </TableCell>
                    <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                Project Name
                            </Typography>
                            <Typography variant='subline' color='secondary.main'>
                                Source
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell >
                        <Box>
                            <Typography variant='h6' color='secondary.dark'>
                                10/01/2025
                            </Typography>
                            <Typography variant='subline' color='secondary.main'> 
                                Last Action
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant='body2' color='warning.dark' >Awaiting Validation For 2 Days!</Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Box sx={{
                            p: 1,
                            px: 0,
                            borderRadius: 1,
                            cursor: 'pointer',
                            background: actionColor.pendingValidation
                            }}>
                            <Typography lineHeight={0} variant='overline' color='secondary.dark'>
                            Pending Validation
                            </Typography>
                                    
                            
                        </Box>
                        
                    </TableCell>
                    <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
            
                </TableBody>
            </Table>
        </Box>
      
    );
}

export default TableCardContent;