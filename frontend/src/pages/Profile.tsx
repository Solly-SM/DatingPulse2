import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Alert,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
  Chip,
} from '@mui/material';
import { 
  PhotoCamera, 
  Delete, 
  Star, 
  StarBorder,
  Edit,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile, Photo } from '../types/User';
import PersonalDetailsEditModal from '../components/profile-edit/PersonalDetailsEditModal';
import InterestsEditModal from '../components/profile-edit/InterestsEditModal';
import PhysicalAttributesEditModal from '../components/profile-edit/PhysicalAttributesEditModal';
import LifestyleEditModal from '../components/profile-edit/LifestyleEditModal';
import ProfessionalEditModal from '../components/profile-edit/ProfessionalEditModal';
import {
  SexualOrientationModal,
  LookingForModal,
  DistancePreferenceModal,
  PersonalityModal,
  AudioIntroModal,
} from '../components/profile-edit/modals';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal states
  const [personalDetailsModalOpen, setPersonalDetailsModalOpen] = useState(false);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [physicalAttributesModalOpen, setPhysicalAttributesModalOpen] = useState(false);
  const [lifestyleModalOpen, setLifestyleModalOpen] = useState(false);
  const [professionalModalOpen, setProfessionalModalOpen] = useState(false);
  const [sexualOrientationModalOpen, setSexualOrientationModalOpen] = useState(false);
  const [lookingForModalOpen, setLookingForModalOpen] = useState(false);
  const [distancePreferenceModalOpen, setDistancePreferenceModalOpen] = useState(false);
  const [personalityModalOpen, setPersonalityModalOpen] = useState(false);
  const [audioIntroModalOpen, setAudioIntroModalOpen] = useState(false);

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

  // Save functions for modals
  const savePersonalDetails = async (data: { firstName: string; lastName: string; dateOfBirth: string; gender: string; location: string; }) => {
    if (!user || !profile) return;
    
    const updateData = {
      userID: user.userID,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      bio: profile.bio || '',
      location: data.location,
      city: profile.city,
      region: profile.region,
      country: profile.country,
      interests: profile.interests || [],
      gender: data.gender as 'male' | 'female' | 'other',
      interestedIn: profile.interestedIn || 'both' as 'male' | 'female' | 'both',
      height: profile.height,
      education: profile.education,
      occupation: profile.occupation,
      jobTitle: profile.jobTitle,
      showGender: profile.showGender,
      showAge: profile.showAge,
      showLocation: profile.showLocation,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Personal details updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveInterests = async (interests: string[]) => {
    if (!user || !profile) return;
    
    const updateData = {
      userID: user.userID,
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      dateOfBirth: profile.dateOfBirth || '1995-01-01',
      bio: profile.bio || '',
      location: profile.location || '',
      city: profile.city,
      region: profile.region,
      country: profile.country,
      interests: interests,
      gender: profile.gender || 'other' as 'male' | 'female' | 'other',
      interestedIn: profile.interestedIn || 'both' as 'male' | 'female' | 'both',
      height: profile.height,
      education: profile.education,
      occupation: profile.occupation,
      jobTitle: profile.jobTitle,
      showGender: profile.showGender,
      showAge: profile.showAge,
      showLocation: profile.showLocation,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Interests updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const savePhysicalAttributes = async (data: { height?: number; weight?: number; bodyType?: string; ethnicity?: string; }) => {
    if (!user || !profile) return;
    
    const updateData = {
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
      height: data.height,
      education: profile.education,
      occupation: profile.occupation,
      jobTitle: profile.jobTitle,
      showGender: profile.showGender,
      showAge: profile.showAge,
      showLocation: profile.showLocation,
      weight: data.weight,
      bodyType: data.bodyType,
      ethnicity: data.ethnicity,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Physical attributes updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveLifestyle = async (data: { pets?: string; drinking?: string; smoking?: string; workout?: string; dietaryPreference?: string; socialMedia?: string; sleepingHabits?: string; languages?: string[]; }) => {
    if (!user || !profile) return;
    
    const updateData = {
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
      pets: data.pets,
      drinking: data.drinking,
      smoking: data.smoking,
      workout: data.workout,
      dietaryPreference: data.dietaryPreference,
      socialMedia: data.socialMedia,
      sleepingHabits: data.sleepingHabits,
      languages: data.languages,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Lifestyle preferences updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveProfessional = async (data: { education?: string; occupation?: string; jobTitle?: string; }) => {
    if (!user || !profile) return;
    
    const updateData = {
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
      education: data.education,
      occupation: data.occupation,
      jobTitle: data.jobTitle,
      showGender: profile.showGender,
      showAge: profile.showAge,
      showLocation: profile.showLocation,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Professional information updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveSexualOrientation = async (data: { sexualOrientation?: string; showOrientation?: boolean; }) => {
    if (!user || !profile) return;
    
    const updateData = {
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
      sexualOrientation: data.sexualOrientation,
      showOrientation: data.showOrientation,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Sexual orientation updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveLookingFor = async (data: { lookingFor?: string; }) => {
    if (!user || !profile) return;
    
    const updateData = {
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
      lookingFor: data.lookingFor,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Looking for preference updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveDistancePreference = async (data: { maxDistance?: number; }) => {
    if (!user || !profile) return;
    
    const updateData = {
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
      maxDistance: data.maxDistance,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Distance preference updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const savePersonality = async (data: { communicationStyle?: string; loveLanguage?: string; zodiacSign?: string; }) => {
    if (!user || !profile) return;
    
    const updateData = {
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
      communicationStyle: data.communicationStyle,
      loveLanguage: data.loveLanguage,
      zodiacSign: data.zodiacSign,
    };
    
    const updatedProfile = await userService.updateProfile(user.userID, updateData);
    setProfile(updatedProfile);
    setSuccess('Personality traits updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveAudioIntro = async (data: { audioIntro?: File | null; removeAudio?: boolean; }) => {
    if (!user || !profile) return;
    
    try {
      if (data.removeAudio) {
        // Remove audio intro
        // TODO: Implement audio deletion in userService
        setSuccess('Audio introduction removed successfully!');
      } else if (data.audioIntro) {
        // Upload new audio intro
        // TODO: Implement audio upload in userService
        setSuccess('Audio introduction updated successfully!');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update audio introduction');
      console.error('Audio intro error:', err);
    }
  };



  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const { url, photoID } = await userService.uploadPhoto(user.userID, file);
      
      // Add the new photo to the profile
      if (profile) {
        const newPhoto: Photo = {
          photoID,
          userID: user.userID,
          url,
          isPrimary: !profile.photos || profile.photos.length === 0,
          uploadedAt: new Date().toISOString(),
        };
        
        setProfile(prev => ({
          ...prev!,
          photos: [...(prev?.photos || []), newPhoto],
        }));
        
        setSuccess('Photo uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to upload photo');
      console.error('Photo upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoID: number) => {
    if (!user) return;

    try {
      await userService.deletePhoto(user.userID, photoID);
      setProfile(prev => ({
        ...prev!,
        photos: prev?.photos?.filter(p => p.photoID !== photoID) || [],
      }));
      setSuccess('Photo deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete photo');
      console.error('Photo deletion error:', err);
    }
  };

  const handleSetPrimaryPhoto = async (photoID: number) => {
    if (!user) return;

    try {
      await userService.setPrimaryPhoto(user.userID, photoID);
      setProfile(prev => ({
        ...prev!,
        photos: prev?.photos?.map(p => ({
          ...p,
          isPrimary: p.photoID === photoID,
        })) || [],
      }));
      setSuccess('Primary photo updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update primary photo');
      console.error('Primary photo error:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Photo Gallery Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhotoCamera />
              Photos
            </Typography>
            
            <Grid container spacing={2}>
              {profile?.photos?.map((photo) => (
                <Grid item xs={6} sm={4} md={3} key={photo.photoID}>
                  <Card sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={photo.url}
                      alt="Profile photo"
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleSetPrimaryPhoto(photo.photoID)}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                        }}
                      >
                        {photo.isPrimary ? <Star color="primary" /> : <StarBorder />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePhoto(photo.photoID)}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                    {photo.isPrimary && (
                      <Chip
                        label="Primary"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                        }}
                      />
                    )}
                  </Card>
                </Grid>
              ))}
              
              {/* Add Photo Button */}
              <Grid item xs={6} sm={4} md={3}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
                <label htmlFor="photo-upload">
                  <Card
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: uploading ? 'default' : 'pointer',
                      border: '2px dashed',
                      borderColor: 'grey.400',
                      '&:hover': uploading ? {} : { borderColor: 'primary.main' },
                      opacity: uploading ? 0.7 : 1,
                    }}
                  >
                    <Box textAlign="center">
                      {uploading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          <PhotoCamera sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Add Photo
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Card>
                </label>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Information with Modal Editing */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                👤 Profile Information
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPersonalDetailsModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {/* Basic Information - Read Only Display */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    First Name
                  </Typography>
                  <Typography variant="body1">
                    {profile?.firstName || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Name
                  </Typography>
                  <Typography variant="body1">
                    {profile?.lastName || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              
              {/* Age and Date of Birth - Read only */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Age
                  </Typography>
                  <Typography variant="body1">
                    {profile?.age || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {profile?.dateOfBirth || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>

              {/* Location and Gender */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {profile?.location || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {profile?.gender || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Interested In
                  </Typography>
                  <Typography variant="body1">
                    {profile?.interestedIn || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>

              {/* Bio - Could be separate modal or included in personal details */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Bio
                  </Typography>
                  <Typography variant="body1">
                    {profile?.bio || 'Tell others about yourself...'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Interests Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                🎯 Interests
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setInterestsModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile?.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <Chip key={index} label={interest} color="primary" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No interests specified
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Physical Attributes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                💪 Physical Attributes
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPhysicalAttributesModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    📏 Height
                  </Typography>
                  <Typography variant="body1">
                    {profile?.height ? `${profile.height} cm` : 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ⚖️ Weight
                  </Typography>
                  <Typography variant="body1">
                    {profile?.weight ? `${profile.weight} kg` : 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🏃‍♂️ Body Type
                  </Typography>
                  <Typography variant="body1">
                    {profile?.bodyType || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🌍 Ethnicity
                  </Typography>
                  <Typography variant="body1">
                    {profile?.ethnicity || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Professional Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                💼 Professional Information
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setProfessionalModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🎓 Education
                  </Typography>
                  <Typography variant="body1">
                    {profile?.education || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    💼 Occupation
                  </Typography>
                  <Typography variant="body1">
                    {profile?.occupation || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🏷️ Job Title
                  </Typography>
                  <Typography variant="body1">
                    {profile?.jobTitle || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lifestyle & Preferences */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                🌟 Lifestyle & Preferences
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setLifestyleModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🐾 Pets
                  </Typography>
                  <Typography variant="body1">
                    {profile?.pets || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🍷 Drinking
                  </Typography>
                  <Typography variant="body1">
                    {profile?.drinking || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🚬 Smoking
                  </Typography>
                  <Typography variant="body1">
                    {profile?.smoking || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    💪 Workout
                  </Typography>
                  <Typography variant="body1">
                    {profile?.workout || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🥗 Diet
                  </Typography>
                  <Typography variant="body1">
                    {profile?.dietaryPreference || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    📱 Social Media
                  </Typography>
                  <Typography variant="body1">
                    {profile?.socialMedia || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    😴 Sleep Schedule
                  </Typography>
                  <Typography variant="body1">
                    {profile?.sleepingHabits || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🗣️ Languages
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile?.languages && profile.languages.length > 0 ? (
                      profile.languages.map((language, index) => (
                        <Chip key={index} label={language} size="small" variant="outlined" />
                      ))
                    ) : (
                      <Typography variant="body1">Not specified</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sexual Orientation Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                🏳️‍🌈 Sexual Orientation
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setSexualOrientationModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🌈 Orientation
                  </Typography>
                  <Typography variant="body1">
                    {profile?.sexualOrientation || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    👁️ Show on Profile
                  </Typography>
                  <Typography variant="body1">
                    {profile?.showOrientation ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Looking For Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                💫 Looking For
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setLookingForModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                💕 Relationship Goal
              </Typography>
              <Typography variant="body1">
                {profile?.lookingFor ? profile.lookingFor.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Distance Preference Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                📍 Distance Preference
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setDistancePreferenceModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                🚗 Maximum Distance
              </Typography>
              <Typography variant="body1">
                {profile?.maxDistance ? 
                  (profile.maxDistance >= 100 ? 'Anywhere' : `${profile.maxDistance} km`) : 
                  'Not specified'
                }
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Personality Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                ✨ Personality & Traits
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPersonalityModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    💬 Communication Style
                  </Typography>
                  <Typography variant="body1">
                    {profile?.communicationStyle || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    💖 Love Language
                  </Typography>
                  <Typography variant="body1">
                    {profile?.loveLanguage || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ⭐ Zodiac Sign
                  </Typography>
                  <Typography variant="body1">
                    {profile?.zodiacSign || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Audio Introduction Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                🎤 Audio Introduction
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setAudioIntroModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            
            <Box>
              {profile?.audioIntroUrl ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    🔊 Your Voice Introduction
                  </Typography>
                  <audio controls src={profile.audioIntroUrl} style={{ width: '100%', marginTop: '8px' }} />
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No audio introduction recorded yet. Add one to let potential matches hear your voice!
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Modals */}
      <PersonalDetailsEditModal
        open={personalDetailsModalOpen}
        onClose={() => setPersonalDetailsModalOpen(false)}
        currentData={{
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
          dateOfBirth: profile?.dateOfBirth || '',
          gender: profile?.gender || '',
          location: profile?.location || '',
        }}
        onSave={savePersonalDetails}
      />

      <InterestsEditModal
        open={interestsModalOpen}
        onClose={() => setInterestsModalOpen(false)}
        currentInterests={profile?.interests || []}
        onSave={saveInterests}
      />

      <PhysicalAttributesEditModal
        open={physicalAttributesModalOpen}
        onClose={() => setPhysicalAttributesModalOpen(false)}
        currentData={{
          height: profile?.height,
          weight: profile?.weight,
          bodyType: profile?.bodyType,
          ethnicity: profile?.ethnicity,
        }}
        onSave={savePhysicalAttributes}
      />

      <ProfessionalEditModal
        open={professionalModalOpen}
        onClose={() => setProfessionalModalOpen(false)}
        currentData={{
          education: profile?.education,
          occupation: profile?.occupation,
          jobTitle: profile?.jobTitle,
        }}
        onSave={saveProfessional}
      />

      <LifestyleEditModal
        open={lifestyleModalOpen}
        onClose={() => setLifestyleModalOpen(false)}
        currentData={{
          pets: profile?.pets,
          drinking: profile?.drinking,
          smoking: profile?.smoking,
          workout: profile?.workout,
          dietaryPreference: profile?.dietaryPreference,
          socialMedia: profile?.socialMedia,
          sleepingHabits: profile?.sleepingHabits,
          languages: profile?.languages,
        }}
        onSave={saveLifestyle}
      />

      <SexualOrientationModal
        open={sexualOrientationModalOpen}
        onClose={() => setSexualOrientationModalOpen(false)}
        currentData={{
          sexualOrientation: profile?.sexualOrientation,
          showOrientation: profile?.showOrientation,
        }}
        onSave={saveSexualOrientation}
        loading={loading}
      />

      <LookingForModal
        open={lookingForModalOpen}
        onClose={() => setLookingForModalOpen(false)}
        currentData={{
          lookingFor: profile?.lookingFor,
        }}
        onSave={saveLookingFor}
        loading={loading}
      />

      <DistancePreferenceModal
        open={distancePreferenceModalOpen}
        onClose={() => setDistancePreferenceModalOpen(false)}
        currentData={{
          maxDistance: profile?.maxDistance,
        }}
        onSave={saveDistancePreference}
        loading={loading}
      />

      <PersonalityModal
        open={personalityModalOpen}
        onClose={() => setPersonalityModalOpen(false)}
        currentData={{
          communicationStyle: profile?.communicationStyle,
          loveLanguage: profile?.loveLanguage,
          zodiacSign: profile?.zodiacSign,
        }}
        onSave={savePersonality}
        loading={loading}
      />

      <AudioIntroModal
        open={audioIntroModalOpen}
        onClose={() => setAudioIntroModalOpen(false)}
        currentData={{
          audioIntroUrl: profile?.audioIntroUrl,
        }}
        onSave={saveAudioIntro}
        loading={loading}
      />
    </Container>
  );
}

export default Profile;