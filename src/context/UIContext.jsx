import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";

// Create a context
const UIContext = createContext();

// Custom hook to use UI Context
export const useUI = () => useContext(UIContext);

// UI Provider
export const UIProvider = ({ children }) => {
  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  // Loader State
  const [loading, setLoading] = useState(false);

  // Functions to control Snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Functions to control Loader
  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <UIContext.Provider value={{ showSnackbar, showLoader, hideLoader }}>
      {children}

      {/* Loader (Backdrop with CircularProgress) */}
      <Backdrop sx={{ color: "#fff", zIndex: 2000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </UIContext.Provider>
  );
};
