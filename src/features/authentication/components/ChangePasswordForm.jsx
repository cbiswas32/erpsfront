import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import InfoIcon from '@mui/icons-material/Info';
import React, { useState } from 'react';
import { grey, green } from '@mui/material/colors';

function ChangePasswordForm({ onClickSubmit, resetPasswordMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const handleClickShowPassword = field => {
    if (field === 'old') setShowPassword(prev => !prev);
    if (field === 'new') setShowNewPassword(prev => !prev);
    if (field === 'confirm') setShowConfirmPassword(prev => !prev);
  };

  const validateFormFieldsChangePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let errors = {};

    if (!resetPasswordMode && !password) {
      errors.old = { value: true, error: 'Existing password cannot be empty!' };
    }
    if (!newPassword) {
      errors.new = { value: true, error: 'New password cannot be empty!' };
    }
    if (!confirmPassword) {
      errors.confirm = { value: true, error: 'Confirm password cannot be empty!' };
    }
    if (newPassword && !passwordRegex.test(newPassword)) {
      errors.new = {
        value: true,
        error:
          'Must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.'
      };
    }
    if (confirmPassword && !passwordRegex.test(confirmPassword)) {
      errors.confirm = {
        value: true,
        error:
          'Must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.'
      };
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirm = { value: true, error: 'Must be same as new password!' };
    }

    if (Object.keys(errors).length > 0) {
      setPasswordError(errors.old || null);
      setNewPasswordError(errors.new || null);
      setConfirmPasswordError(errors.confirm || null);
      return false;
    } else {
      setPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);
      return true;
    }
  };

  const changePasswordOnClick = () => {
    if (validateFormFieldsChangePassword()) {
      const request = resetPasswordMode
        ? newPassword
        : { inputPassword: password, newPassword };
      onClickSubmit(request);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%'
      }}
    >
      {!resetPasswordMode && (
        <TextField
          fullWidth
          variant="outlined"
          label="Existing Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={passwordError?.value}
          helperText={passwordError?.value ? passwordError.error : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <VisibilityIcon
                  sx={{ cursor: 'pointer', color: showPassword ? green[400] : grey[400] }}
                  onClick={() => handleClickShowPassword('old')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: 2,
              background: 'rgba(255,255,255,0.15)',
              color: '#fff'
            },
            '& .MuiInputLabel-root': { color: grey[300] },
            '& .MuiFormHelperText-root': { color: '#ffb4a2' }
          }}
        />
      )}

      <TextField
        fullWidth
        variant="outlined"
        label="New Password"
        type={showNewPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        error={newPasswordError?.value}
        helperText={newPasswordError?.value ? newPasswordError.error : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityIcon
                sx={{ cursor: 'pointer', color: showNewPassword ? green[400] : grey[400] }}
                onClick={() => handleClickShowPassword('new')}
              />
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            color: '#fff'
          },
            '& .MuiInputLabel-root.Mui-focused': {
      color: '#fff', // keep label white when focused
    },
          '& .MuiInputLabel-root': { color: grey[300] },
          '& .MuiFormHelperText-root': { color: '#ffb4a2' }
        }}
      />

      <TextField
        fullWidth
        variant="outlined"
        label="Confirm New Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        error={confirmPasswordError?.value}
        helperText={confirmPasswordError?.value ? confirmPasswordError.error : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityIcon
                sx={{
                  cursor: 'pointer',
                  color: showConfirmPassword ? green[400] : grey[400]
                }}
                onClick={() => handleClickShowPassword('confirm')}
              />
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            color: '#fff'
          },
            '& .MuiInputLabel-root.Mui-focused': {
      color: '#fff', // keep label white when focused
    },
          '& .MuiInputLabel-root': { color: grey[300] },
          '& .MuiFormHelperText-root': { color: '#ffb4a2' }
          
        }}
      />

      <Box
        sx={{
          p: 1,
          maxWidth: 300,
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <InfoIcon sx={{ color: grey[100] }} />
        <Typography
          variant="caption"
          sx={{ color: grey[100], textAlign: 'center', lineHeight: 1.4 }}
        >
          Password must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={changePasswordOnClick}
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
            background: 'linear-gradient(to right, #0c4128, #146c43)'
          }
        }}
      >
        <ManageHistoryIcon sx={{ color: '#fff' }} />
        {resetPasswordMode ? 'Reset Password' : 'Change Password'}
      </Button>
    </Box>
  );
}

export default ChangePasswordForm;
