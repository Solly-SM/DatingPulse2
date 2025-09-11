import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BasicInfoStep from './registration/BasicInfoStep';
import OTPVerificationStep from './registration/OTPVerificationStep';
import ProfileSetupStep from './registration/ProfileSetupStep';
import { RegisterRequest, OTPVerificationRequest, ProfileSetupRequest } from '../types/User';
import { authService } from '../services/authService';
import { otpService } from '../services/otpService';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const steps = ['Account Info', 'Verify Phone', 'Complete Profile'];

interface RegistrationData {
  basicInfo: RegisterRequest | null;
  otpVerified: boolean;
  profileData: Omit<ProfileSetupRequest, 'userID'> | null;
}

function MultiStepRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    basicInfo: null,
    otpVerified: false,
    profileData: null,
  });
  const [tempUserId, setTempUserId] = useState<number | null>(null);

  const handleBasicInfoComplete = async (data: RegisterRequest) => {
    setLoading(true);
    setError('');

    try {
      // Create account
      const authResponse = await authService.register(data);
      setTempUserId(authResponse.user.userID);
      setRegistrationData(prev => ({ ...prev, basicInfo: data }));
      
      // Send OTP if phone is provided
      if (data.phone) {
        await otpService.sendOTP({
          phone: data.phone,
          type: 'phone'
        });
      }
      
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationComplete = async (data: OTPVerificationRequest) => {
    setLoading(true);
    setError('');

    try {
      const result = await otpService.verifyOTP(data);
      if (result.verified) {
        setRegistrationData(prev => ({ ...prev, otpVerified: true }));
        setActiveStep(2);
      } else {
        setError('Invalid OTP code. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSetupComplete = async (data: Omit<ProfileSetupRequest, 'userID'>) => {
    if (!tempUserId) {
      setError('User ID not found. Please restart registration.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update user profile
      await userService.updateProfile(tempUserId, {
        ...data,
        userID: tempUserId,
      });

      // Auto-login after successful registration
      if (registrationData.basicInfo) {
        await login({
          username: registrationData.basicInfo.username,
          password: registrationData.basicInfo.password,
        });
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep
            onComplete={handleBasicInfoComplete}
            onBack={() => navigate('/login')}
            loading={loading}
            error={error}
          />
        );
      case 1:
        return (
          <OTPVerificationStep
            phone={registrationData.basicInfo?.phone || ''}
            onComplete={handleOTPVerificationComplete}
            onBack={handleBack}
            loading={loading}
            error={error}
          />
        );
      case 2:
        return (
          <ProfileSetupStep
            onComplete={handleProfileSetupComplete}
            onBack={handleBack}
            loading={loading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Favorite sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4">
              DatingPulse
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" align="center" sx={{ mb: 3 }}>
            Join the Dating Revolution
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}
        </Paper>
      </Box>
    </Container>
  );
}

export default MultiStepRegister;