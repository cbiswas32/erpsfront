import React from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoginFom from '../features/authentication/components/LoginFom';

function Login({ onLogin }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    { title: 'Manufacturing', desc: 'Work orders, process tracking' },
    { title: 'Inventory', desc: 'Stock management & movement logs' },
    { title: 'BOM', desc: 'Flat/multi-level component management' },
    { title: 'Vendors', desc: 'Suppliers & purchase handling' },
    { title: 'Sales', desc: 'Quotations and sales tracking' },
    { title: 'Users & Roles', desc: 'Multi-location user access control' },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: 'linear-gradient(to right, #0f5132, #198754)',
      }}
    >
      {/* LEFT PANEL: Features */}
      {!isSmall && (
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 6,
            color: 'white',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
            Welcome to ERP Portal
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
            Manage everything in one place
          </Typography>
          {features.map((f) => (
            <Box key={f.title} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                • {f.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {f.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* RIGHT PANEL: Login */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          minHeight: { xs: '100vh', md: '100%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 420,
              padding: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 64, 0, 0.37)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: 700, letterSpacing: 1, mb: 2 }}
            >
              ERP Login
            </Typography>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: '#e0e0e0', mb: 3 }}
            >
              Sign in to access your dashboard
            </Typography>

            <LoginFom onLogin={onLogin} />

            <Typography
              variant="caption"
              align="center"
              display="block"
              sx={{ mt: 3, color: '#ccc' }}
            >
              © 2025 All Rights Reserved
            </Typography>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
}

export default Login;
