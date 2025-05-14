import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#38bdf8',
      light: '#60d4ff',
      dark: '#1a91c0',
    },
    secondary: {
      main: '#e11d48',
      light: '#ff4d73',
      dark: '#b31435',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '0.5rem 1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});
