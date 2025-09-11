import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import {
  PersonalDetailsStep,
  AboutMeStep,
  InterestsStep,
  PhysicalAttributesStep,
  PreferencesStep,
  LifestyleStep,
  MediaStep,
  ProfileData
} from '../components/registration/profile-steps';

const steps = [
  'Personal Details',
  'About Me',
  'Interests',
  'Physical Attributes',
  'Preferences',
  'Lifestyle',
  'Photos & Audio'
];

function ProfileStepsDemo() {
  const [activeStep, setActiveStep] = useState(0);
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

  const handleNext = (data: any, stepName: keyof ProfileData) => {
    setProfileData(prev => ({
      ...prev,
      [stepName]: data
    }));
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PersonalDetailsStep
            data={profileData.personalDetails}
            onComplete={(data) => handleNext(data, 'personalDetails')}
            onBack={handleBack}
            loading={false}
          />
        );
      case 1:
        return (
          <AboutMeStep
            data={profileData.aboutMe}
            onComplete={(data) => handleNext(data, 'aboutMe')}
            onBack={handleBack}
            loading={false}
          />
        );
      case 2:
        return (
          <InterestsStep
            data={profileData.interests}
            onComplete={(data) => handleNext(data, 'interests')}
            onBack={handleBack}
            loading={false}
          />
        );
      case 3:
        return (
          <PhysicalAttributesStep
            data={profileData.physicalAttributes}
            onComplete={(data) => handleNext(data, 'physicalAttributes')}
            onBack={handleBack}
            loading={false}
          />
        );
      case 4:
        return (
          <PreferencesStep
            data={profileData.preferences}
            onComplete={(data) => handleNext(data, 'preferences')}
            onBack={handleBack}
            loading={false}
          />
        );
      case 5:
        return (
          <LifestyleStep
            data={profileData.lifestyle}
            onComplete={(data) => handleNext(data, 'lifestyle')}
            onBack={handleBack}
            loading={false}
          />
        );
      case 6:
        return (
          <MediaStep
            data={profileData.media}
            onComplete={(data) => {
              alert('Profile creation completed! All data collected successfully.');
            }}
            onBack={handleBack}
            loading={false}
          />
        );
      default:
        return (
          <Box textAlign="center" py={4}>
            <Typography variant="h5" gutterBottom>
              🎉 Profile Creation Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              All steps have been completed successfully.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(0)}
              sx={{ mt: 2 }}
            >
              Start Over
            </Button>
          </Box>
        );
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
            Profile Steps Demo
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </Paper>
      </Box>
    </Container>
  );
}

export default ProfileStepsDemo;