import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const RoleFunctionAccordianTable = ({currentSubFunctionList, mainMenuId, accessTypeCheckBoxOnClick}) => {
    
    return (
        <Box sx={{ maxWidth: 'md', mx: 'auto',p: 1 }}>
            { currentSubFunctionList?.length > 0 ?  currentSubFunctionList?.map((item) => (
                <Accordion key={item.subFunctionId} disableGutters elevation={0} sx={{
                    mb: 2,
                    overflow: 'hidden',
                    border: 'none' // optional subtle border
                }} >
                    <AccordionSummary sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: 4,


                    }} expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                        <Typography>{item.subFunctionName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{
                        backgroundColor: 'secondary.lightest',
                        m: 2,
                        mt: 0,

                        border: '1px solid',
                        borderColor: 'primary.main',
                        borderTop: 'none',
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                    }}>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{
                                    backgroundColor: 'primary.accordian',

                                }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', width: '30%' }}><strong>Role Function</strong></TableCell>
                                        <TableCell sx={{ color: 'white', width: '70%' }}><strong>Role Access</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {item.roleAccessDetails.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell><strong>{row.roleDescription}</strong></TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'start', flexWrap: 'wrap', mr: 1 }}>
                                                    {
                                                        row?.accessTypeList.map((access, index) => (
                                                            <Box display="flex" alignItems="center" onClick={() => accessTypeCheckBoxOnClick(item.subFunctionId, access.accessId,  row.roleMasterId)} key={index+1} sx={{
                                                                backgroundColor: access.value ? 'primary.lighter'  : 'error.lighter',
                                                                pr:1.5,
                                                                borderRadius: 3,
                                                                cursor: 'pointer',
                                                            }}>
                                                                <Checkbox
                                                                    checked={access.value}
                                                                    
                                                                    icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 30 }} />}
                                                                    checkedIcon={<CheckBoxIcon sx={{ fontSize: 30 }} />}
                                                                />
                                                                <Typography variant="caption">{access.accessType?.toUpperCase()}</Typography>
                                                            </Box>
                                                        ))
                                                    }
                                                </Box>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            ))  : <Box>
                <Typography variant="h6" sx={{ color: 'error.main', textAlign: 'center' }}>No Sub Function Available!</Typography>
                <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center' }}>{!mainMenuId ? 'Please Select Main Menu to get role function details!' : '' }</Typography>
                </Box>
        }
        </Box>
    );
};

export default RoleFunctionAccordianTable;
