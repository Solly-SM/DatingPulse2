import api from './api';
import { User, RegisterRequest, LoginRequest, AuthResponse } from '../types/User';

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development' || import.meta.env.VITE_REACT_APP_DEVELOPMENT_MODE === 'true';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (error: any) {
      if (isDevelopment && (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR')) {
        console.warn('Backend not available in development mode. Using mock response.');
        throw new Error('Backend service unavailable. Please ensure the backend server is running on port 8080.');
      }
      throw error;
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    } catch (error: any) {
      if (isDevelopment && (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR')) {
        console.warn('Backend not available in development mode. Using mock response.');
        throw new Error('Backend service unavailable. Please ensure the backend server is running on port 8080.');
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed, clearing local storage anyway:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error: any) {
      if (isDevelopment) {
        console.warn('Could not validate user token with backend:', error.message);
      }
      throw error;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  storeAuth(authResponse: AuthResponse): void {
    localStorage.setItem('authToken', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  },
};