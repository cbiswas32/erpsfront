import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { getMenuDetails } from '../utils/loginUtil';

export default function SideBar({ open, setOpen }) {
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const data = getMenuDetails() || [];
    setMenuList(data);
  }, []);

  const handleCloseDrawer = () => setOpen(false);

  const MenuAccordion = (menu, index) => (
    <Accordion
      key={index}
      disableGutters
      square
      expanded={expandedPanel === menu.id}
      onChange={() => setExpandedPanel(expandedPanel === menu.id ? false : menu.id)}
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '&:before': { display: 'none' },
        transition: 'all 0.3s ease',
      }}
    >
      <AccordionSummary
        expandIcon={menu.subMenuArr.length > 0 ? <ChevronRightIcon sx={{ fontSize: '1rem' }} /> : null}
        aria-controls="panel-content"
        id={`panel-header-${menu.id}`}
        sx={{
          color: theme.palette.text.primary,
          minHeight: 32,
          paddingY: 0.5,
          transition: 'background 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            transform: 'scale(1.02)',
            borderRadius: 1,
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          //console.log(menu, 'm')
          if (!menu.subMenuArr.length) {
            navigate(menu.route);
            handleCloseDrawer();
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {menu.icon}
          <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
            {menu.menuName}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ paddingY: 0.5 }}>
        <Stack spacing={0.5}>
          {menu.subMenuArr.map((submenu, index) => (
            <Box
              key={index}
              onClick={() => {
                navigate(submenu.route);
                handleCloseDrawer();
              }}
              sx={{
                cursor: 'pointer',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.7rem',
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  transform: 'translateX(2px)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {submenu.submenuName} 
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Drawer
      open={open}
      onClose={handleCloseDrawer}
      PaperProps={{
        elevation: 12,
        sx: {
          width: 240,
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowY: 'auto',
        },
      }}
    >
      <Box key={1} sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton size="small" onClick={handleCloseDrawer}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box  key={2} sx={{ p: 1 }}>
        {menuList.length > 0 ? (
          menuList.map((menu, index) => MenuAccordion(menu, index))
        ) : (
          <Typography key={"no-info"} variant="caption" color="text.secondary">No Menu Available</Typography>
        )}
      </Box>
    </Drawer>
  );
}
