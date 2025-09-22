import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import SimpleLoadingScreen from './components/SimpleLoadingScreen';
import LandingPage from './pages/LandingPage';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Likes from './pages/Likes';
import Profile from './pages/Profile';
import ProfileDemo from './pages/ProfileDemo';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Help from './pages/Help';
import About from './pages/About';
import DemoSidebar from './pages/DemoSidebar';
import DemoNotifications from './pages/DemoNotifications';
import DiscoverDemo from './pages/DiscoverDemo';
import ComponentsDemo from './pages/ComponentsDemo';
import MiniProfileDemo from './pages/MiniProfileDemo';
import theme from './theme/theme';
import './App.css';
// Conditionally import demo auth only in development
if (process.env.NODE_ENV === 'development') {
  import('./demo/demoAuth');
}

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
              {/* Redirect old authentication routes to landing page for popup login/signup */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="/demo-sidebar" element={<DemoSidebar />} />
              <Route path="/demo-notifications" element={<DemoNotifications />} />
              <Route path="/demo-discover" element={<DiscoverDemo />} />
              <Route path="/demo-components" element={<ComponentsDemo />} />
              <Route path="/demo-mini-profile" element={<MiniProfileDemo />} />
              <Route path="/demo-profile" element={<ProfileDemo />} />
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
              <Route path="/likes" element={
                <ProtectedRoute>
                  <Layout>
                    <Likes />
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
              <Route path="/chat/:conversationId" element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
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
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
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
              <Route path="/help" element={
                <ProtectedRoute>
                  <Layout>
                    <Help />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/about" element={
                <ProtectedRoute>
                  <Layout>
                    <About />
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