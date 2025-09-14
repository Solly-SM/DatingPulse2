import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile } from '../types/User';
import {
  NameAboutStep,
  BirthDateStep,
  GenderDisplayStep,
  SexualOrientationStep,
  InterestedInStep,
  LookingForStep,
  DistancePreferenceStep,
  InterestsStep,
  PhysicalAttributesStep,
  LifestyleStep,
  PersonalityStep,
  MediaStep,
  AudioIntroStep,
} from '../components/registration/profile-steps';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal states for signup step components (8 streamlined buttons)
  const [nameAboutModalOpen, setNameAboutModalOpen] = useState(false);
  const [birthDateModalOpen, setBirthDateModalOpen] = useState(false);
  const [genderDisplayModalOpen, setGenderDisplayModalOpen] = useState(false);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [physicalAttributesModalOpen, setPhysicalAttributesModalOpen] = useState(false);
  const [lifestyleModalOpen, setLifestyleModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
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

  // Save functions using the step component data formats
  const saveNameAbout = async (data: { firstName: string; bio: string }) => {
    if (!user || !profile) return;
    
    try {
      const updateData = {
        userID: user.userID,
        firstName: data.firstName,
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
      setSuccess('Name and bio updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setNameAboutModalOpen(false);
    } catch (err) {
      setError('Failed to update name and bio');
      console.error('Update error:', err);
    }
  };

  const saveBirthDate = async (data: { dateOfBirth: string }) => {
    if (!user || !profile) return;
    
    try {
      const updateData = {
        userID: user.userID,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dateOfBirth: data.dateOfBirth,
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
      };
      
      const updatedProfile = await userService.updateProfile(user.userID, updateData);
      setProfile(updatedProfile);
      setSuccess('Birth date updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setBirthDateModalOpen(false);
    } catch (err) {
      setError('Failed to update birth date');
      console.error('Update error:', err);
    }
  };

  const saveGenderDisplay = async (data: { gender: string; showGender: boolean }) => {
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
        gender: data.gender as 'male' | 'female' | 'other',
        interestedIn: profile.interestedIn || 'both' as 'male' | 'female' | 'both',
        height: profile.height,
        education: profile.education,
        occupation: profile.occupation,
        jobTitle: profile.jobTitle,
        showGender: data.showGender,
        showAge: profile.showAge,
        showLocation: profile.showLocation,
      };
      
      const updatedProfile = await userService.updateProfile(user.userID, updateData);
      setProfile(updatedProfile);
      setSuccess('Gender and display preferences updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setGenderDisplayModalOpen(false);
    } catch (err) {
      setError('Failed to update gender and display preferences');
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



  const saveAudioIntro = async (data: { audioIntro?: File }) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Handle audio intro if provided
      if (data.audioIntro) {
        // TODO: Implement audio upload in userService
        console.log('Audio intro upload not yet implemented');
      }
      
      // Reload profile to get updated audio
      await loadProfile();
      
      setSuccess('Audio introduction updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setAudioIntroModalOpen(false);
    } catch (err) {
      setError('Failed to update audio introduction');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
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



  const saveMedia = async (data: { photos: File[]; profilePhotoIndex?: number; audioIntro?: File }) => {
    if (!user) return;
    
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };



  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Edit Profile
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setNameAboutModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Name & About
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setBirthDateModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Birth Date
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setGenderDisplayModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Gender & Preferences
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setInterestsModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Interests
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setPhysicalAttributesModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Physical Attributes
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setLifestyleModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Lifestyle & Personality
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setMediaModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Photos & Media
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setAudioIntroModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Audio Introduction
        </Button>
      </Box>

      {/* Modal dialogs using new simplified signup step components - 8 streamlined buttons */}
      <Dialog
        open={nameAboutModalOpen}
        onClose={() => setNameAboutModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <NameAboutStep
          data={{
            firstName: profile?.firstName || '',
            bio: profile?.bio || '',
          }}
          onComplete={saveNameAbout}
          onBack={() => setNameAboutModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={birthDateModalOpen}
        onClose={() => setBirthDateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <BirthDateStep
          data={{
            dateOfBirth: profile?.dateOfBirth || '',
          }}
          onComplete={saveBirthDate}
          onBack={() => setBirthDateModalOpen(false)}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={genderDisplayModalOpen}
        onClose={() => setGenderDisplayModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <GenderDisplayStep
          data={{
            gender: profile?.gender || '',
            showGender: profile?.showGender || false,
          }}
          onComplete={saveGenderDisplay}
          onBack={() => setGenderDisplayModalOpen(false)}
          onSkip={() => setGenderDisplayModalOpen(false)}
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
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={audioIntroModalOpen}
        onClose={() => setAudioIntroModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <AudioIntroStep
          data={{
            audioIntro: undefined, // TODO: Load existing audio from profile
          }}
          onComplete={saveAudioIntro}
          onBack={() => setAudioIntroModalOpen(false)}
          onSkip={() => setAudioIntroModalOpen(false)}
          loading={loading}
        />
      </Dialog>
    </Container>
  );
}

export default Profile;