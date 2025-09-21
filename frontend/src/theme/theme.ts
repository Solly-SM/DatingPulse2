import { createTheme } from '@mui/material/styles';

// Centralized theme configuration for consistent styling across the app
const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink for dating app theme
      light: '#ffc1cc',
      dark: '#c2185b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
    error: {
      main: '#e74c3c',
    },
    success: {
      main: '#27ae60',
    },
    warning: {
      main: '#f39c12',
    },
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      '"Roboto"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.02857em',
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.12)',
    '0px 8px 16px rgba(0,0,0,0.14)',
    '0px 12px 24px rgba(0,0,0,0.16)',
    '0px 16px 32px rgba(0,0,0,0.18)',
    '0px 20px 40px rgba(0,0,0,0.2)',
    '0px 24px 48px rgba(0,0,0,0.22)',
    '0px 28px 56px rgba(0,0,0,0.24)',
    '0px 32px 64px rgba(0,0,0,0.26)',
    '0px 36px 72px rgba(0,0,0,0.28)',
    '0px 40px 80px rgba(0,0,0,0.3)',
    '0px 44px 88px rgba(0,0,0,0.32)',
    '0px 48px 96px rgba(0,0,0,0.34)',
    '0px 52px 104px rgba(0,0,0,0.36)',
    '0px 56px 112px rgba(0,0,0,0.38)',
    '0px 60px 120px rgba(0,0,0,0.4)',
    '0px 64px 128px rgba(0,0,0,0.42)',
    '0px 68px 136px rgba(0,0,0,0.44)',
    '0px 72px 144px rgba(0,0,0,0.46)',
    '0px 76px 152px rgba(0,0,0,0.48)',
    '0px 80px 160px rgba(0,0,0,0.5)',
    '0px 84px 168px rgba(0,0,0,0.52)',
    '0px 88px 176px rgba(0,0,0,0.54)',
    '0px 92px 184px rgba(0,0,0,0.56)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
          },
        },
        outlined: {
          borderColor: '#e91e63',
          color: '#e91e63',
          '&:hover': {
            borderColor: '#c2185b',
            color: '#c2185b',
            backgroundColor: 'rgba(233, 30, 99, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#e91e63',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#e91e63',
          },
        },
      },
    },
  },
});

export default theme;