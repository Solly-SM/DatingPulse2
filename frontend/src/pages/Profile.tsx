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
          onClick={() => setPersonalDetailsModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Personal Details
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setAboutMeModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit About Me
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
          onClick={() => setPreferencesModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Preferences
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setLifestyleModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Lifestyle
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setProfessionalModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Professional Info
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setMediaModalOpen(true)}
          sx={{ py: 2 }}
        >
          Edit Photos & Media
        </Button>
      </Box>

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
          loading={loading}
        />
      </Dialog>
    </Container>
  );
}

export default Profile;