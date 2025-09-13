import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Fade,
  useTheme,
} from '@mui/material';
import PulseLogo from '../components/PulseLogo';
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
  { 
    title: 'Personal Details', 
    subtitle: "Let's start with the basics about you",
    emoji: '👋'
  },
  { 
    title: 'About Me', 
    subtitle: 'Tell us what makes you unique',
    emoji: '💭'
  },
  { 
    title: 'Interests', 
    subtitle: 'What are you passionate about?',
    emoji: '🎯'
  },
  { 
    title: 'Physical Attributes', 
    subtitle: 'Help others get to know you better',
    emoji: '💪'
  },
  { 
    title: 'Preferences', 
    subtitle: 'Who are you looking for?',
    emoji: '💕'
  },
  { 
    title: 'Lifestyle', 
    subtitle: 'What does your ideal day look like?',
    emoji: '🌟'
  },
  { 
    title: 'Photos & Audio', 
    subtitle: 'Show your best self',
    emoji: '📸'
  }
];

function ModernProfileStepsDemo() {
  const theme = useTheme();
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

  const progress = ((activeStep + 1) / steps.length) * 100;

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
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              🎉 You're All Set!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Your profile is complete and ready to find your perfect match!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(0)}
              sx={{ 
                mt: 2,
                borderRadius: 25,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                }
              }}
            >
              Start Over
            </Button>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header with Logo and Progress */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #e91e63, #ff4081)',
            color: 'white',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <PulseLogo 
              animated 
              sx={{ 
                fontSize: 32, 
                color: 'white',
                mr: 1,
              }} 
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              DatingPulse
            </Typography>
          </Box>

          {/* Modern Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: 'white',
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>

          {/* Step Info */}
          {activeStep < steps.length && (
            <Fade in={true} key={activeStep}>
              <Box>
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {steps[activeStep].emoji}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {steps[activeStep].title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {steps[activeStep].subtitle}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Step Content */}
        <CardContent
          sx={{
            p: 0,
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Fade in={true} key={activeStep}>
            <Box sx={{ flex: 1, p: 3 }}>
              {renderStepContent(activeStep)}
            </Box>
          </Fade>
        </CardContent>

        {/* Navigation Dots */}
        {activeStep < steps.length && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              p: 2,
              backgroundColor: '#f8f9fa',
            }}
          >
            {steps.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: index === activeStep ? theme.palette.primary.main : '#ddd',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  }
                }}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
}

export default ModernProfileStepsDemo;