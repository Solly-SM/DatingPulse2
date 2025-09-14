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
              👤 Profile Information
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

              {/* Physical Attributes */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  💪 Physical Attributes
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="📏 Height (cm)"
                  value={profile?.height?.toString() || ''}
                  onSave={(value) => updateProfileField('height', value ? parseInt(value as string) : undefined)}
                  placeholder="Enter your height"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="⚖️ Weight (kg)"
                  value={profile?.weight?.toString() || ''}
                  onSave={(value) => updateProfileField('weight', value ? parseInt(value as string) : undefined)}
                  placeholder="Enter your weight"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="🏃‍♂️ Body Type"
                  value={profile?.bodyType || ''}
                  type="select"
                  options={[
                    { value: 'Slim', label: 'Slim' },
                    { value: 'Athletic', label: 'Athletic' },
                    { value: 'Average', label: 'Average' },
                    { value: 'Curvy', label: 'Curvy' },
                    { value: 'Muscular', label: 'Muscular' },
                    { value: 'Plus Size', label: 'Plus Size' },
                    { value: 'Other', label: 'Other' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                  onSave={(value) => updateProfileField('bodyType', value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="🌍 Ethnicity"
                  value={profile?.ethnicity || ''}
                  type="select"
                  options={[
                    { value: 'African', label: 'African' },
                    { value: 'Asian', label: 'Asian' },
                    { value: 'Caucasian', label: 'Caucasian' },
                    { value: 'Hispanic/Latino', label: 'Hispanic/Latino' },
                    { value: 'Middle Eastern', label: 'Middle Eastern' },
                    { value: 'Native American', label: 'Native American' },
                    { value: 'Pacific Islander', label: 'Pacific Islander' },
                    { value: 'Mixed', label: 'Mixed' },
                    { value: 'Other', label: 'Other' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                  onSave={(value) => updateProfileField('ethnicity', value)}
                />
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  💼 Professional Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="🎓 Education"
                  value={profile?.education || ''}
                  onSave={(value) => updateProfileField('education', value)}
                  placeholder="University, degree, etc."
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="💼 Occupation"
                  value={profile?.occupation || ''}
                  onSave={(value) => updateProfileField('occupation', value)}
                  placeholder="Your profession"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="🏷️ Job Title"
                  value={profile?.jobTitle || ''}
                  onSave={(value) => updateProfileField('jobTitle', value)}
                  placeholder="Software Engineer, Teacher, etc."
                />
              </Grid>

              {/* Lifestyle & Preferences */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  🌟 Lifestyle & Preferences
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="🐾 Pets"
                  value={profile?.pets || ''}
                  type="select"
                  options={[
                    { value: '❤️ Love them', label: '❤️ Love them' },
                    { value: '🐕 Have dogs', label: '🐕 Have dogs' },
                    { value: '🐱 Have cats', label: '🐱 Have cats' },
                    { value: '🐰 Have small pets', label: '🐰 Have small pets' },
                    { value: '🐦 Have birds', label: '🐦 Have birds' },
                    { value: '🐢 Have reptiles', label: '🐢 Have reptiles' },
                    { value: '🐠 Have fish', label: '🐠 Have fish' },
                    { value: '🤧 Allergic', label: '🤧 Allergic' },
                    { value: '🚫 Not a fan', label: '🚫 Not a fan' },
                    { value: '💭 Want pets someday', label: '💭 Want pets someday' },
                  ]}
                  onSave={(value) => updateProfileField('pets', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="🍷 Drinking"
                  value={profile?.drinking || ''}
                  type="select"
                  options={[
                    { value: '🚫 Never', label: '🚫 Never' },
                    { value: '🍷 Rarely', label: '🍷 Rarely' },
                    { value: '🥂 Socially', label: '🥂 Socially' },
                    { value: '🍺 Regularly', label: '🍺 Regularly' },
                    { value: '🤐 Prefer not to say', label: '🤐 Prefer not to say' },
                  ]}
                  onSave={(value) => updateProfileField('drinking', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="🚬 Smoking"
                  value={profile?.smoking || ''}
                  type="select"
                  options={[
                    { value: '🚫 Never', label: '🚫 Never' },
                    { value: '🚬 Socially', label: '🚬 Socially' },
                    { value: '🚬 Regularly', label: '🚬 Regularly' },
                    { value: '🚭 Trying to quit', label: '🚭 Trying to quit' },
                    { value: '🤐 Prefer not to say', label: '🤐 Prefer not to say' },
                  ]}
                  onSave={(value) => updateProfileField('smoking', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="💪 Workout"
                  value={profile?.workout || ''}
                  type="select"
                  options={[
                    { value: '💪 Daily', label: '💪 Daily' },
                    { value: '🏃‍♂️ Often', label: '🏃‍♂️ Often' },
                    { value: '🚶‍♂️ Sometimes', label: '🚶‍♂️ Sometimes' },
                    { value: '🛋️ Rarely', label: '🛋️ Rarely' },
                    { value: '😴 Never', label: '😴 Never' },
                  ]}
                  onSave={(value) => updateProfileField('workout', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="🥗 Diet"
                  value={profile?.dietaryPreference || ''}
                  type="select"
                  options={[
                    { value: '🍖 Omnivore', label: '🍖 Omnivore' },
                    { value: '🥗 Vegetarian', label: '🥗 Vegetarian' },
                    { value: '🌱 Vegan', label: '🌱 Vegan' },
                    { value: '🐟 Pescatarian', label: '🐟 Pescatarian' },
                    { value: '🥑 Keto', label: '🥑 Keto' },
                    { value: '🍎 Paleo', label: '🍎 Paleo' },
                    { value: '🤷‍♂️ Other', label: '🤷‍♂️ Other' },
                  ]}
                  onSave={(value) => updateProfileField('dietaryPreference', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="📱 Social Media"
                  value={profile?.socialMedia || ''}
                  type="select"
                  options={[
                    { value: '📱 Very active', label: '📱 Very active' },
                    { value: '📲 Active', label: '📲 Active' },
                    { value: '🤳 Rarely use', label: '🤳 Rarely use' },
                    { value: '🚫 Not on social media', label: '🚫 Not on social media' },
                  ]}
                  onSave={(value) => updateProfileField('socialMedia', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="😴 Sleep Schedule"
                  value={profile?.sleepingHabits || ''}
                  type="select"
                  options={[
                    { value: '🌅 Early bird', label: '🌅 Early bird' },
                    { value: '🦉 Night owl', label: '🦉 Night owl' },
                    { value: '🤷‍♂️ Depends on the day', label: '🤷‍♂️ Depends on the day' },
                    { value: '😵‍💫 Inconsistent schedule', label: '😵‍💫 Inconsistent schedule' },
                  ]}
                  onSave={(value) => updateProfileField('sleepingHabits', value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InlineEditField
                  label="🗣️ Languages"
                  value={profile?.languages || []}
                  type="chips"
                  onSave={(value) => updateProfileField('languages', value)}
                  placeholder="English, Spanish, French, etc. (comma separated)"
                />
              </Grid>

              {/* Dating Preferences */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  💕 Dating Preferences
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="💘 Relationship Goal"
                  value={profile?.relationshipGoal || ''}
                  type="select"
                  options={[
                    { value: 'Looking for love', label: 'Looking for love' },
                    { value: 'Open to dating', label: 'Open to dating' },
                    { value: 'Want to chat first', label: 'Want to chat first' },
                    { value: 'Looking for friends', label: 'Looking for friends' },
                    { value: 'Something casual', label: 'Something casual' },
                    { value: 'Long-term relationship', label: 'Long-term relationship' },
                  ]}
                  onSave={(value) => updateProfileField('relationshipGoal', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="🏳️‍🌈 Sexual Orientation"
                  value={profile?.sexualOrientation || ''}
                  type="select"
                  options={[
                    { value: 'Straight', label: 'Straight' },
                    { value: 'Gay', label: 'Gay' },
                    { value: 'Lesbian', label: 'Lesbian' },
                    { value: 'Bisexual', label: 'Bisexual' },
                    { value: 'Pansexual', label: 'Pansexual' },
                    { value: 'Asexual', label: 'Asexual' },
                    { value: 'Demisexual', label: 'Demisexual' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                  onSave={(value) => updateProfileField('sexualOrientation', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="🔍 Looking For"
                  value={profile?.lookingFor || ''}
                  onSave={(value) => updateProfileField('lookingFor', value)}
                  placeholder="What you're seeking in a partner"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InlineEditField
                  label="📍 Max Distance (km)"
                  value={profile?.maxDistance?.toString() || ''}
                  onSave={(value) => updateProfileField('maxDistance', value ? parseInt(value as string) : undefined)}
                  placeholder="Maximum distance for matches"
                />
              </Grid>

              {/* Personality */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  🧠 Personality
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="💬 Communication Style"
                  value={profile?.communicationStyle || ''}
                  onSave={(value) => updateProfileField('communicationStyle', value)}
                  placeholder="Direct, thoughtful, playful, etc."
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="❤️ Love Language"
                  value={profile?.loveLanguage || ''}
                  type="select"
                  options={[
                    { value: 'Words of Affirmation', label: 'Words of Affirmation' },
                    { value: 'Acts of Service', label: 'Acts of Service' },
                    { value: 'Receiving Gifts', label: 'Receiving Gifts' },
                    { value: 'Quality Time', label: 'Quality Time' },
                    { value: 'Physical Touch', label: 'Physical Touch' },
                  ]}
                  onSave={(value) => updateProfileField('loveLanguage', value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InlineEditField
                  label="♈ Zodiac Sign"
                  value={profile?.zodiacSign || ''}
                  type="select"
                  options={[
                    { value: 'Aries', label: '♈ Aries' },
                    { value: 'Taurus', label: '♉ Taurus' },
                    { value: 'Gemini', label: '♊ Gemini' },
                    { value: 'Cancer', label: '♋ Cancer' },
                    { value: 'Leo', label: '♌ Leo' },
                    { value: 'Virgo', label: '♍ Virgo' },
                    { value: 'Libra', label: '♎ Libra' },
                    { value: 'Scorpio', label: '♏ Scorpio' },
                    { value: 'Sagittarius', label: '♐ Sagittarius' },
                    { value: 'Capricorn', label: '♑ Capricorn' },
                    { value: 'Aquarius', label: '♒ Aquarius' },
                    { value: 'Pisces', label: '♓ Pisces' },
                  ]}
                  onSave={(value) => updateProfileField('zodiacSign', value)}
                />
              </Grid>

              {/* Location Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  🗺️ Location Details
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
                  🔒 Privacy Settings
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <InlineEditField
                  label="👤 Gender Visibility"
                  value={profile?.showGender !== false ? 'visible' : 'hidden'}
                  type="select"
                  options={[
                    { value: 'visible', label: 'Visible' },
                    { value: 'hidden', label: 'Hidden' },
                  ]}
                  onSave={(value) => updateProfileField('showGender', value === 'visible')}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <InlineEditField
                  label="🎂 Age Visibility"
                  value={profile?.showAge !== false ? 'visible' : 'hidden'}
                  type="select"
                  options={[
                    { value: 'visible', label: 'Visible' },
                    { value: 'hidden', label: 'Hidden' },
                  ]}
                  onSave={(value) => updateProfileField('showAge', value === 'visible')}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <InlineEditField
                  label="📍 Location Visibility"
                  value={profile?.showLocation !== false ? 'visible' : 'hidden'}
                  type="select"
                  options={[
                    { value: 'visible', label: 'Visible' },
                    { value: 'hidden', label: 'Hidden' },
                  ]}
                  onSave={(value) => updateProfileField('showLocation', value === 'visible')}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <InlineEditField
                  label="🏳️‍🌈 Orientation Visibility"
                  value={profile?.showOrientation !== false ? 'visible' : 'hidden'}
                  type="select"
                  options={[
                    { value: 'visible', label: 'Visible' },
                    { value: 'hidden', label: 'Hidden' },
                  ]}
                  onSave={(value) => updateProfileField('showOrientation', value === 'visible')}
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