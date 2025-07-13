import { Box, Button, Typography } from '@mui/material';
import React, {useEffect} from 'react';
import LoginFom from '../features/authentication/components/LoginFom';
import BackgroundImageLogin  from '../assets/backgroundlogin.jpg'

function Login({onLogin}) {
    
    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `url(${BackgroundImageLogin})`,
            backgroundPosition : 'center',
            backgroundSize : 'cover',
            backdropFilter: 'blur(10px)'
        }}>
            <LoginFom onLogin={onLogin} />
        </Box>
    );
}

export default Login;