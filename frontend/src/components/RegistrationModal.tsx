import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  NameAboutStep,
  BirthDateStep,
  GenderDisplayStep,
  SexualOrientationStep,
  LookingForStep,
  InterestedInStep,
  InterestsStep,
  PhysicalAttributesStep,
  PersonalityStep,
  LifestyleStep,
  DistancePreferenceStep,
  MediaStep,
  ProfileData
} from './registration/profile-steps';
import { useAuth } from '../contexts/AuthContext';

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

const stepTitles = [
  'Tell us about yourself',
  'Your birth date',
  'Gender & display',
  'Sexual orientation',
  'What are you looking for?',
  'Who are you interested in?',
  'Your interests',
  'Physical details',
  'Your personality',
  'Your lifestyle',
  'Distance preference',
  'Add photos',
];

function RegistrationModal({ open, onClose, email }: RegistrationModalProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      interestedIn: [],
      showGender: false,
      showOrientation: false,
      lookingFor: '',
      maxDistance: 50
    },
    lifestyle: {},
    personality: {},
    media: {
      photos: []
    }
  });

  const handleStepComplete = (stepData: any, stepName?: keyof ProfileData) => {
    if (stepName) {
      setProfileData(prev => ({
        ...prev,
        [stepName]: stepData
      }));
    }
    
    if (activeStep < stepTitles.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
    setError('');
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    } else {
      onClose();
    }
    setError('');
  };

  const handleSkip = () => {
    if (activeStep < stepTitles.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
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
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setError('');
    onClose();
  };

  const renderStepContent = (step: number) => {
    const commonProps = {
      onBack: handleBack,
      onSkip: handleSkip,
      loading: loading
    };

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
              handleStepComplete(data);
            }}
            {...commonProps}
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
              handleStepComplete(data);
            }}
            {...commonProps}
          />
        );
      case 2: // Gender & Display
        return (
          <GenderDisplayStep
            data={{
              gender: profileData.personalDetails.gender,
              showGender: profileData.preferences.showGender || false
            }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                personalDetails: { ...prev.personalDetails, gender: data.gender },
                preferences: { ...prev.preferences, showGender: data.showGender }
              }));
              handleStepComplete(data);
            }}
            {...commonProps}
          />
        );
      case 3: // Sexual Orientation
        return (
          <SexualOrientationStep
            data={{
              sexualOrientation: profileData.preferences.sexualOrientation || '',
              showOrientation: profileData.preferences.showOrientation || false
            }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                preferences: { 
                  ...prev.preferences, 
                  sexualOrientation: data.sexualOrientation,
                  showOrientation: data.showOrientation
                }
              }));
              handleStepComplete(data);
            }}
            {...commonProps}
          />
        );
      case 4: // Looking For
        return (
          <LookingForStep
            data={{
              lookingFor: profileData.preferences.lookingFor || ''
            }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                preferences: { 
                  ...prev.preferences, 
                  lookingFor: data.lookingFor
                }
              }));
              handleStepComplete(data);
            }}
            {...commonProps}
          />
        );
      case 5: // Interested In
        return (
          <InterestedInStep
            data={{
              interestedIn: profileData.preferences.interestedIn || []
            }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                preferences: { 
                  ...prev.preferences, 
                  interestedIn: data.interestedIn
                }
              }));
              handleStepComplete(data);
            }}
            {...commonProps}
          />
        );
      case 6: // Interests
        return (
          <InterestsStep
            data={profileData.interests}
            onComplete={(data) => handleStepComplete(data, 'interests')}
            {...commonProps}
          />
        );
      case 7: // Physical Details
        return (
          <PhysicalAttributesStep
            data={profileData.physicalAttributes}
            onComplete={(data) => handleStepComplete(data, 'physicalAttributes')}
            {...commonProps}
          />
        );
      case 8: // Personality
        return (
          <PersonalityStep
            data={profileData.personality}
            onComplete={(data) => handleStepComplete(data, 'personality')}
            {...commonProps}
          />
        );
      case 9: // Lifestyle
        return (
          <LifestyleStep
            data={profileData.lifestyle}
            onComplete={(data) => handleStepComplete(data, 'lifestyle')}
            {...commonProps}
          />
        );
      case 10: // Distance Preference
        return (
          <DistancePreferenceStep
            data={{
              maxDistance: profileData.preferences.maxDistance || 50
            }}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                preferences: { 
                  ...prev.preferences, 
                  maxDistance: data.maxDistance
                }
              }));
              handleStepComplete(data);
            }}
            {...commonProps}
          />
        );
      case 11: // Photos (final step)
        return (
          <MediaStep
            data={profileData.media}
            onComplete={(data) => {
              setProfileData(prev => ({
                ...prev,
                media: data
              }));
              handleFinalSubmit();
            }}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 400,
          maxHeight: '90vh',
          overflow: 'auto'
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
          {stepTitles[activeStep]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Step {activeStep + 1} of {stepTitles.length} • {email}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>
    </Dialog>
  );
}

export default RegistrationModal;