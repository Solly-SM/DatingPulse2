import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Alert,
  Box,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Grid,
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
  LocationOn as LocationIcon,
  Transgender as GenderIcon,
  Search as InterestedInIcon,
  Settings as PreferencesIcon,
  Explore as LookingForIcon
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
import MediaEditModal from '../components/profile-edit/MediaEditModal';
import AudioIntroEditModal from '../components/profile-edit/AudioIntroEditModal';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal states for all twelve edit modals
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
    personality: false,
    media: false,
    audioIntro: false
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
    },
    {
      id: 'media',
      title: 'Photos',
      icon: <CameraIcon />,
      color: '#ff9800',
      bgColor: 'linear-gradient(135deg, #fff 0%, #fff3e0 100%)',
      data: 'Add photos to your profile'
    },
    {
      id: 'audioIntro',
      title: 'Voice Intro',
      icon: <MicIcon />,
      color: '#9c27b0',
      bgColor: 'linear-gradient(135deg, #fff 0%, #f3e5f5 100%)',
      data: 'Record a voice introduction'
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

      <MediaEditModal
        open={openModals.media}
        onClose={() => closeModal('media')}
        onSave={async (data: any) => {
          try {
            setLoading(true);
            if (data.photos && data.photos.length > 0) {
              for (const photo of data.photos) {
                await userService.uploadPhoto(user!.userID, photo);
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
        }}
      />

      <AudioIntroEditModal
        open={openModals.audioIntro}
        onClose={() => closeModal('audioIntro')}
        currentData={{
          audioIntroUrl: undefined
        }}
        onSave={async (data) => {
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
        }}
      />
    </Box>
  );
}

export default Profile;