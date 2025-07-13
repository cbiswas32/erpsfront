import React, {useState} from 'react';
import { Container } from '@mui/material';
import { Navigate, Outlet } from "react-router-dom";
import NavBar from './NavBar';
import SideBar from './SideBar';


function AuthenticatedPageContainer({ isAuthenticated, logout }) {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
      }
    const [openSidebar, setOpenSidebar] = useState(false);
    return (
        <>
        <NavBar setOpenSidebar={setOpenSidebar} logOut={logout} />
        <SideBar open={openSidebar} setOpen={setOpenSidebar} />
        <Container maxWidth="xl" sx={{
            flexGrow: 1,
            pb:2,
            overflowY: "auto",
            height: "calc(100vh - 40px)", // Adjust for the NavBar height
            mt: 2,// Margin to avoid overlap with the sticky NavBar
          }}>
            <Outlet />
        </ Container>
        </>
        
    );
}

export default AuthenticatedPageContainer;