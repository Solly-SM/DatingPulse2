import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  IconButton,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import OTPInput from './OTPInput';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For demo purposes, we'll simulate login and then show OTP
      // In a real app, this would call the actual login API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Show OTP verification step
      setShowOTP(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setOtpLoading(true);
    setError('');

    try {
      // For demo purposes, we'll simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // In a real app, you would verify the OTP here
      // For now, we'll just simulate successful login
      const loginData = {
        username: formData.email, // Use email as username
        password: formData.password,
      };
      
      await login(loginData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setError('');
    setShowOTP(false);
    setOtpLoading(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 500,
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1, position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {showOTP ? 'Verify Your Email' : 'Welcome Back'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {showOTP ? 'Enter the verification code sent to your email' : 'Log in to your DatingPulse account'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4 }}>
        {showOTP ? (
          /* OTP Verification Step */
          <Box sx={{ textAlign: 'center' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              We've sent a verification code to <strong>{formData.email}</strong>
            </Typography>
            
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              disabled={otpLoading}
              error={!!error}
            />
            
            {otpLoading && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Verifying code...
              </Typography>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="text"
                onClick={() => setShowOTP(false)}
                disabled={otpLoading}
              >
                Back to Login
              </Button>
            </Box>
          </Box>
        ) : (
          /* Login Form */
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.2,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Additional Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                type="button"
                sx={{ display: 'block', mb: 1 }}
              >
                Forgot your password?
              </Link>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  sx={{ fontWeight: 'bold' }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;