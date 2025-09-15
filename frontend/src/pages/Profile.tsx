import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Alert,
  Paper,
  Box,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Button
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
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile } from '../types/User';

// Import modal components for editing
import InterestsEditModal from '../components/profile-edit/InterestsEditModal';
import PersonalityEditModal from '../components/profile-edit/PersonalityEditModal';
import LifestyleEditModal from '../components/profile-edit/LifestyleEditModal';
import PhysicalAttributesEditModal from '../components/profile-edit/PhysicalAttributesEditModal';
import AudioIntroEditModal from '../components/profile-edit/AudioIntroEditModal';
import BasicInfoEditModal from '../components/profile-edit/BasicInfoEditModal';
import PhotosEditModal from '../components/profile-edit/PhotosEditModal';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal states
  const [openModals, setOpenModals] = useState({
    basicInfo: false,
    interests: false,
    personality: false,
    lifestyle: false,
    physicalAttributes: false,
    audioIntro: false,
    photos: false
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

  // Update handlers for modals
  const handleUpdateBasicInfo = async (data: { firstName: string; bio: string; dateOfBirth: string }) => {
    if (!user || !profile) return;
    try {
      const updateData = {
        userID: user.userID,
        firstName: data.firstName,
        lastName: profile.lastName || '',
        dateOfBirth: data.dateOfBirth,
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
      setSuccess('Basic information updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update basic information');
      console.error('Update error:', err);
    }
  };

  const handleUpdateInterests = async (interests: string[]) => {
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
    } catch (err) {
      setError('Failed to update interests');
      console.error('Update error:', err);
    }
  };

  const handleUpdatePersonality = async (data: { communicationStyle?: string; loveLanguage?: string; zodiacSign?: string }) => {
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
        communicationStyle: data.communicationStyle,
        loveLanguage: data.loveLanguage,
        zodiacSign: data.zodiacSign,
      };
      const updatedProfile = await userService.updateProfile(user.userID, updateData);
      setProfile(updatedProfile);
      setSuccess('Personality updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update personality');
      console.error('Update error:', err);
    }
  };

  const handleUpdateLifestyle = async (data: { pets?: string; drinking?: string; smoking?: string; workout?: string; dietaryPreference?: string; socialMedia?: string; sleepingHabits?: string; languages?: string[] }) => {
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
      setSuccess('Lifestyle updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update lifestyle');
      console.error('Update error:', err);
    }
  };

  const handleUpdatePhysicalAttributes = async (data: { height?: number; weight?: number; bodyType?: string; ethnicity?: string }) => {
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
    } catch (err) {
      setError('Failed to update physical attributes');
      console.error('Update error:', err);
    }
  };

  const handleUpdatePhotos = async (data: { photos: File[]; profilePhotoIndex?: number }) => {
    if (!user) return;
    try {
      setLoading(true);
      if (data.photos && data.photos.length > 0) {
        for (const photo of data.photos) {
          await userService.uploadPhoto(user.userID, photo);
        }
      }
      await loadProfile();
      setSuccess('Photos updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update photos');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAudioIntro = async (data: { audioIntro?: File | null; removeAudio?: boolean }) => {
    if (!user) return;
    try {
      setLoading(true);
      if (data.audioIntro) {
        // TODO: Implement audio upload in userService
        console.log('Audio intro upload not yet implemented');
      }
      await loadProfile();
      setSuccess('Audio introduction updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update audio introduction');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        My Profile
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Header Card */}
      <Card sx={{ mb: 3, borderRadius: 3, overflow: 'visible' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                fontSize: '2rem',
                bgcolor: 'primary.main'
              }}
            >
              {profile?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" component="h2" sx={{ mr: 2 }}>
                  {profile?.firstName || 'Your Name'}
                </Typography>
                <IconButton 
                  onClick={() => openModal('basicInfo')}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {profile?.dateOfBirth ? `${calculateAge(profile.dateOfBirth)} years old` : 'Age not set'}
              </Typography>
              {profile?.city && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography color="text.secondary">
                    {profile.city}, {profile.region}
                  </Typography>
                </Box>
              )}
              <Typography variant="body1" sx={{ fontStyle: profile?.bio ? 'normal' : 'italic' }}>
                {profile?.bio || 'Tell others about yourself...'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Interests Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Interests</Typography>
                </Box>
                <IconButton onClick={() => openModal('interests')} sx={{ color: 'primary.main' }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile?.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest, index) => (
                    <Chip key={index} label={interest} size="small" color="primary" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Add your interests to connect with like-minded people
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Physical Attributes Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Physical Attributes</Typography>
                </Box>
                <IconButton onClick={() => openModal('physicalAttributes')} sx={{ color: 'primary.main' }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {profile?.height && (
                  <Typography variant="body2">Height: {profile.height} cm</Typography>
                )}
                {profile?.bodyType && (
                  <Typography variant="body2">Body Type: {profile.bodyType}</Typography>
                )}
                {profile?.ethnicity && (
                  <Typography variant="body2">Ethnicity: {profile.ethnicity}</Typography>
                )}
                {!profile?.height && !profile?.bodyType && !profile?.ethnicity && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Add your physical attributes
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lifestyle Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LifestyleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Lifestyle</Typography>
                </Box>
                <IconButton onClick={() => openModal('lifestyle')} sx={{ color: 'primary.main' }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {profile?.pets && (
                  <Typography variant="body2">Pets: {profile.pets}</Typography>
                )}
                {profile?.drinking && (
                  <Typography variant="body2">Drinking: {profile.drinking}</Typography>
                )}
                {profile?.smoking && (
                  <Typography variant="body2">Smoking: {profile.smoking}</Typography>
                )}
                {profile?.workout && (
                  <Typography variant="body2">Workout: {profile.workout}</Typography>
                )}
                {!profile?.pets && !profile?.drinking && !profile?.smoking && !profile?.workout && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Share your lifestyle preferences
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Personality Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PsychologyIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Personality</Typography>
                </Box>
                <IconButton onClick={() => openModal('personality')} sx={{ color: 'primary.main' }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {profile?.communicationStyle && (
                  <Typography variant="body2">Communication: {profile.communicationStyle}</Typography>
                )}
                {profile?.loveLanguage && (
                  <Typography variant="body2">Love Language: {profile.loveLanguage}</Typography>
                )}
                {profile?.zodiacSign && (
                  <Typography variant="body2">Zodiac: {profile.zodiacSign}</Typography>
                )}
                {!profile?.communicationStyle && !profile?.loveLanguage && !profile?.zodiacSign && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Share your personality traits
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Media Cards */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CameraIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Photos</Typography>
                </Box>
                <IconButton onClick={() => openModal('photos')} sx={{ color: 'primary.main' }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Add photos to showcase yourself
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MicIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Voice Introduction</Typography>
                </Box>
                <IconButton onClick={() => openModal('audioIntro')} sx={{ color: 'primary.main' }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Record a voice introduction
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals */}
      <BasicInfoEditModal
        open={openModals.basicInfo}
        onClose={() => closeModal('basicInfo')}
        currentData={{
          firstName: profile?.firstName || '',
          bio: profile?.bio || '',
          dateOfBirth: profile?.dateOfBirth || ''
        }}
        onSave={handleUpdateBasicInfo}
      />

      <InterestsEditModal
        open={openModals.interests}
        onClose={() => closeModal('interests')}
        currentInterests={profile?.interests || []}
        onSave={handleUpdateInterests}
      />

      <PersonalityEditModal
        open={openModals.personality}
        onClose={() => closeModal('personality')}
        currentData={{
          communicationStyle: profile?.communicationStyle,
          loveLanguage: profile?.loveLanguage,
          zodiacSign: profile?.zodiacSign
        }}
        onSave={handleUpdatePersonality}
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
        onSave={handleUpdateLifestyle}
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
        onSave={handleUpdatePhysicalAttributes}
      />

      <PhotosEditModal
        open={openModals.photos}
        onClose={() => closeModal('photos')}
        onSave={handleUpdatePhotos}
      />

      <AudioIntroEditModal
        open={openModals.audioIntro}
        onClose={() => closeModal('audioIntro')}
        currentData={{
          audioIntroUrl: undefined
        }}
        onSave={handleUpdateAudioIntro}
      />
    </Box>
  );
}

export default Profile;