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
  Dialog,
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
import {
  PersonalDetailsStep,
  AboutMeStep,
  InterestsStep,
  PhysicalAttributesStep,
  PreferencesStep,
  LifestyleStep,
  MediaStep,
} from '../components/registration/profile-steps';
import ProfessionalStep from '../components/registration/profile-steps/ProfessionalStep';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal states for signup step components
  const [personalDetailsModalOpen, setPersonalDetailsModalOpen] = useState(false);
  const [aboutMeModalOpen, setAboutMeModalOpen] = useState(false);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [physicalAttributesModalOpen, setPhysicalAttributesModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [lifestyleModalOpen, setLifestyleModalOpen] = useState(false);
  const [professionalModalOpen, setProfessionalModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

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

  // Save functions using the step component data formats
  const savePersonalDetails = async (data: { firstName: string; lastName: string; dateOfBirth: string; gender: string; location: string; }) => {
    if (!user || !profile) return;
    
    try {
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
      setPersonalDetailsModalOpen(false);
    } catch (err) {
      setError('Failed to update personal details');
      console.error('Update error:', err);
    }
  };

  const saveAboutMe = async (data: { bio: string }) => {
    if (!user || !profile) return;
    
    try {
      const updateData = {
        userID: user.userID,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dateOfBirth: profile.dateOfBirth || '1995-01-01',
        bio: data.bio,
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
      };
      
      const updatedProfile = await userService.updateProfile(user.userID, updateData);
      setProfile(updatedProfile);
      setSuccess('Bio updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setAboutMeModalOpen(false);
    } catch (err) {
      setError('Failed to update bio');
      console.error('Update error:', err);
    }
  };

  const saveInterests = async (data: { interests: string[] }) => {
    if (!user || !profile) return;
    
    try {
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
        interests: data.interests,
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
      setInterestsModalOpen(false);
    } catch (err) {
      setError('Failed to update interests');
      console.error('Update error:', err);
    }
  };

  const savePhysicalAttributes = async (data: { height?: number; weight?: number; bodyType?: string; ethnicity?: string; }) => {
    if (!user || !profile) return;
    
    try {
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
      setPhysicalAttributesModalOpen(false);
    } catch (err) {
      setError('Failed to update physical attributes');
      console.error('Update error:', err);
    }
  };

  const savePreferences = async (data: { interestedIn: string; relationshipGoal?: string; sexualOrientation?: string; }) => {
    if (!user || !profile) return;
    
    try {
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
        interestedIn: data.interestedIn as 'male' | 'female' | 'both',
        height: profile.height,
        education: profile.education,
        occupation: profile.occupation,
        jobTitle: profile.jobTitle,
        showGender: profile.showGender,
        showAge: profile.showAge,
        showLocation: profile.showLocation,
        sexualOrientation: data.sexualOrientation,
        lookingFor: data.relationshipGoal,
      };
      
      const updatedProfile = await userService.updateProfile(user.userID, updateData);
      setProfile(updatedProfile);
      setSuccess('Preferences updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setPreferencesModalOpen(false);
    } catch (err) {
      setError('Failed to update preferences');
      console.error('Update error:', err);
    }
  };

  const saveLifestyle = async (data: { pets?: string; drinking?: string; smoking?: string; workout?: string; dietaryPreference?: string; socialMedia?: string; sleepingHabits?: string; languages?: string[]; }) => {
    if (!user || !profile) return;
    
    try {
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
      setLifestyleModalOpen(false);
    } catch (err) {
      setError('Failed to update lifestyle');
      console.error('Update error:', err);
    }
  };

  const saveProfessional = async (data: { education?: string; occupation?: string; jobTitle?: string; }) => {
    if (!user || !profile) return;
    
    try {
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
      setProfessionalModalOpen(false);
    } catch (err) {
      setError('Failed to update professional info');
      console.error('Update error:', err);
    }
  };

  const saveMedia = async (data: { photos: File[]; profilePhotoIndex?: number; audioIntro?: File }) => {
    if (!user) return;
    
    try {
      setUploading(true);
      // Handle photo uploads if there are new photos
      if (data.photos && data.photos.length > 0) {
        for (const photo of data.photos) {
          await userService.uploadPhoto(user.userID, photo);
        }
      }
      
      // Handle audio intro if provided
      if (data.audioIntro) {
        // TODO: Implement audio upload in userService
        console.log('Audio intro upload not yet implemented');
      }
      
      // Reload profile to get updated photos
      await loadProfile();
      
      setSuccess('Media updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setMediaModalOpen(false);
    } catch (err) {
      setError('Failed to update media');
      console.error('Update error:', err);
    } finally {
      setUploading(false);
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
        {/* Photos Section */}
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

        {/* Personal Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">👤 Personal Details</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPersonalDetailsModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Name:</strong> {profile?.firstName} {profile?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Age:</strong> {profile?.age || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Gender:</strong> {profile?.gender || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {profile?.location || 'Not specified'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* About Me */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">📝 About Me</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setAboutMeModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {profile?.bio || 'Tell others about yourself...'}
            </Typography>
          </Paper>
        </Grid>

        {/* Interests */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">🎯 Interests</Typography>
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">💪 Physical Attributes</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPhysicalAttributesModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Height:</strong> {profile?.height ? `${profile.height} cm` : 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Weight:</strong> {profile?.weight ? `${profile.weight} kg` : 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Body Type:</strong> {profile?.bodyType || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Ethnicity:</strong> {profile?.ethnicity || 'Not specified'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Professional Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">💼 Professional</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setProfessionalModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Education:</strong> {profile?.education || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Occupation:</strong> {profile?.occupation || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Job Title:</strong> {profile?.jobTitle || 'Not specified'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">💫 Preferences</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPreferencesModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Interested In:</strong> {profile?.interestedIn || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Sexual Orientation:</strong> {profile?.sexualOrientation || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Looking For:</strong> {profile?.lookingFor || 'Not specified'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Lifestyle */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">🌟 Lifestyle</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setLifestyleModalOpen(true)}
                size="small"
              >
                Edit
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Pets:</strong> {profile?.pets || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Drinking:</strong> {profile?.drinking || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Smoking:</strong> {profile?.smoking || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Workout:</strong> {profile?.workout || 'Not specified'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Media */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">🎤 Media & Audio</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setMediaModalOpen(true)}
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
                  <audio controls src={profile.audioIntroUrl} style={{ width: '100%' }} />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No audio introduction recorded yet. Add one to let potential matches hear your voice!
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal dialogs using signup step components */}
      <Dialog
        open={personalDetailsModalOpen}
        onClose={() => setPersonalDetailsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <PersonalDetailsStep
          data={{
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            dateOfBirth: profile?.dateOfBirth || '',
            gender: profile?.gender || '',
            location: profile?.location || '',
          }}
          onComplete={savePersonalDetails}
          onBack={() => setPersonalDetailsModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={aboutMeModalOpen}
        onClose={() => setAboutMeModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <AboutMeStep
          data={{
            bio: profile?.bio || '',
          }}
          onComplete={saveAboutMe}
          onBack={() => setAboutMeModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={interestsModalOpen}
        onClose={() => setInterestsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <InterestsStep
          data={{
            interests: profile?.interests || [],
          }}
          onComplete={saveInterests}
          onBack={() => setInterestsModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={physicalAttributesModalOpen}
        onClose={() => setPhysicalAttributesModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <PhysicalAttributesStep
          data={{
            height: profile?.height,
            weight: profile?.weight,
            bodyType: profile?.bodyType,
            ethnicity: profile?.ethnicity,
          }}
          onComplete={savePhysicalAttributes}
          onBack={() => setPhysicalAttributesModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <PreferencesStep
          data={{
            interestedIn: profile?.interestedIn || '',
            relationshipGoal: profile?.lookingFor,
            sexualOrientation: profile?.sexualOrientation,
          }}
          onComplete={savePreferences}
          onBack={() => setPreferencesModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={lifestyleModalOpen}
        onClose={() => setLifestyleModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <LifestyleStep
          data={{
            pets: profile?.pets,
            drinking: profile?.drinking,
            smoking: profile?.smoking,
            workout: profile?.workout,
            dietaryPreference: profile?.dietaryPreference,
            socialMedia: profile?.socialMedia,
            sleepingHabits: profile?.sleepingHabits,
            languages: profile?.languages,
          }}
          onComplete={saveLifestyle}
          onBack={() => setLifestyleModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={professionalModalOpen}
        onClose={() => setProfessionalModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ProfessionalStep
          data={{
            education: profile?.education,
            occupation: profile?.occupation,
            jobTitle: profile?.jobTitle,
          }}
          onComplete={saveProfessional}
          onBack={() => setProfessionalModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <MediaStep
          data={{
            photos: [],
            audioIntro: undefined,
          }}
          onComplete={saveMedia}
          onBack={() => setMediaModalOpen(false)}
          loading={uploading}
        />
      </Dialog>
    </Container>
  );
}

export default Profile;