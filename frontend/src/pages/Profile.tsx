import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Typography,
  Alert,
  Box,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Favorite as FavoriteIcon,
  FitnessCenter as FitnessCenterIcon,
  SelfImprovement as LifestyleIcon,
  Psychology as PsychologyIcon,
  CameraAlt as CameraIcon,
  Mic as MicIcon,
  LocationOn as LocationIcon,
  Transgender as GenderIcon,
  Search as InterestedInIcon,
  Settings as PreferencesIcon,
  Explore as LookingForIcon,
  Radar as RadarIcon,
  PhotoCamera,
  Close,
  Delete,
  PlayArrow,
  Stop,
  AddPhotoAlternate,
  Verified,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile } from '../types/User';
import MiniProfile from '../components/MiniProfile';

// Import the new twelve edit modals that match registration steps
import NameAboutEditModal from '../components/profile-edit/NameAboutEditModal';
import BirthDateEditModal from '../components/profile-edit/BirthDateEditModal';
import GenderDisplayEditModal from '../components/profile-edit/GenderDisplayEditModal';
import SexualOrientationEditModal from '../components/profile-edit/SexualOrientationEditModal';
import InterestedInEditModal from '../components/profile-edit/InterestedInEditModal';
import LookingForEditModal from '../components/profile-edit/LookingForEditModal';
import DistancePreferenceEditModal from '../components/profile-edit/DistancePreferenceEditModal';
import InterestsEditModal from '../components/profile-edit/InterestsEditModal';
import PhysicalAttributesEditModal from '../components/profile-edit/PhysicalAttributesEditModal';
import LifestyleEditModal from '../components/profile-edit/LifestyleEditModal';
import PersonalityEditModal from '../components/profile-edit/PersonalityEditModal';
import AdditionalInfoEditModal from '../components/profile-edit/AdditionalInfoEditModal';
import PreferencesEditModal from '../components/profile-edit/PreferencesEditModal';
import LocationEditModal from '../components/profile-edit/LocationEditModal';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile status state
  const [isVerified, setIsVerified] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [verifiedTypes, setVerifiedTypes] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Photo and audio state
  const [photoUploadPreview, setPhotoUploadPreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recordedAudioFile, setRecordedAudioFile] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preview mode state
  const [showPreview, setShowPreview] = useState(false);

  // Modal states for edit modals (removing media and audioIntro)
  const [openModals, setOpenModals] = useState({
    nameAbout: false,
    birthDate: false,
    genderDisplay: false,
    sexualOrientation: false,
    interestedIn: false,
    lookingFor: false,
    location: false,
    distancePreference: false,
    interests: false,
    physicalAttributes: false,
    lifestyle: false,
    personality: false,
    additionalInfo: false,
    preferences: false
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    try {
      const profileResponse = await userService.getProfileWithStatus(user.userID);
      setProfile(profileResponse.profile);
      setIsVerified(profileResponse.isVerified);
      setCompletionPercentage(profileResponse.completionPercentage);
      setVerifiedTypes(profileResponse.verifiedTypes);
      setMissingFields(profileResponse.missingFields);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Modal handlers
  const openModal = (modalName: keyof typeof openModals) => {
    setOpenModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof openModals) => {
    setOpenModals(prev => ({ ...prev, [modalName]: false }));
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Generic update handler for profile data
  const handleUpdateProfile = async (updateData: Partial<UserProfile>) => {
    if (!user || !profile) return;
    try {
      setLoading(true);
      const mergedData = {
        userID: user.userID,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dateOfBirth: profile.dateOfBirth || '1995-01-01',
        bio: profile.bio || '',
        location: profile.location || '',
        city: profile.city,
        region: profile.region,
        country: profile.country,
        interests: profile.interests || [],
        gender: profile.gender || 'other' as 'male' | 'female' | 'other',
        interestedIn: profile.interestedIn || 'both' as 'male' | 'female' | 'both',
        height: profile.height,
        education: profile.education,
        occupation: profile.occupation,
        jobTitle: profile.jobTitle,
        showGender: profile.showGender,
        showAge: profile.showAge,
        showLocation: profile.showLocation,
        ...updateData
      };
      const updatedProfile = await userService.updateProfile(user.userID, mergedData);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Photo handling functions
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0 || !user) return;

    setLoading(true);
    try {
      for (const file of files) {
        const result = await userService.uploadPhoto(user.userID, file);
        console.log('Photo uploaded:', result);
      }
      await loadProfile();
      setSuccess('Photos uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload photos');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoID: number) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userService.deletePhoto(user.userID, photoID);
      await loadProfile();
      setSuccess('Photo deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete photo');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryPhoto = async (photoID: number) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userService.setPrimaryPhoto(user.userID, photoID);
      await loadProfile();
      setSuccess('Primary photo updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to set primary photo');
      console.error('Primary photo error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-intro.wav', { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordedAudioFile(audioFile);
        setAudioPreviewUrl(audioUrl);
        audioChunksRef.current = [];
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveAudioIntro = async () => {
    if (!recordedAudioFile || !user) return;

    setLoading(true);
    try {
      // For now, we'll just simulate saving the audio intro
      // In a real implementation, you'd upload this to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Voice intro saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save voice intro');
      console.error('Save audio error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAudioIntro = () => {
    setRecordedAudioFile(null);
    setAudioPreviewUrl('');
    setIsPlayingAudio(false);
  };

  const toggleAudioPlayback = () => {
    if (!audioRef.current || !audioPreviewUrl) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.src = audioPreviewUrl;
      audioRef.current.play();
      setIsPlayingAudio(true);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  // Profile data sections for clean organization
  const profileSections = [
    {
      id: 'nameAbout',
      title: 'Name & About',
      icon: <PersonIcon />,
      color: '#667eea',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(102, 126, 234, 0.05) 100%)',
      data: profile?.firstName || profile?.bio ? `${profile?.firstName || 'Name not set'}${profile?.bio ? ' • Bio added' : ' • No bio'}` : 'Add your name and tell us about yourself'
    },
    {
      id: 'birthDate',
      title: 'Age',
      icon: <CakeIcon />,
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(16, 185, 129, 0.05) 100%)',
      data: profile?.dateOfBirth ? `${calculateAge(profile.dateOfBirth)} years old` : 'Add your birth date'
    },
    {
      id: 'genderDisplay',
      title: 'Gender Identity',
      icon: <GenderIcon />,
      color: '#f59e0b',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 158, 11, 0.05) 100%)',
      data: profile?.gender || 'Set your gender identity'
    },
    {
      id: 'sexualOrientation',
      title: 'Sexual Orientation',
      icon: <FavoriteIcon />,
      color: '#ef4444',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 68, 68, 0.05) 100%)',
      data: profile?.sexualOrientation || 'Add your sexual orientation'
    },
    {
      id: 'interestedIn',
      title: 'Interested In',
      icon: <InterestedInIcon />,
      color: '#8b5cf6',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(139, 92, 246, 0.05) 100%)',
      data: profile?.interestedIn || 'Who are you interested in?'
    },
    {
      id: 'lookingFor',
      title: 'Looking For',
      icon: <LookingForIcon />,
      color: '#06b6d4',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(6, 182, 212, 0.05) 100%)',
      data: profile?.lookingFor || 'What type of relationship?'
    },
    {
      id: 'location',
      title: 'Living In',
      icon: <LocationIcon />,
      color: '#f97316',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 115, 22, 0.05) 100%)',
      data: profile?.city && profile?.region ? `${profile.city}, ${profile.region}` : profile?.location || 'Add your location'
    },
    {
      id: 'distancePreference',
      title: 'Distance',
      icon: <RadarIcon />,
      color: '#7c3aed',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(124, 58, 237, 0.05) 100%)',
      data: profile?.maxDistance ? `Within ${profile.maxDistance} km` : 'Set distance preference'
    },
    {
      id: 'interests',
      title: 'Interests',
      icon: <FavoriteIcon />,
      color: '#ec4899',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 72, 153, 0.05) 100%)',
      data: profile?.interests?.length ? `${profile.interests.length} interests selected` : 'Add your interests'
    },
    {
      id: 'physicalAttributes',
      title: 'Physical',
      icon: <FitnessCenterIcon />,
      color: '#3b82f6',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(59, 130, 246, 0.05) 100%)',
      data: profile?.height || profile?.bodyType ? 'Physical attributes added' : 'Add physical attributes'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      icon: <LifestyleIcon />,
      color: '#84cc16',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(132, 204, 22, 0.05) 100%)',
      data: profile?.pets || profile?.drinking || profile?.smoking ? 'Lifestyle info added' : 'Add lifestyle preferences'
    },
    {
      id: 'personality',
      title: 'Personality',
      icon: <PsychologyIcon />,
      color: '#a855f7',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(168, 85, 247, 0.05) 100%)',
      data: profile?.communicationStyle || profile?.loveLanguage ? 'Personality traits added' : 'Add personality traits'
    },
    {
      id: 'additionalInfo',
      title: 'Additional Info',
      icon: <PersonIcon />,
      color: '#dc2626',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 38, 38, 0.05) 100%)',
      data: profile?.religion || profile?.politicalViews || profile?.familyPlans || profile?.industry ? 'Additional information added' : 'Add more about yourself'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: <FavoriteIcon />,
      color: '#059669',
      bgColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(5, 150, 105, 0.05) 100%)',
      data: profile?.musicPreferences?.length || profile?.foodPreferences?.length || profile?.entertainmentPreferences?.length ? 'Preferences added' : 'Add your preferences'
    }
  ];

  return (
    <Box sx={{ 
      maxWidth: '1400px', 
      mx: 'auto', 
      p: { xs: 2, sm: 3, md: 4 },
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
        zIndex: 0
      }
    }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: 5,
          fontWeight: 700,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 4px 8px rgba(102, 126, 234, 0.2)',
          position: 'relative',
          zIndex: 1,
          letterSpacing: '-0.5px'
        }}
      >
        ✨ My Profile
      </Typography>

      {/* Preview Control Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={showPreview ? <VisibilityOff /> : <Visibility />}
          onClick={() => setShowPreview(!showPreview)}
          sx={{
            background: showPreview 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: showPreview
              ? '0 8px 20px rgba(239, 68, 68, 0.3)'
              : '0 8px 20px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: showPreview
                ? '0 12px 25px rgba(239, 68, 68, 0.4)'
                : '0 12px 25px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          {showPreview ? 'Hide Preview' : 'View Preview Profile'}
        </Button>
      </Box>

      {/* Main Content Area - Dynamic Layout Based on Preview Mode */}
      <Grid container spacing={4}>
        {/* Left Column - Profile Editing */}
        <Grid item xs={12} lg={showPreview ? 5 : 8}>
          {/* Alerts */}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 4,
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.15)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {success}
            </Alert>
          )}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(244, 67, 54, 0.15)',
                border: '1px solid rgba(244, 67, 54, 0.2)',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {error}
            </Alert>
          )}

      {/* Profile Header Card */}
      <Card sx={{ 
        mb: 5, 
        borderRadius: '20px', 
        overflow: 'visible',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.1), 0 8px 16px rgba(147, 51, 234, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 25px 50px rgba(102, 126, 234, 0.15), 0 12px 24px rgba(147, 51, 234, 0.08)'
        }
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' }, 
            mb: 3,
            gap: { xs: 3, md: 4 }
          }}>
            {/* Avatar with Completion Progress */}
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={completionPercentage}
                size={160}
                thickness={3}
                sx={{
                  color: completionPercentage >= 80 ? '#4caf50' : completionPercentage >= 50 ? '#ff9800' : '#f44336',
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  zIndex: 1,
                  width: { xs: '120px !important', sm: '140px !important', md: '160px !important' },
                  height: { xs: '120px !important', sm: '140px !important', md: '160px !important' },
                }}
              />
              <Avatar
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)',
                  border: '4px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  zIndex: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    right: '-6px',
                    bottom: '-6px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    zIndex: -1,
                    opacity: 0.3
                  }
                }}
              >
                {profile?.firstName?.charAt(0) || 'U'}
              </Avatar>
              
              {/* Completion Percentage Label */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '4px 8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 3,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    color: completionPercentage >= 80 ? '#4caf50' : completionPercentage >= 50 ? '#ff9800' : '#f44336',
                  }}
                >
                  {Math.round(completionPercentage)}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="h3" component="h2" sx={{ 
                  fontWeight: 700, 
                  color: '#2d3748',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  letterSpacing: '-1px'
                }}>
                  {profile?.firstName || 'Your Name'}
                </Typography>
                
                {/* Enhanced Verification Badge */}
                {isVerified && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Verified color="primary" sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                    {verifiedTypes.length > 0 && (
                      <Chip
                        label={`Verified ${verifiedTypes.join(', ')}`}
                        size="medium"
                        variant="outlined"
                        color="primary"
                        sx={{
                          fontWeight: 600,
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>
              
              <Typography variant="h5" sx={{ 
                mt: 2,
                mb: 3, 
                fontWeight: 500, 
                color: '#667eea',
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
              }}>
                {profile?.dateOfBirth ? `${calculateAge(profile.dateOfBirth)} years old` : 'Age not set'}
              </Typography>
              {profile?.city && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <LocationIcon sx={{ mr: 1, color: '#667eea', fontSize: '1.2rem' }} />
                  <Typography color="#5a67d8" variant="h6" sx={{ fontWeight: 500 }}>
                    {profile.city}, {profile.region}
                  </Typography>
                </Box>
              )}
              <Typography variant="body1" sx={{ 
                fontStyle: profile?.bio ? 'normal' : 'italic',
                color: profile?.bio ? '#4a5568' : '#a0aec0',
                lineHeight: 1.6,
                padding: 3,
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                fontSize: '1.1rem',
                fontWeight: 400
              }}>
                {profile?.bio || 'Tell others about yourself...'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Photos Section - Tinder-like display */}
      <Card sx={{ 
        mb: 5, 
        borderRadius: '20px', 
        overflow: 'visible',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
        boxShadow: '0 20px 40px rgba(255, 152, 0, 0.1), 0 8px 16px rgba(255, 152, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 25px 50px rgba(255, 152, 0, 0.15), 0 12px 24px rgba(255, 152, 0, 0.08)'
        }
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#2d3748', 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}>
              <PhotoCamera sx={{ mr: 2, color: '#f59e0b', fontSize: '1.8rem' }} />
              Photos
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              multiple
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<AddPhotoAlternate />}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 25px rgba(245, 158, 11, 0.4)'
                  }
                }}
              >
                Add Photos
              </Button>
            </label>
          </Box>

          <Grid container spacing={3}>
            {(profile?.photos || []).map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photo.photoID}>
                <Paper
                  sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    border: photo.isPrimary ? '3px solid #f59e0b' : '1px solid rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  
                  {/* Delete button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(244, 67, 54, 0.9)',
                      color: 'white',
                      width: 36,
                      height: 36,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 1)',
                        transform: 'scale(1.1)'
                      },
                    }}
                    size="small"
                    onClick={() => handleDeletePhoto(photo.photoID)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                  
                  {/* Main photo indicator or set as main button */}
                  {photo.isPrimary ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        right: 12,
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        textAlign: 'center',
                        py: 1.5,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                        backdropFilter: 'blur(10px)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      MAIN PHOTO
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        right: 12,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1,
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f59e0b',
                          transform: 'translateY(-2px)'
                        },
                      }}
                      onClick={() => handleSetPrimaryPhoto(photo.photoID)}
                    >
                      Set as Main
                    </Button>
                  )}
                </Paper>
              </Grid>
            ))}
            
            {/* Show empty state if no photos */}
            {(!profile?.photos || profile.photos.length === 0) && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    color: '#6b7280',
                    background: 'rgba(245, 158, 11, 0.05)',
                    borderRadius: '16px',
                    border: '2px dashed rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderColor: 'rgba(245, 158, 11, 0.4)'
                    }
                  }}
                >
                  <PhotoCamera sx={{ fontSize: '4rem', mb: 2, color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    No photos yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    Add some photos to make your profile stand out!
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Voice Intro Section */}
      <Card sx={{ 
        mb: 5, 
        borderRadius: '20px', 
        overflow: 'visible',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
        boxShadow: '0 20px 40px rgba(156, 39, 176, 0.1), 0 8px 16px rgba(156, 39, 176, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 25px 50px rgba(156, 39, 176, 0.15), 0 12px 24px rgba(156, 39, 176, 0.08)'
        }
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#2d3748', 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}>
              <MicIcon sx={{ mr: 2, color: '#8b5cf6', fontSize: '1.8rem' }} />
              Voice Introduction
            </Typography>
          </Box>

          {/* Current audio intro */}
          {profile?.audioIntroUrl && (
            <Box sx={{ 
              mb: 4,
              p: 4,
              backgroundColor: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                borderColor: 'rgba(139, 92, 246, 0.3)'
              }
            }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2d3748' }}>Current Voice Intro</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={isPlayingAudio ? <Stop /> : <PlayArrow />}
                  onClick={toggleAudioPlayback}
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 25px rgba(139, 92, 246, 0.4)'
                    }
                  }}
                >
                  {isPlayingAudio ? 'Stop' : 'Play'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={deleteAudioIntro}
                  sx={{
                    color: '#ef4444',
                    borderColor: '#ef4444',
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#ef4444',
                      color: 'white',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
              <audio ref={audioRef} style={{ display: 'none' }} />
            </Box>
          )}

          {/* Recording interface */}
          <Box sx={{ 
            p: 4,
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            borderRadius: '16px',
            border: '2px dashed rgba(139, 92, 246, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              borderColor: 'rgba(139, 92, 246, 0.4)'
            }
          }}>
            {!audioPreviewUrl ? (
              <>
                <MicIcon sx={{ fontSize: '4rem', color: '#8b5cf6', mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2d3748' }}>
                  {isRecording ? 'Recording...' : 'Record Voice Intro'}
                </Typography>
                <Typography variant="body2" color="#6b7280" sx={{ mb: 4, fontSize: '1rem' }}>
                  Record a short introduction (max 30 seconds) to let potential matches hear your voice
                </Typography>
                <Button
                  variant="contained"
                  onClick={isRecording ? stopRecording : startRecording}
                  startIcon={isRecording ? <Stop /> : <MicIcon />}
                  disabled={loading}
                  sx={{
                    background: isRecording 
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    px: 4,
                    py: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: isRecording
                      ? '0 8px 20px rgba(239, 68, 68, 0.3)'
                      : '0 8px 20px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isRecording
                        ? '0 12px 25px rgba(239, 68, 68, 0.4)'
                        : '0 12px 25px rgba(139, 92, 246, 0.4)'
                    }
                  }}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2d3748' }}>Audio Ready!</Typography>
                <Typography variant="body2" color="#6b7280" sx={{ mb: 4, fontSize: '1rem' }}>
                  Click play to preview or save your voice intro
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={isPlayingAudio ? <Stop /> : <PlayArrow />}
                    onClick={toggleAudioPlayback}
                    sx={{
                      borderColor: '#8b5cf6',
                      color: '#8b5cf6',
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {isPlayingAudio ? 'Stop' : 'Preview'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={saveAudioIntro}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(139, 92, 246, 0.4)'
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={deleteAudioIntro}
                    sx={{
                      color: '#ef4444',
                      borderColor: '#ef4444',
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#ef4444',
                        color: 'white',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
                <audio ref={audioRef} style={{ display: 'none' }} />
              </>
            )}
          </Box>
        </CardContent>
      </Card>

          {/* Profile Sections Grid */}
          <Grid container spacing={4}>
            {profileSections.map((section) => (
              <Grid item xs={12} sm={6} lg={6} key={section.id}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: '20px',
                  background: section.bgColor,
                  boxShadow: `0 10px 30px ${section.color}08`,
                  border: `1px solid ${section.color}15`,
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${section.color}, ${section.color}80)`,
                    zIndex: 1
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${section.color}15`,
                    '& .edit-button': {
                      transform: 'scale(1.1)',
                      backgroundColor: `${section.color}20`
                    }
                  }
                }}>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          color: section.color, 
                          mr: 2, 
                          fontSize: '1.8rem',
                          p: 1,
                          borderRadius: '12px',
                          backgroundColor: `${section.color}10`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {section.icon}
                        </Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: '#2d3748',
                          fontSize: '1.1rem'
                        }}>
                          {section.title}
                        </Typography>
                      </Box>
                      <IconButton 
                        className="edit-button"
                        onClick={() => openModal(section.id as keyof typeof openModals)}
                        sx={{ 
                          color: section.color,
                          backgroundColor: `${section.color}10`,
                          width: 44,
                          height: 44,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: `${section.color}20`,
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <EditIcon sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1rem',
                      lineHeight: 1.5,
                      color: '#4a5568',
                      fontWeight: 400
                    }}>
                      {section.data}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Center Column - Main Profile Preview (only shown when preview mode is active) */}
        {showPreview && (
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  color: '#2d3748',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Full Profile Preview
              </Typography>
              {profile && (
                <MiniProfile
                  user={{
                    userID: profile.userID || 0,
                    firstName: profile.firstName,
                    username: profile.firstName || 'User',
                    age: profile.dateOfBirth ? 
                      new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 
                      undefined,
                    bio: profile.bio,
                    location: profile.location,
                    occupation: profile.occupation,
                    education: profile.education,
                    interests: profile.interests || [],
                    verified: true,
                    photos: profile.photos || [],
                    height: profile.height,
                    gender: profile.gender,
                    audioIntroUrl: profile.audioIntroUrl,
                    weight: profile.weight,
                    bodyType: profile.bodyType,
                    ethnicity: profile.ethnicity,
                    pets: profile.pets,
                    drinking: profile.drinking,
                    smoking: profile.smoking,
                    workout: profile.workout,
                    relationshipGoal: profile.relationshipGoal,
                    sexualOrientation: profile.sexualOrientation,
                    lookingFor: profile.lookingFor,
                  }}
                  showPhoto={true}
                  variant="preview"
                  maxHeight="calc(100vh - 160px)"
                />
              )}
            </Box>
          </Grid>
        )}

        {/* Right Column - Mini Profile Preview */}
        <Grid item xs={12} lg={showPreview ? 3 : 4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                color: '#2d3748',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
              }}
            >
              {showPreview ? 'Mini Preview' : 'Profile Preview'}
            </Typography>
            {profile && (
              <MiniProfile
                user={{
                  userID: profile.userID || 0,
                  firstName: profile.firstName,
                  username: profile.firstName || 'User',
                  age: profile.dateOfBirth ? 
                    new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 
                    undefined,
                  bio: profile.bio,
                  location: profile.location,
                  occupation: profile.occupation,
                  education: profile.education,
                  interests: profile.interests || [],
                  verified: true,
                  photos: profile.photos || [],
                  height: profile.height,
                  gender: profile.gender,
                  audioIntroUrl: profile.audioIntroUrl,
                  weight: profile.weight,
                  bodyType: profile.bodyType,
                  ethnicity: profile.ethnicity,
                  pets: profile.pets,
                  drinking: profile.drinking,
                  smoking: profile.smoking,
                  workout: profile.workout,
                  relationshipGoal: profile.relationshipGoal,
                  sexualOrientation: profile.sexualOrientation,
                  lookingFor: profile.lookingFor,
                }}
                showPhoto={true}
                variant={showPreview ? "compact" : "preview"}
                maxHeight="calc(100vh - 160px)"
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Profile Sections Grid - End of Left Column */}

      {/* All Twelve Edit Modals */}
      <NameAboutEditModal
        open={openModals.nameAbout}
        onClose={() => closeModal('nameAbout')}
        currentData={{
          firstName: profile?.firstName || '',
          bio: profile?.bio || ''
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <BirthDateEditModal
        open={openModals.birthDate}
        onClose={() => closeModal('birthDate')}
        currentData={{
          dateOfBirth: profile?.dateOfBirth || ''
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <GenderDisplayEditModal
        open={openModals.genderDisplay}
        onClose={() => closeModal('genderDisplay')}
        currentData={{
          gender: profile?.gender || 'other',
          showGender: profile?.showGender || false
        }}
        onSave={(data) => handleUpdateProfile({ 
          gender: data.gender as 'male' | 'female' | 'other',
          showGender: data.showGender 
        })}
      />

      <SexualOrientationEditModal
        open={openModals.sexualOrientation}
        onClose={() => closeModal('sexualOrientation')}
        currentData={{
          sexualOrientation: profile?.sexualOrientation || '',
          showOrientation: profile?.showOrientation || false
        }}
        onSave={(data: any) => handleUpdateProfile(data)}
      />

      <InterestedInEditModal
        open={openModals.interestedIn}
        onClose={() => closeModal('interestedIn')}
        currentData={{
          interestedIn: profile?.interestedIn || 'both'
        }}
        onSave={(data: any) => handleUpdateProfile(data)}
      />

      <LookingForEditModal
        open={openModals.lookingFor}
        onClose={() => closeModal('lookingFor')}
        currentData={{
          lookingFor: profile?.lookingFor || ''
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <LocationEditModal
        open={openModals.location}
        onClose={() => closeModal('location')}
        currentData={{
          location: profile?.location || '',
          city: profile?.city || '',
          region: profile?.region || '',
          country: profile?.country || ''
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <DistancePreferenceEditModal
        open={openModals.distancePreference}
        onClose={() => closeModal('distancePreference')}
        currentData={{
          maxDistance: profile?.maxDistance || 50
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <InterestsEditModal
        open={openModals.interests}
        onClose={() => closeModal('interests')}
        currentInterests={profile?.interests || []}
        onSave={(interests) => handleUpdateProfile({ interests })}
      />

      <PhysicalAttributesEditModal
        open={openModals.physicalAttributes}
        onClose={() => closeModal('physicalAttributes')}
        currentData={{
          height: profile?.height,
          weight: profile?.weight,
          bodyType: profile?.bodyType,
          ethnicity: profile?.ethnicity
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <LifestyleEditModal
        open={openModals.lifestyle}
        onClose={() => closeModal('lifestyle')}
        currentData={{
          pets: profile?.pets,
          drinking: profile?.drinking,
          smoking: profile?.smoking,
          workout: profile?.workout,
          dietaryPreference: profile?.dietaryPreference,
          socialMedia: profile?.socialMedia,
          sleepingHabits: profile?.sleepingHabits,
          languages: profile?.languages
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <PersonalityEditModal
        open={openModals.personality}
        onClose={() => closeModal('personality')}
        currentData={{
          communicationStyle: profile?.communicationStyle,
          loveLanguage: profile?.loveLanguage,
          zodiacSign: profile?.zodiacSign
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <AdditionalInfoEditModal
        open={openModals.additionalInfo}
        onClose={() => closeModal('additionalInfo')}
        currentData={{
          religion: profile?.religion,
          politicalViews: profile?.politicalViews,
          familyPlans: profile?.familyPlans,
          fitnessLevel: profile?.fitnessLevel,
          travelFrequency: profile?.travelFrequency,
          industry: profile?.industry
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />

      <PreferencesEditModal
        open={openModals.preferences}
        onClose={() => closeModal('preferences')}
        currentData={{
          musicPreferences: profile?.musicPreferences,
          foodPreferences: profile?.foodPreferences,
          entertainmentPreferences: profile?.entertainmentPreferences,
          currentlyReading: profile?.currentlyReading,
          lifeGoals: profile?.lifeGoals,
          petPreferences: profile?.petPreferences
        }}
        onSave={(data) => handleUpdateProfile(data)}
      />
    </Box>
  );
}

export default Profile;