import React from 'react';
import { Box } from '@mui/material';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';

// Mock user for demo
const mockUser = {
  userID: 1,
  username: "demouser",
  email: "demo@datingpulse.com", 
  phone: "0821234567",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  lastLogin: "2024-01-01T00:00:00.000Z",
  isVerified: true
};

// Mock AuthContext for demo
const mockAuthContext = {
  user: mockUser,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: true,
};

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    // Set localStorage for demo
    localStorage.setItem('authToken', 'demo-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
  }, []);

  return (
    <div>
      {React.cloneElement(children as React.ReactElement, {
        // Inject mock auth context
        authContext: mockAuthContext
      })}
    </div>
  );
};

function DemoSidebar() {
  React.useEffect(() => {
    // Override useAuth hook for this demo
    (window as any).__mockAuth = mockAuthContext;
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Layout>
        <Dashboard />
      </Layout>
    </Box>
  );
}

export default DemoSidebar;