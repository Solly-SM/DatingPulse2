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
import { useNavigate } from 'react-router-dom';
import OTPInput from './OTPInput';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user exists (simulate API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, simulate checking if user exists
      // In real app, this would call the API to check user existence and send OTP
      const userExists = Math.random() > 0.5; // Random simulation
      setIsExistingUser(userExists);
      
      // Always show OTP verification step
      setShowOTP(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setOtpLoading(true);
    setError('');

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isExistingUser) {
        // Existing user - login and go to dashboard
        const loginData = {
          username: email,
          password: 'temp-password', // In real app, OTP would authenticate the user
        };
        await login(loginData);
        onClose();
        navigate('/dashboard');
      } else {
        // New user - go to registration flow
        onClose();
        navigate('/register', { state: { email } });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setShowOTP(false);
    setOtpLoading(false);
    setIsExistingUser(false);
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
          minHeight: 400,
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
          {showOTP ? 'Verify Your Email' : 'Get Started'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {showOTP 
            ? 'Enter the verification code sent to your email' 
            : 'Enter your email to continue'}
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
              We've sent a verification code to <strong>{email}</strong>
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
                Back to Email
              </Button>
            </Box>
          </Box>
        ) : (
          /* Email Form */
          <Box component="form" onSubmit={handleEmailSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 25,
                background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                  boxShadow: '0 6px 25px rgba(233, 30, 99, 0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                  opacity: 0.7,
                },
              }}
            >
              {loading ? 'Sending Code...' : 'Continue'}
            </Button>

            {/* Additional Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                By continuing, you agree to our{' '}
                <Link component="button" variant="body2" type="button">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link component="button" variant="body2" type="button">
                  Privacy Policy
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