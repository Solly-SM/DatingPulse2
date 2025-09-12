import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PulseLogo from './PulseLogo';
import {
  NameAboutStep,
  BirthDateStep,
  GenderDisplayStep,
  PersonalDetailsStep,
  AboutMeStep,
  InterestsStep,
  PhysicalAttributesStep,
  PreferencesStep,
  LifestyleStep,
  MediaStep,
  ProfileData
} from './registration/profile-steps';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  'Name & About', 
  'Birth Date',
  'Gender & Display',
  'Orientation',
  'Interested In',
  'Looking For',
  'Distance',
  'Lifestyle',
  'Personality',
  'Interests',
  'Languages',
  'Physical Details',
  'Photos',
  'Audio Intro',
  'Location'
];

interface RegistrationData {
  email: string;
  profileData: ProfileData | null;
}

function MultiStepRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get email from location state (passed from LoginModal) 
  const email = location.state?.email || 'demo@example.com'; // Use demo email for testing

  useEffect(() => {
    // For demo purposes, don't redirect even if no email is provided
    // if (!email) {
    //   navigate('/');
    // }
  }, [email, navigate]);

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

  const handleProfileStepComplete = (stepData: any, stepName: keyof ProfileData) => {
    setProfileData(prev => ({
      ...prev,
      [stepName]: stepData
    }));
    setActiveStep(prev => prev + 1);
    setError('');
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
    setError('');
  };

  const handleSkipStep = () => {
    setActiveStep(prev => prev + 1);
    setError('');
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate profile creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate auto-login after successful registration
      const loginData = {
        username: email,
        password: 'temp-password', // In real app, would use proper authentication
      };
      
      await login(loginData);
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
      case 0: // Name & About
        return (
          <NameAboutStep
            data={{
              firstName: profileData.personalDetails.firstName,
              bio: profileData.aboutMe.bio
            }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                personalDetails: { ...prev.personalDetails, firstName: data.firstName },
                aboutMe: { ...prev.aboutMe, bio: data.bio }
              }));
              handleNextStep();
            }}
            onBack={() => navigate('/')}
            loading={loading}
          />
        );
      case 1: // Birth Date
        return (
          <BirthDateStep
            data={{ dateOfBirth: profileData.personalDetails.dateOfBirth }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                personalDetails: { ...prev.personalDetails, dateOfBirth: data.dateOfBirth }
              }));
              handleNextStep();
            }}
            onBack={handleBack}
            onSkip={handleSkipStep}
            loading={loading}
          />
        );
      case 2: // Gender & Display
        return (
          <GenderDisplayStep
            data={{
              gender: profileData.personalDetails.gender,
              showGender: true // This should be stored in preferences
            }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                personalDetails: { ...prev.personalDetails, gender: data.gender }
              }));
              handleNextStep();
            }}
            onBack={handleBack}
            onSkip={handleSkipStep}
            loading={loading}
          />
        );
      case 3: // Orientation - placeholder
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>Sexual Orientation</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleNextStep}>Continue</Button>
          </Box>
        );
      case 4: // Interested In - placeholder
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>Who You're Interested In</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleNextStep}>Continue</Button>
          </Box>
        );
      case 5: // Looking For - placeholder
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>What You're Looking For</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleNextStep}>Continue</Button>
          </Box>
        );
      case 6: // Distance - placeholder
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>Distance Preference</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleNextStep}>Continue</Button>
          </Box>
        );
      case 7: // Lifestyle
        return (
          <LifestyleStep
            data={profileData.lifestyle}
            onComplete={(data) => handleProfileStepComplete(data, 'lifestyle')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 8: // Personality - placeholder
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>Personality</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleNextStep}>Continue</Button>
          </Box>
        );
      case 9: // Interests
        return (
          <InterestsStep
            data={profileData.interests}
            onComplete={(data) => handleProfileStepComplete(data, 'interests')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 10: // Languages - placeholder
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>Languages</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleNextStep}>Continue</Button>
          </Box>
        );
      case 11: // Physical Details
        return (
          <PhysicalAttributesStep
            data={profileData.physicalAttributes}
            onComplete={(data) => handleProfileStepComplete(data, 'physicalAttributes')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 12: // Photos
        return (
          <MediaStep
            data={profileData.media}
            onComplete={(data) => handleProfileStepComplete(data, 'media')}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 13: // Audio Intro - placeholder
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>Audio Introduction</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleNextStep}>Continue</Button>
          </Box>
        );
      case 14: // Location - final step
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>Your Location</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>This step is under development</Typography>
            <Button variant="contained" onClick={handleFinalSubmit} disabled={loading}>
              {loading ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          </Box>
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
            <PulseLogo sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4">
              DatingPulse
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" align="center" sx={{ mb: 1 }}>
            Create Your Perfect Dating Profile
          </Typography>
          
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Setting up profile for {email}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="caption">
                    {index < 3 ? label : ''}
                  </Typography>
                </StepLabel>
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