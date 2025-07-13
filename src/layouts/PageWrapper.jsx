import React, { useEffect, useState } from 'react';
import { Paper, Typography, AppBar, Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'

function PageWrapper(props) {
    const { actionButtons } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const [visibleActionButtons, setVisibleActionButtons] = useState(null);
    const openActionMenu = Boolean(anchorEl);

    useEffect(() => {
        setVisibleActionButtons(actionButtons?.filter(x => x.access === true) || [])
    }, [actionButtons])

    const handleClickActionMenuButton = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    return (
        <Paper sx={{ boxShadow: 3, minHeight: '95%', borderRadius: 2, pb: 1, overflowY: 'auto' }}>
            <AppBar position="sticky" elevation={0} sx={{
                minHeight: '60px',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 2
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography display='inline' variant='h5' sx={{ flexGrow: 1, py: 1, pr: 3, pl: 3, backgroundColor: 'primary.dark', borderRadius: '0 16px 16px 0', color: 'white' }}>
                        {props.title ? props.title : "Page Title"}
                    </Typography>
                </Box>
                <Box>
                {
                    visibleActionButtons && visibleActionButtons?.length === 1 && visibleActionButtons?.map((button, index) => {
                        const { buttonText, buttonIcon, buttonCallback } = button;
                        return (
                            <Button key={index} variant='outlined' size="small" onClick={buttonCallback}

                                sx={
                                    {
                                        mr: 2,
                                    }
                                }>

                                {buttonIcon}
                                {buttonText && <span style={{
                                    margin: '4px'
                                }}>{buttonText}</span>}

                            </Button>
                        )

                    })
                }


                {
                    visibleActionButtons && visibleActionButtons?.length > 1 && <>
                        <Button variant='outlined' size="small" onClick={handleClickActionMenuButton}

                            sx={
                                {
                                    mr: 2,
                                }
                            }>


                            <span style={{
                                margin: '4px'
                            }}>{"Actions"}</span>
                            <KeyboardArrowDownIcon />

                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorOrigin={{ 
                                vertical: 'bottom', 
                                horizontal: 'right', 
                              }}
                              transformOrigin={{ 
                                vertical: 'top',  
                                horizontal: 'right', 
                              }}
                            anchorEl={anchorEl}
                            open={openActionMenu}
                            onClose={handleCloseMenu}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {visibleActionButtons?.map((item, index) => (
                                <MenuItem key={index} onClick={() => { item.buttonCallback(); handleCloseMenu(); }}>
                                    <Button  size="small">
                                    {item.buttonIcon} 
                                    {<span style={{
                                    margin: '4px'
                                }}>{item?.buttonText}</span>}
                                    </Button>
                                </MenuItem>
                            ))}
                        </Menu>


                    </>

                }
                </Box>
                

            </AppBar>
            <Box>
                {props.children}
            </Box>
        </Paper>)
}
 
export default PageWrapper;