import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import { grey, green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { logInService, resetPasswordService } from '../../../services/authenticationServices';
import { useUI } from '../../../context/UIContext';
import ChangePasswordForm from './ChangePasswordForm';

function LoginFom({ onLogin }) {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginIdError, setLoginIdError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showResetPasswordSection, setShowResetPasswordSection] = useState(false);
  const [firstTimeUserDetails, setFirstTimeUserDetails] = useState(null);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(prev => !prev);

  const validateLogIn = () => {
    let valid = true;
    if (!loginId) {
      setLoginIdError({ value: true, error: 'Please Enter Login Id!' });
      valid = false;
    }
    if (!password) {
      setPasswordError({ value: true, error: 'Please Enter a Password!' });
      valid = false;
    }
    if (loginId) {
      if (loginId.toLowerCase().startsWith('frnm')) {
        if (loginId.length !== 10) {
          setLoginIdError({ value: true, error: 'Please Enter Valid Login Id!' });
          valid = false;
        }
      } else {
        if (loginId.length !== 6) {
          setLoginIdError({ value: true, error: 'Please Enter Valid Login Id!' });
          valid = false;
        }
      }
    }
    return valid;
  };

  const loginOnClick = () => {
    setLoginIdError(null);
    setPasswordError(null);
    if (!validateLogIn()) return;

    const logInIdReqParam = loginId.length === 6 ? 'FRNM' + loginId : loginId;
    showLoader();
    logInService({
      loginId: logInIdReqParam,
      password
    })
      .then(res => {
        if (res.status) {
          if (
            res.message ===
            'You seem to attempt logging in for the very first time. You must reset your password.'
          ) {
            showSnackbar(res.message, 'warning');
            if (res.responseObject) {
              setFirstTimeUserDetails(res.responseObject);
              setShowResetPasswordSection(true);
            } else {
              showSnackbar('Something went wrong!', 'error');
            }
            return;
          } else {
            if (res.responseObject) {
              showSnackbar('Login Successful!', 'success');
              onLogin(JSON.stringify(res.responseObject));
              navigate('/dashboard');
            } else {
              showSnackbar('Something went wrong!', 'error');
            }
          }
        } else {
          showSnackbar(res.message, 'error');
        }
      })
      .catch(error => {
        console.log('Login Failed!', error);
        showSnackbar('Login Failed!', 'error');
      })
      .finally(() => {
        hideLoader();
      });
  };

  const resetPasswordAPICall = newPassword => {
    const userId = firstTimeUserDetails?.userdetailDTO?.userId;
    const userName = firstTimeUserDetails?.userdetailDTO?.loginId;
    const token = firstTimeUserDetails?.token;
    showLoader();
    const req = {
      dataAccessDTO: { userId, userName },
      userId,
      token,
      newPassword
    };

    resetPasswordService(req)
      .then(res => {
        if (res.status) {
          showSnackbar('Reset Password Successful!', 'success');
          onLogin(JSON.stringify(firstTimeUserDetails));
          navigate('/dashboard');
        } else {
          showSnackbar(res.message, 'error');
        }
      })
      .catch(error => {
        console.log('Reset Password Failed!', error);
        showSnackbar('Reset Password Failed!', 'error');
      })
      .finally(() => {
        hideLoader();
      });
  };

  // --- FORM UI ---
  return !showResetPasswordSection ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: grey[100],
          textAlign: 'center',
        }}
      >
        Sign In
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Login Id"
        autoComplete="new-password"
        value={loginId}
        onChange={e => setLoginId(e.target.value)}
        error={loginIdError?.value}
        helperText={loginIdError?.value ? loginIdError.error : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"  sx={{ color: 'white' }}>
                <Typography sx={{ color: 'white' }}>
                    FRNM
                </Typography>
           
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
          },
          '& .MuiInputLabel-root': { color: grey[300] },
                    '& .MuiInputLabel-root.Mui-focused': {
            color: '#fff', // keep label white when focused
            },
          '& .MuiFormHelperText-root': { color: '#ffb4a2' },
        }}
      />

      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={passwordError?.value}
        helperText={passwordError?.value ? passwordError.error : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityIcon
                style={{
                  cursor: 'pointer',
                  color: showPassword ? green[400] : grey[400],
                }}
                onClick={handleClickShowPassword}
              />
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
          },
            '& .MuiInputLabel-root.Mui-focused': {
      color: '#fff', // keep label white when focused
    },
          '& .MuiInputLabel-root': { color: grey[300] },
          '& .MuiFormHelperText-root': { color: '#ffb4a2' },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={loginOnClick}
        sx={{
          mt: 1,
          py: 1.2,
          borderRadius: 2,
          background: 'linear-gradient(to right, #0f5132, #198754)',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            background: 'linear-gradient(to right, #0c4128, #146c43)',
          }
        }}
      >
        <LoginIcon sx={{ color: '#fff' }} />
        Log In
      </Button>
    </Box>
  ) : (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, mb: 2, color: grey[100], textAlign: 'center' }}
      >
        Reset Password
      </Typography>
      <ChangePasswordForm resetPasswordMode={true} onClickSubmit={resetPasswordAPICall} />
    </Box>
  );
}

export default LoginFom;
