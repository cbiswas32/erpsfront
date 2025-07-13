import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import erpTheme from "./theme";

const ThemeProvider = ({ children }) => {
  return (
    <MuiThemeProvider theme={erpTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
