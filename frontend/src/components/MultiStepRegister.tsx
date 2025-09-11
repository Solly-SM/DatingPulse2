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
import {
  PersonalDetailsStep,
  AboutMeStep,
  InterestsStep,
  PhysicalAttributesStep,
  PreferencesStep,
  LifestyleStep,
  MediaStep,
  ProfileData
} from './registration/profile-steps';
import { RegisterRequest, OTPVerificationRequest } from '../types/User';
import { authService } from '../services/authService';
import { otpService } from '../services/otpService';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  'Account Info', 
  'Verify Email', 
  'Personal Details',
  'About Me',
  'Interests',
  'Physical Attributes',
  'Preferences',
  'Lifestyle',
  'Photos & Audio'
];

interface RegistrationData {
  basicInfo: RegisterRequest | null;
  otpVerified: boolean;
  profileData: ProfileData | null;
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
  
  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    personalDetails: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      location: ''
    },
    aboutMe: {
      bio: ''
    },
    interests: {
      interests: []
    },
    physicalAttributes: {},
    preferences: {
      interestedIn: ''
    },
    lifestyle: {},
    media: {
      photos: []
    }
  });

  const handleBasicInfoComplete = async (data: RegisterRequest) => {
    setLoading(true);
    setError('');

    try {
      // Create account
      const authResponse = await authService.register(data);
      setTempUserId(authResponse.user.userID);
      setRegistrationData(prev => ({ ...prev, basicInfo: data }));
      
      // Generate email OTP for verification
      await otpService.generateOTP(authResponse.user.userID, 'signup');
      
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationComplete = async (data: OTPVerificationRequest) => {
    if (!tempUserId) {
      setError('User ID not found. Please restart registration.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await otpService.validateOTP(tempUserId, data.code, 'signup');
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

  const handleProfileStepComplete = (stepData: any, stepName: keyof ProfileData) => {
    setProfileData(prev => ({
      ...prev,
      [stepName]: stepData
    }));
    setActiveStep(prev => prev + 1);
    setError('');
  };

  const handleFinalSubmit = async () => {
    if (!tempUserId) {
      setError('User ID not found. Please restart registration.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Combine all profile data for submission
      const completeProfileData = {
        userID: tempUserId,
        firstName: profileData.personalDetails.firstName,
        lastName: profileData.personalDetails.lastName,
        dateOfBirth: profileData.personalDetails.dateOfBirth,
        bio: profileData.aboutMe.bio,
        location: profileData.personalDetails.location,
        interests: profileData.interests.interests,
        gender: profileData.personalDetails.gender.toLowerCase() as 'male' | 'female' | 'other',
        interestedIn: profileData.preferences.interestedIn.toLowerCase() as 'male' | 'female' | 'both',
        height: profileData.physicalAttributes.height,
        // Add other fields based on backend requirements
      };

      // Update user profile
      await userService.updateProfile(tempUserId, completeProfileData);

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
            email={registrationData.basicInfo?.email || ''}
            userId={tempUserId}
            onComplete={handleOTPVerificationComplete}
            onBack={handleBack}
            loading={loading}
            error={error}
          />
        );
      case 2:
        return (
          <PersonalDetailsStep
            data={profileData.personalDetails}
            onComplete={(data) => handleProfileStepComplete(data, 'personalDetails')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 3:
        return (
          <AboutMeStep
            data={profileData.aboutMe}
            onComplete={(data) => handleProfileStepComplete(data, 'aboutMe')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 4:
        return (
          <InterestsStep
            data={profileData.interests}
            onComplete={(data) => handleProfileStepComplete(data, 'interests')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 5:
        return (
          <PhysicalAttributesStep
            data={profileData.physicalAttributes}
            onComplete={(data) => handleProfileStepComplete(data, 'physicalAttributes')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 6:
        return (
          <PreferencesStep
            data={profileData.preferences}
            onComplete={(data) => handleProfileStepComplete(data, 'preferences')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 7:
        return (
          <LifestyleStep
            data={profileData.lifestyle}
            onComplete={(data) => handleProfileStepComplete(data, 'lifestyle')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 8:
        return (
          <MediaStep
            data={profileData.media}
            onComplete={(data) => {
              setProfileData(prev => ({ ...prev, media: data }));
              handleFinalSubmit();
            }}
            onBack={handleBack}
            loading={loading}
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
            Create Your Perfect Dating Profile
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