import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import React, { useState } from 'react';
import { grey, green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import {logInService, resetPasswordService} from '../../../services/authenticationServices'
import {useUI} from '../../../context/UIContext';
import ChangePasswordForm from './ChangePasswordForm';
function LoginFom({onLogin}) {
    const { showSnackbar, showLoader, hideLoader } = useUI()
    const [showPassword, setShowPassword] = useState(false);
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [loginIdError, setLoginIdError ] =  useState(null)
    const [passwordError, setPasswordError ] =  useState(null)
    const [showResetPasswordSection, setShowResetPasswordSection] =useState(false)
    const [firstTimeUserDetails, setFirstTimeUserDetails] =useState(null)
    const handleClickShowPassword  = () => {
        setShowPassword(prev => !prev)
    }
    const navigate = useNavigate();
    const validateLogIn = () =>{
        let valid = true
        if(!loginId || loginId === ""){
            setLoginIdError({
                value: true,
                error: "Please Enter Login Id!"
            })
            valid =  false;
        }
        if(!password || password === ""){
            setPasswordError({
                value: true,
                error: "Please Enter a Password!"
            })
            valid =  false;
        }
        if(loginId){
            if(loginId.toLowerCase().startsWith('frnm') ){
                if(loginId.length != 10){
                    setLoginIdError({
                        value: true,
                        error: "Please Enter Valid Login Id!"
                    })
                    valid = false;
                }
               
            }
            else{
                if(loginId.length != 6){
                    setLoginIdError({
                        value: true,
                        error: "Please Enter Valid Login Id!"
                    })
                    valid =  false;
                }
                
            }
            
            
        }
        
        return valid;

    }
    const loginOnClick =() =>{
            setLoginIdError(null);
            setPasswordError(null);
            if(!validateLogIn()){
                return
            }
            let logInIdReqParam = loginId.length == 6 ? 'FRNM'+loginId : loginId
            showLoader()
            logInService({
                'loginId': logInIdReqParam,
                'password' : password
            }).then(res => {
                if(res.status){
                    if(res.message === 'You seem to attempt logging in for the very first time. You must reset your password.' ){
                        showSnackbar(res.message, 'warning') 
                        if(res.responseObject){
                            setFirstTimeUserDetails(res.responseObject);
                            console.log(res.responseObject)
                            setShowResetPasswordSection(true)

                        }
                        else{
                            showSnackbar('Something went wrong!', 'error')
                        }
                        return
                        
                    }
                    else{
                        if(res.responseObject){
                            showSnackbar('Login Successfull!', 'success')
                            onLogin(JSON.stringify(res.responseObject));
                            navigate('/dashboard')
                        }
                        else{
                            showSnackbar('Something went wrong!', 'error')
                        }
                       
                    }
                    
                }
                else{
                    showSnackbar(res.message, 'error')
                }
                
            }).catch(error => {
                console.log('Login Failed!',error)
                showSnackbar('Login Failed!', 'error')
            }).finally(()=>{
                hideLoader()
            })
          
    }

    const resetPasswordAPICall = (newPassword) => {
        let userId = firstTimeUserDetails?.userdetailDTO?.userId
        let userName = firstTimeUserDetails?.userdetailDTO?.loginId
        let token = firstTimeUserDetails?.token
        showLoader()
        let req = {
            'dataAccessDTO' : {
                'userId' : userId,
                'userName' : userName
            },
            'userId' : userId,
            'token' : token,
            'newPassword' : newPassword
        }

        resetPasswordService(req).then((res)=>{
            if(res.status){
                showSnackbar('Reset Password Successful!', 'success')
                onLogin(JSON.stringify(firstTimeUserDetails));
                navigate('/dashboard')
            }
            else{
                showSnackbar( res.message , 'error')
            }
        }).catch(error => {
            showSnackbar('Reset Password Failed!', 'error')
            console.log('Reset Password Failed!', error)

        }).finally(() =>{
            hideLoader()
        })
    }
    return (
        !showResetPasswordSection ? <Box  sx={{
            background: grey[50],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '15px'
        }}>
        <Box height={"60px"} backgroundColor='primary.dark' width={"100%"}
            sx={
                {
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    gap: 1,
                    p: 2,
                    borderRadius: '15px 15px 0px 0px'
                }
            }
        >
            {/* <img src={""} height={40} width={30}>
            </img> */}
            <Typography sx={
                {
                    color: grey[50],
                    fontWeight: 'bold'
                }
            }>Login Here</Typography>
        </Box>
        <TextField
          error = {loginIdError?.value}
          name="disable-autocomplete-login-id"
          label="Login Id"
          id="outlined-start-adornment"
          autoComplete="new-password"
          sx={{ m: 3, mb:1, width: '25ch' }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">FRNM</InputAdornment>,
            },
          }}
          value={loginId}
          onChange={(e)=>{
            setLoginId(e.target.value)
          }}
          helperText={
            loginIdError?.value  
              ? loginIdError?.error
              : ""
          }
        />
        <TextField
          error={passwordError?.value}
          name="disable-autocomplete-login-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="outlined-end-adornment"
          autoComplete="new-password"
          sx={{ m: 3, width: '25ch' }}
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
                        handleClickShowPassword
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
        />
        <Button variant='contained' sx={{
            mt:2,
            mb: 5,
            display: 'flex',
            gap: 1
        }}
        onClick={loginOnClick}
        >
            <LoginIcon style={{
                color: grey[200]
            }} />
            <Typography color={grey[200]} fontWeight={500}>
                Log In
            </Typography>
        </Button>

        </Box> : 
        <Box  sx={{
            background: grey[50],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '15px'
        }}>
        <Box height={"60px"} backgroundColor='primary.dark' width={"100%"}
        sx={
            {
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                gap: 1,
                p: 2,
                borderRadius: '15px 15px 0px 0px'
            }
        }
    >
        <Typography sx={
            {
                color: grey[50],
                fontWeight: 'bold'
            }
        }>Reset Password</Typography>
    </Box>
    <ChangePasswordForm resetPasswordMode={true} onClickSubmit={resetPasswordAPICall}/>
    </Box>
    
    );
}

export default LoginFom;