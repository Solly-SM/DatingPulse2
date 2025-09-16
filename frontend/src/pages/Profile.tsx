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
  Chip
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
  PhotoCamera,
  Close,
  Delete,
  PlayArrow,
  Stop,
  AddPhotoAlternate
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile } from '../types/User';

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

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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

  // Modal states for edit modals (removing media and audioIntro)
  const [openModals, setOpenModals] = useState({
    nameAbout: false,
    birthDate: false,
    genderDisplay: false,
    sexualOrientation: false,
    interestedIn: false,
    lookingFor: false,
    distancePreference: false,
    interests: false,
    physicalAttributes: false,
    lifestyle: false,
    personality: false
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    try {
      const profileData = await userService.getProfile(user.userID);
      setProfile(profileData);
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
      color: '#e91e63',
      bgColor: 'linear-gradient(135deg, #fff 0%, #fef7f0 100%)',
      data: profile?.firstName || profile?.bio ? `${profile?.firstName || 'Name not set'}${profile?.bio ? ' • Bio added' : ' • No bio'}` : 'Add your name and tell us about yourself'
    },
    {
      id: 'birthDate',
      title: 'Age',
      icon: <CakeIcon />,
      color: '#2196f3',
      bgColor: 'linear-gradient(135deg, #fff 0%, #f0f8ff 100%)',
      data: profile?.dateOfBirth ? `${calculateAge(profile.dateOfBirth)} years old` : 'Add your birth date'
    },
    {
      id: 'genderDisplay',
      title: 'Gender Identity',
      icon: <GenderIcon />,
      color: '#ff9800',
      bgColor: 'linear-gradient(135deg, #fff 0%, #fff3e0 100%)',
      data: profile?.gender || 'Set your gender identity'
    },
    {
      id: 'sexualOrientation',
      title: 'Sexual Orientation',
      icon: <FavoriteIcon />,
      color: '#e91e63',
      bgColor: 'linear-gradient(135deg, #fff 0%, #fef7f0 100%)',
      data: profile?.sexualOrientation || 'Add your sexual orientation'
    },
    {
      id: 'interestedIn',
      title: 'Interested In',
      icon: <InterestedInIcon />,
      color: '#9c27b0',
      bgColor: 'linear-gradient(135deg, #fff 0%, #faf0ff 100%)',
      data: profile?.interestedIn || 'Who are you interested in?'
    },
    {
      id: 'lookingFor',
      title: 'Looking For',
      icon: <LookingForIcon />,
      color: '#4caf50',
      bgColor: 'linear-gradient(135deg, #fff 0%, #f0fff4 100%)',
      data: profile?.lookingFor || 'What type of relationship?'
    },
    {
      id: 'distancePreference',
      title: 'Distance',
      icon: <LocationIcon />,
      color: '#ff5722',
      bgColor: 'linear-gradient(135deg, #fff 0%, #fff3e0 100%)',
      data: profile?.maxDistance ? `Within ${profile.maxDistance} km` : 'Set distance preference'
    },
    {
      id: 'interests',
      title: 'Interests',
      icon: <FavoriteIcon />,
      color: '#e91e63',
      bgColor: 'linear-gradient(135deg, #fff 0%, #fef7f0 100%)',
      data: profile?.interests?.length ? `${profile.interests.length} interests selected` : 'Add your interests'
    },
    {
      id: 'physicalAttributes',
      title: 'Physical',
      icon: <FitnessCenterIcon />,
      color: '#2196f3',
      bgColor: 'linear-gradient(135deg, #fff 0%, #f0f8ff 100%)',
      data: profile?.height || profile?.bodyType ? 'Physical attributes added' : 'Add physical attributes'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      icon: <LifestyleIcon />,
      color: '#4caf50',
      bgColor: 'linear-gradient(135deg, #fff 0%, #f0fff4 100%)',
      data: profile?.pets || profile?.drinking || profile?.smoking ? 'Lifestyle info added' : 'Add lifestyle preferences'
    },
    {
      id: 'personality',
      title: 'Personality',
      icon: <PsychologyIcon />,
      color: '#9c27b0',
      bgColor: 'linear-gradient(135deg, #fff 0%, #faf0ff 100%)',
      data: profile?.communicationStyle || profile?.loveLanguage ? 'Personality traits added' : 'Add personality traits'
    }
  ];

  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      mx: 'auto', 
      p: 3,
      background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)',
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: 4,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 2px 4px rgba(233, 30, 99, 0.1)'
        }}
      >
        ✨ My Profile
      </Typography>

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
          }}
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
          }}
        >
          {error}
        </Alert>
      )}

      {/* Profile Header Card */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: 4, 
        overflow: 'visible',
        background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
        boxShadow: '0 8px 32px rgba(233, 30, 99, 0.12)',
        border: '1px solid rgba(233, 30, 99, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mr: 4,
                fontSize: '2.5rem',
                background: 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
                boxShadow: '0 8px 24px rgba(233, 30, 99, 0.3)',
                border: '4px solid white'
              }}
            >
              {profile?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                {profile?.firstName || 'Your Name'}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                {profile?.dateOfBirth ? `${calculateAge(profile.dateOfBirth)} years old` : 'Age not set'}
              </Typography>
              {profile?.city && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography color="text.secondary" variant="h6">
                    {profile.city}, {profile.region}
                  </Typography>
                </Box>
              )}
              <Typography variant="body1" sx={{ 
                fontStyle: profile?.bio ? 'normal' : 'italic',
                color: profile?.bio ? 'text.primary' : 'text.secondary',
                lineHeight: 1.6,
                padding: 2,
                backgroundColor: 'rgba(233, 30, 99, 0.03)',
                borderRadius: 2,
                border: '1px solid rgba(233, 30, 99, 0.1)'
              }}>
                {profile?.bio || 'Tell others about yourself...'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Photos Section - Tinder-like display */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: 4, 
        overflow: 'visible',
        background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
        boxShadow: '0 8px 32px rgba(255, 152, 0, 0.12)',
        border: '1px solid rgba(255, 152, 0, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', display: 'flex', alignItems: 'center' }}>
              <PhotoCamera sx={{ mr: 2, color: '#ff9800' }} />
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
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                  }
                }}
              >
                Add Photos
              </Button>
            </label>
          </Box>

          <Grid container spacing={2}>
            {(profile?.photos || []).map((photo, index) => (
              <Grid item xs={6} sm={4} md={3} key={photo.photoID}>
                <Paper
                  sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    border: photo.isPrimary ? '3px solid #ff9800' : '1px solid #e0e0e0',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
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
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(244, 67, 54, 0.8)',
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.9)',
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
                        bottom: 8,
                        left: 8,
                        right: 8,
                        backgroundColor: '#ff9800',
                        color: 'white',
                        textAlign: 'center',
                        py: 1,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: '0px 2px 8px rgba(255, 152, 0, 0.4)',
                      }}
                    >
                      MAIN PHOTO
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        py: 0.5,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#ff9800',
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
                    color: 'text.secondary',
                    background: 'rgba(255, 152, 0, 0.05)',
                    borderRadius: 3,
                    border: '2px dashed rgba(255, 152, 0, 0.3)',
                  }}
                >
                  <PhotoCamera sx={{ fontSize: '4rem', mb: 2, color: '#ff9800' }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No photos yet
                  </Typography>
                  <Typography variant="body2">
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
        mb: 4, 
        borderRadius: 4, 
        overflow: 'visible',
        background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
        boxShadow: '0 8px 32px rgba(156, 39, 176, 0.12)',
        border: '1px solid rgba(156, 39, 176, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', display: 'flex', alignItems: 'center' }}>
              <MicIcon sx={{ mr: 2, color: '#9c27b0' }} />
              Voice Introduction
            </Typography>
          </Box>

          {/* Current audio intro */}
          {profile?.audioIntroUrl && (
            <Box sx={{ 
              mb: 3,
              p: 3,
              backgroundColor: 'rgba(156, 39, 176, 0.05)',
              borderRadius: 3,
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Current Voice Intro</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={isPlayingAudio ? <Stop /> : <PlayArrow />}
                  onClick={toggleAudioPlayback}
                  sx={{
                    background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                  }}
                >
                  {isPlayingAudio ? 'Stop' : 'Play'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={deleteAudioIntro}
                  color="error"
                >
                  Delete
                </Button>
              </Box>
              <audio ref={audioRef} style={{ display: 'none' }} />
            </Box>
          )}

          {/* Recording interface */}
          <Box sx={{ 
            p: 3,
            backgroundColor: 'rgba(156, 39, 176, 0.05)',
            borderRadius: 3,
            border: '2px dashed rgba(156, 39, 176, 0.3)',
            textAlign: 'center'
          }}>
            {!audioPreviewUrl ? (
              <>
                <MicIcon sx={{ fontSize: '4rem', color: '#9c27b0', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {isRecording ? 'Recording...' : 'Record Voice Intro'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Record a short introduction (max 30 seconds) to let potential matches hear your voice
                </Typography>
                <Button
                  variant="contained"
                  onClick={isRecording ? stopRecording : startRecording}
                  startIcon={isRecording ? <Stop /> : <MicIcon />}
                  disabled={loading}
                  sx={{
                    background: isRecording 
                      ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                      : 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>Audio Ready!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Click play to preview or save your voice intro
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={isPlayingAudio ? <Stop /> : <PlayArrow />}
                    onClick={toggleAudioPlayback}
                  >
                    {isPlayingAudio ? 'Stop' : 'Preview'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={saveAudioIntro}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={deleteAudioIntro}
                    color="error"
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
      <Grid container spacing={3}>
        {profileSections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.id}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 4,
              background: section.bgColor,
              boxShadow: `0 6px 20px ${section.color}08`,
              border: `1px solid ${section.color}10`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${section.color}15`
              }
            }}>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: section.color, mr: 2, fontSize: '1.5rem' }}>
                      {section.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {section.title}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={() => openModal(section.id as keyof typeof openModals)}
                    sx={{ 
                      color: section.color,
                      backgroundColor: `${section.color}10`,
                      '&:hover': {
                        backgroundColor: `${section.color}20`,
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  lineHeight: 1.4
                }}>
                  {section.data}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
    </Box>
  );
}

export default Profile;