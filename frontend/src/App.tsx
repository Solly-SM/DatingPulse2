import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import SimpleLoadingScreen from './components/SimpleLoadingScreen';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import MultiStepRegister from './components/MultiStepRegister';
import ProfileStepsDemo from './pages/ProfileStepsDemo';
import ModernProfileStepsDemo from './pages/ModernProfileStepsDemo';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import ProfileDemo from './pages/ProfileDemo';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import DemoSidebar from './pages/DemoSidebar';
import DemoNotifications from './pages/DemoNotifications';
import DiscoverDemo from './pages/DiscoverDemo';
import ComponentsDemo from './pages/ComponentsDemo';
import './App.css';
// Conditionally import demo auth only in development
if (process.env.NODE_ENV === 'development') {
  import('./demo/demoAuth');
}

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
    '0px 24px 48px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.22)',
    '0px 40px 80px rgba(0,0,0,0.24)',
    '0px 48px 96px rgba(0,0,0,0.26)',
    '0px 56px 112px rgba(0,0,0,0.28)',
    '0px 64px 128px rgba(0,0,0,0.3)',
    '0px 72px 144px rgba(0,0,0,0.32)',
    '0px 80px 160px rgba(0,0,0,0.34)',
    '0px 88px 176px rgba(0,0,0,0.36)',
    '0px 96px 192px rgba(0,0,0,0.38)',
    '0px 104px 208px rgba(0,0,0,0.4)',
    '0px 112px 224px rgba(0,0,0,0.42)',
    '0px 120px 240px rgba(0,0,0,0.44)',
    '0px 128px 256px rgba(0,0,0,0.46)',
    '0px 136px 272px rgba(0,0,0,0.48)',
    '0px 144px 288px rgba(0,0,0,0.5)',
    '0px 152px 304px rgba(0,0,0,0.52)',
    '0px 160px 320px rgba(0,0,0,0.54)',
    '0px 168px 336px rgba(0,0,0,0.56)',
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
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(233, 30, 99, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            fontSize: '1rem',
            '& fieldset': {
              borderColor: '#e0e6ed',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#e91e63',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e91e63',
              borderWidth: 2,
            },
            '&.Mui-error fieldset': {
              borderColor: '#e74c3c',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#7f8c8d',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#e91e63',
            },
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

function App() {
  // Monitor performance in development
  usePerformanceMonitoring();
  
  const [isLoading, setIsLoading] = useState(true);
  const [appInitialized, setAppInitialized] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first time loading the app
    const hasLoadedBefore = localStorage.getItem('datingPulseHasLoaded');
    setIsFirstLoad(!hasLoadedBefore);

    // Simulate app initialization
    const initializeApp = async () => {
      // Add any actual initialization logic here
      // For now, just simulate loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      setAppInitialized(true);
    };

    initializeApp();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Mark that the app has been loaded at least once
    localStorage.setItem('datingPulseHasLoaded', 'true');
  };

  // Show appropriate loading screen based on first load or subsequent loads
  if (!appInitialized || isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isFirstLoad ? (
          <LoadingScreen 
            onComplete={handleLoadingComplete}
            duration={3000}
          />
        ) : (
          <SimpleLoadingScreen 
            onComplete={handleLoadingComplete}
            duration={1500}
          />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<MultiStepRegister />} />
              <Route path="/demo" element={<ModernProfileStepsDemo />} />
              <Route path="/demo-old" element={<ProfileStepsDemo />} />
              <Route path="/demo-sidebar" element={<DemoSidebar />} />
              <Route path="/demo-notifications" element={<DemoNotifications />} />
              <Route path="/demo-discover" element={<DiscoverDemo />} />
              <Route path="/demo-explore" element={<Explore />} />
              <Route path="/demo-home" element={<Home />} />
              <Route path="/demo-profile" element={<ProfileDemo />} />
              <Route path="/demo-components" element={<ComponentsDemo />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/explore" element={
                <ProtectedRoute>
                  <Layout>
                    <Explore />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/discover" element={
                <ProtectedRoute>
                  <Layout>
                    <Discover />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/matches" element={
                <ProtectedRoute>
                  <Layout>
                    <Matches />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Layout>
                    <Messages />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/chat/:conversationId" element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              {/* Redirects for old routes */}
              <Route path="/dashboard" element={<Navigate to="/home" replace />} />
              <Route path="/discover" element={<Navigate to="/explore" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
