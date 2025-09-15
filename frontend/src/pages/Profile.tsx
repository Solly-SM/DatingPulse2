import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Alert, Paper, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile } from '../types/User';
import {
  NameAboutStep,
  BirthDateStep,
  GenderDisplayStep,
  InterestsStep,
  PhysicalAttributesStep,
  LifestyleStep,
  MediaStep,
  AudioIntroStep,
} from '../components/registration/profile-steps';
import { SIDEBAR_WIDTH } from '../components/Sidebar';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
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
    } catch (err) {
      setError('Failed to update physical attributes');
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
    } catch (err) {
      setError('Failed to update lifestyle');
      console.error('Update error:', err);
    }
  };

  const saveMedia = async (data: { photos: File[]; profilePhotoIndex?: number; audioIntro?: File }) => {
    if (!user) return;
    try {
      setLoading(true);
      if (data.photos && data.photos.length > 0) {
        for (const photo of data.photos) {
          await userService.uploadPhoto(user.userID, photo);
        }
      }
      if (data.audioIntro) {
        // TODO: Implement audio upload in userService
        console.log('Audio intro upload not yet implemented');
      }
      await loadProfile();
      setSuccess('Media updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update media');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAudioIntro = async (data: { audioIntro?: File }) => {
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

  return (
    <>
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

      <Paper
        elevation={3}
        sx={{
          background: (theme) => theme.palette.mode === 'dark' ? '#222831' : '#f6fafd',
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          width: '100%',
          minHeight: '80vh',
          mx: 'auto',
          mt: 4,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'none',
        }}
      >
        <NameAboutStep
          data={{
            firstName: profile?.firstName || '',
            bio: profile?.bio || '',
          }}
          onComplete={saveNameAbout}
          loading={loading}
          noContainer={true}

        />
        <Divider sx={{ my: 2 }} />
        <BirthDateStep
          data={{
            dateOfBirth: profile?.dateOfBirth || '',
          }}
          onComplete={saveBirthDate}
          loading={loading}
          noContainer={true}
        />
        <Divider sx={{ my: 2 }} />
        <GenderDisplayStep
          data={{
            gender: profile?.gender || '',
            showGender: profile?.showGender || false,
          }}
          onComplete={saveGenderDisplay}
          loading={loading}
          noContainer={true}
        />
        <Divider sx={{ my: 2 }} />
        <InterestsStep
          data={{
            interests: profile?.interests || [],
          }}
          onComplete={saveInterests}
          loading={loading}
          noContainer={true}
        />
        <Divider sx={{ my: 2 }} />
        <PhysicalAttributesStep
          data={{
            height: profile?.height,
            weight: profile?.weight,
            bodyType: profile?.bodyType,
            ethnicity: profile?.ethnicity,
          }}
          onComplete={savePhysicalAttributes}
          loading={loading}
          noContainer={true}
        />
        <Divider sx={{ my: 2 }} />
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
          loading={loading}
          noContainer={true}
        />
        <Divider sx={{ my: 2 }} />
        <MediaStep
          data={{
            photos: [],
            audioIntro: undefined,
          }}
          onComplete={saveMedia}
          loading={loading}
          noContainer={true}
        />
        <Divider sx={{ my: 2 }} />
        <AudioIntroStep
          data={{
            audioIntro: undefined,
          }}
          onComplete={saveAudioIntro}
          loading={loading}
          noContainer={true}
        />
      </Paper>
    </>
  );
}

export default Profile;