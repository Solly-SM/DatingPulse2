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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile, Photo } from '../types/User';
import InlineEditField from '../components/InlineEditField';
import LocationField from '../components/LocationField';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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

  // Individual field update functions
  const updateProfileField = async (fieldName: string, value: any) => {
    if (!user || !profile) return;

    try {
      // Create a proper ProfileSetupRequest object
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
        [fieldName]: value,
      };
      
      const updatedProfile = await userService.updateProfile(user.userID, updateData);
      
      setProfile(updatedProfile);
      setSuccess(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || `Failed to update ${fieldName}`);
    }
  };

  const updateLocationField = async (location: string, coordinates?: { latitude: number; longitude: number }) => {
    if (!user || !profile) return;

    try {
      // Create a proper ProfileSetupRequest object
      const updateData = {
        userID: user.userID,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dateOfBirth: profile.dateOfBirth || '1995-01-01',
        bio: profile.bio || '',
        location: location,
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
      
      // If coordinates are provided, you could store them separately
      // For now, we'll just update the location string
      
      const updatedProfile = await userService.updateProfile(user.userID, updateData);
      
      setProfile(updatedProfile);
      setSuccess('Location updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update location');
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

        {/* Profile Information with Inline Editing */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="First Name"
                  value={profile?.firstName || ''}
                  onSave={(value) => updateProfileField('firstName', value)}
                  placeholder="Enter your first name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="Last Name"
                  value={profile?.lastName || ''}
                  onSave={(value) => updateProfileField('lastName', value)}
                  placeholder="Enter your last name"
                />
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

              {/* Location with Detection */}
              <Grid item xs={12} sm={6}>
                <LocationField
                  value={profile?.location || ''}
                  onSave={updateLocationField}
                />
              </Grid>

              {/* Gender and Interested In */}
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="Gender"
                  value={profile?.gender || ''}
                  type="select"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  onSave={(value) => updateProfileField('gender', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="Interested In"
                  value={profile?.interestedIn || ''}
                  type="select"
                  options={[
                    { value: 'male', label: 'Men' },
                    { value: 'female', label: 'Women' },
                    { value: 'both', label: 'Both' },
                  ]}
                  onSave={(value) => updateProfileField('interestedIn', value)}
                />
              </Grid>

              {/* Bio */}
              <Grid item xs={12}>
                <InlineEditField
                  label="Bio"
                  value={profile?.bio || ''}
                  type="textarea"
                  onSave={(value) => updateProfileField('bio', value)}
                  placeholder="Tell others about yourself..."
                />
              </Grid>

              {/* Interests */}
              <Grid item xs={12}>
                <InlineEditField
                  label="Interests"
                  value={profile?.interests || []}
                  type="chips"
                  onSave={(value) => updateProfileField('interests', value)}
                  placeholder="Music, Sports, Travel, etc. (comma separated)"
                />
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  Professional Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Height (cm)"
                  value={profile?.height?.toString() || ''}
                  onSave={(value) => updateProfileField('height', value ? parseInt(value as string) : undefined)}
                  placeholder="Enter your height"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Education"
                  value={profile?.education || ''}
                  onSave={(value) => updateProfileField('education', value)}
                  placeholder="University, degree, etc."
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Occupation"
                  value={profile?.occupation || ''}
                  onSave={(value) => updateProfileField('occupation', value)}
                  placeholder="Your profession"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Job Title"
                  value={profile?.jobTitle || ''}
                  onSave={(value) => updateProfileField('jobTitle', value)}
                  placeholder="Software Engineer, Teacher, etc."
                />
              </Grid>

              {/* Location Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  Location Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="City"
                  value={profile?.city || ''}
                  onSave={(value) => updateProfileField('city', value)}
                  placeholder="New York"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Region/State"
                  value={profile?.region || ''}
                  onSave={(value) => updateProfileField('region', value)}
                  placeholder="New York"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Country"
                  value={profile?.country || ''}
                  onSave={(value) => updateProfileField('country', value)}
                  placeholder="United States"
                />
              </Grid>

              {/* Privacy Settings */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  Privacy Settings
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Gender Visibility"
                  value={profile?.showGender !== false ? 'visible' : 'hidden'}
                  type="select"
                  options={[
                    { value: 'visible', label: 'Visible' },
                    { value: 'hidden', label: 'Hidden' },
                  ]}
                  onSave={(value) => updateProfileField('showGender', value === 'visible')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Age Visibility"
                  value={profile?.showAge !== false ? 'visible' : 'hidden'}
                  type="select"
                  options={[
                    { value: 'visible', label: 'Visible' },
                    { value: 'hidden', label: 'Hidden' },
                  ]}
                  onSave={(value) => updateProfileField('showAge', value === 'visible')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="Location Visibility"
                  value={profile?.showLocation !== false ? 'visible' : 'hidden'}
                  type="select"
                  options={[
                    { value: 'visible', label: 'Visible' },
                    { value: 'hidden', label: 'Hidden' },
                  ]}
                  onSave={(value) => updateProfileField('showLocation', value === 'visible')}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;