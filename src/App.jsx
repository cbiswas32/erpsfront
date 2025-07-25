import { useState } from 'react';
import {UIProvider} from './context/UIContext'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChangePasword from './pages/ChangePasword';
import AuthenticatedPageContainer from './layouts/AuthenticatedPageContainer';
import User from './pages/User';
import State from './pages/State';
import District from './pages/District';

import UserRoleFunctionMap from './pages/UserRoleFunctionMap';

import { setStoredUserDetails, removedStoredUserDetails, checkUserLoggedIn } from './utils/loginUtil';

import LocationType from './pages/LocationType';
import Location from './pages/Location';
import UserLocationMapping from './pages/UserLocationMapping';
import ProductCategory from './pages/ProductCategory';
import ProductFeature from './pages/ProductFeature';
import ProductPage from './pages/ProductPage';
import VendorManagementPage from './pages/VendorManagementPage';
import PoManagement from './pages/POManagement';
import InvoiceManagement from './pages/InvoiceManagement';
import GrnManagement from './pages/GrnManagement';

// MUI date adapter
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";




function App() {
  const isLoggedIn = checkUserLoggedIn();
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn); // Toggle this for testing


  const login = (userData) => {
    if(userData){
      setStoredUserDetails(userData)
    }
    setIsAuthenticated(true)
  };
  const logout = () => {
    removedStoredUserDetails()
    setIsAuthenticated(false);
  }
  return (
     <LocalizationProvider dateAdapter={AdapterDayjs}>
        <UIProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={ isAuthenticated ? <Navigate to="/dashboard" replace  /> : <Login onLogin={login} />} />
              
              {/* Protected Routes */}
              <Route
                path="/"
                element={<AuthenticatedPageContainer isAuthenticated={isAuthenticated} logout={logout} replace  />}
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="changepassword" element={<ChangePasword />} />
          
               
                <Route path="bs/state" element={<State />} />
                <Route path="bs/district" element={<District />} />
                <Route path="bs/locationType" element={<LocationType />} />
                <Route path="bs/location" element={<Location />} />
                <Route path="bs/userLocationMap" element={<UserLocationMapping />} />
                
                
                <Route path="product/productCategory" element={<ProductCategory />} />
                <Route path="product/productFeature" element={<ProductFeature />} />
                <Route path="product/productPage" element={<ProductPage />} />

                <Route path="inventoryManagemnt/vendor" element={<VendorManagementPage />} />
                <Route path="inventoryManagemnt/po" element={<PoManagement />} />
                <Route path="inventoryManagemnt/pi" element={<InvoiceManagement />} />
                <Route path="inventoryManagemnt/grn" element={<GrnManagement />} />

                <Route path="sa/user" element={<User />} />

                <Route path="sa/userrolemap" element={<UserRoleFunctionMap />} />


                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </BrowserRouter>  
        </UIProvider>
    </LocalizationProvider>
   
  );
}

export default App;
