import { createTheme } from '@mui/material/styles';
import { grey, blueGrey, teal, red, amber } from '@mui/material/colors';

const erpTheme = createTheme({
  palette: {
    primary: {
      main: teal[600],
      accordian: teal[400],
      light: teal[100],
      dark: teal[800],
      contrastText: '#fff',
    },
    secondary: {
      main: grey[700],
      light: grey[300],
      dark: grey[900],
    },
    background: {
      default: grey[100],
      paper: '#fff',
    },
    error: {
      light: red[100],
      main: red[500],
    },
    warning: {
      main: amber[500],
    },
    success: {
      main: teal[500],
    },
    info: {
      main: blueGrey[300],
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
      disabled: grey[500],
    },
  },
  topbar: {
    main: teal[50],      // Light, clean ERP-friendly top bar
    dark: teal[100],     // On hover/darker shades if needed
    text: teal[800],     // For icons or text on top bar
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h6: {
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.8rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    caption: {
      fontSize: '0.7rem',
    },
    overline: {
      fontSize: '0.65rem',
      letterSpacing: '0.5px',
    },
    button: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
        contained: {
          boxShadow: 'none',
          backgroundColor: teal[600],
          '&:hover': {
            backgroundColor: teal[500],
          },
        },
        outlined: {
          borderColor: grey[300],
          '&:hover': {
            borderColor: teal[300],
            backgroundColor: teal[50],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default erpTheme;
