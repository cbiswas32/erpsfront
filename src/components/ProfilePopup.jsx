import React from 'react';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { stringToColor } from '../utils/colorUtils';
import { getUserDetailsObj } from '../utils/loginUtil';

function ProfilePopup({ open, logOut, close }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const userDetails = getUserDetailsObj();

  const getFullName = (user) => {
    const { userFirstName, userMiddleName, userLastName } = user || {};
    return [userFirstName, userMiddleName, userLastName].filter(Boolean).join(' ');
  };

  const getAvatarInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0]?.toUpperCase())
      .join('');
  };

  const userName = getFullName(userDetails);
  const avatarName = getAvatarInitials(userName);

  return (
    <Box
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 200,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s ease',
      }}
    >
      <Avatar
        sx={{
          bgcolor: stringToColor(userName),
          width: 56,
          height: 56,
          mb: 1,
          fontWeight: 600,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        {avatarName}
      </Avatar>

      <Typography variant="body1" fontWeight={600} sx={{ mb: 0.2, color: theme.palette.text.primary }}>
        {userName || 'User Name'}
      </Typography>

      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.2 }}>
        {userDetails ? `${userDetails.roleDescription} (${userDetails.roleShortName})` : ''}
      </Typography>

      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
        Login ID: {userDetails?.loginId || ''}
      </Typography>

      {/* <Button
        size="small"
        startIcon={<KeyIcon fontSize="small" />}
        onClick={() => {
          navigate('/changepassword');
          close();
        }}
        sx={{
          mt: 2,
          fontSize: '0.7rem',
          borderRadius: 2,
          paddingX: 1.5,
          textTransform: 'none',
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        Change Password
      </Button> */}

      <Button
        size="small"
        color="error"
        startIcon={<LogoutIcon fontSize="small" />}
        onClick={logOut}
        sx={{
          mt: 1,
          fontSize: '0.7rem',
          borderRadius: 2,
          paddingX: 1.5,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.error.light,
          },
        }}
      >
        Log Out
      </Button>
    </Box>
  );
}

export default ProfilePopup;
