import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import React, { useState } from 'react';
import { grey, green } from '@mui/material/colors';

import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import InfoIcon from '@mui/icons-material/Info';
function ChangePasswordForm({onClickSubmit, resetPasswordMode}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [loginIdError, setLoginIdError ] =  useState(null)
    const [passwordError, setPasswordError ] =  useState(null)
    const [newPasswordError, setNewPasswordError ] =  useState(null)
    const [confirmPasswordError, setConfirmPasswordError ] =  useState(null)
    const handleClickShowPassword  = (passwordField) => {
        if(passwordField === 'old'){
          setShowPassword(prev => !prev)
        }
        if(passwordField === 'new'){
          setShowNewPassword(prev => !prev)
        }
        if(passwordField === 'confirm'){
          setShowConfirmPassword(prev => !prev)
        }
       
    }
  
    const validateFormFieldsChangePassword = () =>{
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
       let errors = {}
        if(!resetPasswordMode && !password){
          errors.old = {
            value: true,
            error: 'Existing password field can not be empty!'
          }
        }
        if(!newPassword){
          errors.new = {
            value: true,
            error: 'New password field can not be empty!'
          }
        }
        if(!confirmPassword){
          errors.confirm = {
            value: true,
            error: 'Confirm password field can not be empty!'
          }
        }
        if(newPassword && !passwordRegex.test(newPassword)){
          errors.new = {
            value: true,
            error: 'Must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.'
          }
        }
        if(confirmPassword && !passwordRegex.test(confirmPassword)){
          errors.confirm = {
            value: true,
            error: 'Must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.'
          }
        }
        if(newPassword && confirmPassword && newPassword != confirmPassword){
          errors.confirm = {
            value: true,
            error: 'Must be same as new password!'
          }
        }

        if(Object.keys(errors).length > 0){
          setPasswordError(errors.old || null)
          setNewPasswordError(errors.new || null)
          setConfirmPasswordError(errors.confirm || null)
          return false

        }
        else{
          setPasswordError(null)
          setNewPasswordError(null)
          setConfirmPasswordError(null)
          return true
        }

    }
    const changePasswordOnClick =() =>{
      if(validateFormFieldsChangePassword()){
        let request = resetPasswordMode ? newPassword :  {
          'inputPassword': password,
          'newPassword': newPassword
        }
        onClickSubmit(request)
      }
           
    }
    return (
        <Box  sx={{
            background: grey[50],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '15px'
        }}>
    
        {!resetPasswordMode && <TextField
          error={passwordError?.value}
          name="disable-autocomplete-login-password"
          label="Existing Password"
          type={showPassword ? 'text' : 'password'}
          id="old-password"
          autoComplete="old-password"
          sx={{m: 2, width: '25ch' }}
          slotProps={{
            inputLabel : {
                shrink: true
            },
            input: {
                endAdornment: <InputAdornment position="end">
                    <VisibilityIcon style={{
                        cursor: "pointer",
                        color: showPassword ? green[400] : grey[500]
                    }}
                    onClick={
                        () => handleClickShowPassword('old')
                    }

                     />
                </InputAdornment>,
            },
          }}
          value={password}
          onChange={(e)=>{
            setPassword(e.target.value)
          }}
          helperText={
            passwordError?.value  
              ? passwordError?.error
              : ""
          }
        />}
        <TextField
          error ={ newPasswordError?.value}
          name="disable-autocomplete-login-password"
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          id="new-password"
          autoComplete="new-password"
          sx={{m: 2, width: '25ch' }}
          slotProps={{
            inputLabel : {
                shrink: true
            },
            input: {
                endAdornment: <InputAdornment position="end">
                    <VisibilityIcon style={{
                        cursor: "pointer",
                        color: showNewPassword ? green[400] : grey[500]
                    }}
                    onClick={
                        () => handleClickShowPassword('new')
                    }

                     />
                </InputAdornment>,
            },
          }}
          value={newPassword}
          onChange={(e)=>{
            setNewPassword(e.target.value)
          }}
          helperText={
            newPasswordError?.value  
              ? newPasswordError?.error
              : ""
          }
        />
        <TextField
          error={confirmPasswordError?.value}
          name="disable-autocomplete-login-password"
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirm-password"
          autoComplete="confirm-password"
          sx={{m: 2, width: '25ch' }}
          slotProps={{
            inputLabel : {
                shrink: true
            },
            input: {
                endAdornment: <InputAdornment position="end">
                    <VisibilityIcon style={{
                        cursor: "pointer",
                        color: showConfirmPassword ? green[400] : grey[500]
                    }}
                    onClick={
                       () => handleClickShowPassword('confirm')
                    }

                     />
                </InputAdornment>,
            },
          }}
          value={confirmPassword}
          onChange={(e)=>{
            setConfirmPassword(e.target.value)
          }}
          helperText={
            confirmPasswordError?.value  
              ? confirmPasswordError?.error
              : ""
          }
        />
        <Box sx={{p:1, maxWidth: 300, display: 'flex',  gap: 1, justifyContent: 'center', alignItems: 'center'}}>
          <InfoIcon color='primary' ></InfoIcon>
          <Typography variant='overline' color='primary.light'  sx={{ lineHeight: 1.2 }}>
          Password must be 8+ chars, <br />1 uppercase, 1 lowercase, <br /> 1 number, 1 special char.
          </Typography>
        </Box>
        <Button variant='contained' sx={{
            mt:2,
            mb: 5,
            display: 'flex',
            gap: 1
        }}
        onClick={changePasswordOnClick}
        >
            <ManageHistoryIcon style={{
                color: grey[200]
            }} />
            
            <Typography color={grey[200]} fontWeight={500}>
                {resetPasswordMode ? 'Reset' : 'Change Password'}
            </Typography>
        </Button>

        </Box>
    );
}

export default ChangePasswordForm;