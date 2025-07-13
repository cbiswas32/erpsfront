import React from 'react';
import { Box, TableRow, TableCell, Table, TableBody, Button, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { grey, blue, amber } from '@mui/material/colors';
function ActionTakenCardContent(props) {
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
                                Auditor Name
                            </Typography>
                            <Typography variant='subline' color='secondary.main'>
                                1 day ago!
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell >
                            <Typography variant='h6' color='secondary.dark'>
                                Project Name
                            </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant='body2' color='primary.light' >Completed Day 2 Activity!</Typography>
                    </TableCell>
                    <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                <TableRow>
                        <TableCell>
                            <Box>
                                <Typography variant='h6' color='secondary.dark'>
                                    Auditor Name
                                </Typography>
                                <Typography variant='subline' color='secondary.main'>
                                    1 day ago!
                                </Typography>
                            </Box>
                        </TableCell>
                        <TableCell >
                                <Typography variant='h6' color='secondary.dark'>
                                    Project Name
                                </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant='body2' color='primary.light' >Sent for review!</Typography>
                        </TableCell>
                        <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                <TableRow>
                        <TableCell>
                            <Box>
                                <Typography variant='h6' color='secondary.dark'>
                                    Auditor Name
                                </Typography>
                                <Typography variant='subline' color='secondary.main'>
                                    2 days ago!
                                </Typography>
                            </Box>
                        </TableCell>
                        <TableCell >
                                <Typography variant='h6' color='secondary.dark'>
                                    Project Name
                                </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant='body2' color='primary.light' >Completed Day 1 Activity!</Typography>
                        </TableCell>
                        <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                <TableRow>
                        <TableCell>
                            <Box>
                                <Typography variant='h6' color='secondary.dark'>
                                    Auditor Name
                                </Typography>
                                <Typography variant='subline' color='secondary.main'>
                                    5 days ago!
                                </Typography>
                            </Box>
                        </TableCell>
                        <TableCell >
                                <Typography variant='h6' color='secondary.dark'>
                                    Project Name
                                </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant='body2' color='primary.light' >Started Auditing!</Typography>
                        </TableCell>
                        <TableCell align="right"><Button ><VisibilityIcon /></Button></TableCell>
                </TableRow>
                </TableBody>
            </Table>
        </Box>
      
    );
}

export default ActionTakenCardContent;