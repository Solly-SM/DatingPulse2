import React, { useState } from 'react';
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
import { UserProfile, Photo } from '../types/User';
import InlineEditField from '../components/InlineEditField';
import LocationField from '../components/LocationField';

// Mock profile data showcasing all the enhanced fields
const mockProfile: UserProfile = {
  userID: 1,
  firstName: 'Emma',
  lastName: 'Johnson',
  dateOfBirth: '1995-03-15',
  age: 28,
  bio: 'Adventure seeker, coffee enthusiast, and dog lover. Looking for someone to explore new places and create amazing memories together! 🌟',
  location: 'San Francisco, CA',
  city: 'San Francisco',
  region: 'California',
  country: 'United States',
  interests: ['🎨 Photography', '🏃‍♀️ Running', '☕ Coffee', '🎵 Music', '✈️ Travel', '🐕 Dogs'],
  photos: [
    {
      photoID: 1,
      userID: 1,
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b739?w=400',
      caption: 'Beach day!',
      uploadedAt: '2024-01-15T10:30:00Z',
      isPrimary: true
    }
  ],
  profileCompleted: true,
  gender: 'female',
  interestedIn: 'male',
  height: 165,
  education: 'Bachelor\'s in Computer Science',
  occupation: 'Software Engineer',
  jobTitle: 'Senior Frontend Developer',
  
  // Physical Attributes
  weight: 60,
  bodyType: 'Athletic',
  ethnicity: 'Caucasian',
  
  // Lifestyle Data  
  pets: '🐕 Have dogs',
  drinking: '🥂 Socially',
  smoking: '🚫 Never',
  workout: '🏃‍♂️ Often',
  dietaryPreference: '🥗 Vegetarian',
  socialMedia: '📲 Active',
  sleepingHabits: '🌅 Early bird',
  languages: ['English', 'Spanish', 'French'],
  
  // Preferences
  relationshipGoal: 'Looking for love',
  sexualOrientation: 'Straight',
  lookingFor: 'Someone who shares my love for adventure and has a great sense of humor',
  maxDistance: 50,
  
  // Personality
  communicationStyle: 'Direct but thoughtful',
  loveLanguage: 'Quality Time',
  zodiacSign: 'Pisces',
  
  // Field visibility controls
  showGender: true,
  showAge: true,
  showLocation: true,
  showOrientation: false,
};

function ProfileDemo() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const updateProfileField = async (field: string, value: any) => {
    try {
      setProfile(prev => ({ ...prev, [field]: value }));
      setSuccess(`${field} updated successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to update ${field}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const updateLocationField = async (location: string, coordinates?: { latitude: number; longitude: number }) => {
    try {
      setProfile(prev => ({ 
        ...prev, 
        location: location,
        ...(coordinates?.latitude && { latitude: coordinates.latitude }),
        ...(coordinates?.longitude && { longitude: coordinates.longitude })
      }));
      setSuccess('Location updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update location');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        ✨ Enhanced Profile Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Showcasing the comprehensive profile fields with organized sections and emoji visual indicators
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Photos Section */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              📸 Photos
            </Typography>
            
            <Grid container spacing={2}>
              {profile?.photos?.map((photo) => (
                <Grid item xs={6} sm={4} md={3} key={photo.photoID}>
                  <Card sx={{ position: 'relative', height: 200 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={photo.url}
                      alt={photo.caption || 'Profile photo'}
                      sx={{ objectFit: 'cover' }}
                    />
                    {photo.isPrimary && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                        size="small"
                      >
                        <Star fontSize="small" />
                      </IconButton>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Information with Inline Editing */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              👤 Profile Information
            </Typography>
            
            <Grid container spacing={2}>
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

              {/* Physical Attributes */}
              <Grid item xs={12}>
                <Box sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    💪 Physical Attributes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <InlineEditField
                  label="📏 Height (cm)"
                  value={profile?.height?.toString() || ''}
                  onSave={(value) => updateProfileField('height', value ? parseInt(value as string) : undefined)}
                  placeholder="Enter your height"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <InlineEditField
                  label="⚖️ Weight (kg)"
                  value={profile?.weight?.toString() || ''}
                  onSave={(value) => updateProfileField('weight', value ? parseInt(value as string) : undefined)}
                  placeholder="Enter your weight"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
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
                <Box sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    💼 Professional Information
                  </Typography>
                </Box>
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
                <Box sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    🌟 Lifestyle & Preferences
                  </Typography>
                </Box>
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
                <Box sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    💕 Dating Preferences
                  </Typography>
                </Box>
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
                <Box sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    🧠 Personality
                  </Typography>
                </Box>
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
                <Box sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    🗺️ Location Details
                  </Typography>
                </Box>
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
                <Box sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    🔒 Privacy Settings
                  </Typography>
                </Box>
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

export default ProfileDemo;