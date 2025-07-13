import { Box } from '@mui/material';
import React from 'react';
import ChangePasswordForm from '../features/authentication/components/ChangePasswordForm';
import PageWrapper from '../layouts/PageWrapper';
import { changePasswordService } from '../services/authenticationServices';
import {useUI} from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { removedStoredUserDetails } from '../utils/loginUtil';

function ChangePasword(props) {
    const navigate = useNavigate();
    const { showSnackbar, showLoader, hideLoader } = useUI()
    const changePasswordAPICall = (requestBody) =>{
        showLoader()
        changePasswordService(requestBody).then((res) =>{
            if(res.status){
                showSnackbar('Password Changed Successfully!', 'success')
                //removedStoredUserDetails();
                //navigate('/dashboard')
            }
            else{
                showSnackbar(res.message, 'error')
            }

        }).catch((error)=>{
            showSnackbar('Failed to change Password!', 'error')
            console.log('Failed to change Password!', error)
        }).finally(() => {
            hideLoader()
        })
    }
    return (
        <PageWrapper title="Change Password">
            <ChangePasswordForm onClickSubmit ={changePasswordAPICall}/>
        </PageWrapper>  
    );
}

export default ChangePasword;