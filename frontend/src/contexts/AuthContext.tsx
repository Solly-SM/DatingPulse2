import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types/User';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Set to true to prevent premature redirects

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser);
          console.log('✅ User authenticated from stored credentials');
          // Skip backend validation in development mode for demo
          if (process.env.NODE_ENV !== 'development') {
            // Optionally validate token with backend in background (non-blocking)
            setTimeout(async () => {
              try {
                await authService.getCurrentUser();
              } catch (error) {
                console.warn('Token validation failed, user may need to re-login:', error);
                // Don't logout automatically to avoid disruption
              }
            }, 100);
          }
        } else if (process.env.NODE_ENV === 'development') {
          // Enable demo mode automatically for protected routes in development
          const protectedPaths = ['/dashboard', '/discover', '/matches', '/messages', '/profile', '/settings', '/chat'];
          const currentPath = window.location.pathname;
          const isProtectedRoute = protectedPaths.some(path => currentPath.startsWith(path));
          
          if (isProtectedRoute) {
            const demoUser = {
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
            localStorage.setItem('authToken', 'demo-jwt-token');
            localStorage.setItem('user', JSON.stringify(demoUser));
            setUser(demoUser);
            console.log('🎭 Demo mode enabled - Auto-logged in as demo user for protected route:', currentPath);
          }
        }
      } catch (error) {
        console.warn('Auth initialization failed:', error);
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const authResponse: AuthResponse = await authService.login(credentials);
      authService.storeAuth(authResponse);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    try {
      const authResponse: AuthResponse = await authService.register(userData);
      authService.storeAuth(authResponse);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}