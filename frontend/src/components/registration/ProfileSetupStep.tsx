import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Avatar,
  IconButton,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { ProfileSetupRequest } from '../../types/User';

interface ProfileSetupStepProps {
  onComplete: (data: Omit<ProfileSetupRequest, 'userID'>) => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

const interestOptions = [
  'Music', 'Movies', 'Travel', 'Sports', 'Books', 'Art', 'Food', 'Photography',
  'Dancing', 'Fitness', 'Gaming', 'Nature', 'Technology', 'Fashion', 'Cooking',
  'Animals', 'Adventures', 'Beach', 'Hiking', 'Yoga', 'Wine', 'Coffee'
];

function ProfileSetupStep({ onComplete, onBack, loading }: ProfileSetupStepProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    bio: '',
    location: '',
    interests: [] as string[],
    gender: '' as 'male' | 'female' | 'other' | '',
    interestedIn: '' as 'male' | 'female' | 'both' | '',
    height: '',
    education: '',
    occupation: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestsChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      interests: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && photos.length < 6) {
      const remainingSlots = 6 - photos.length;
      const newPhotos = files.slice(0, remainingSlots);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth + 'T00:00:00.000Z'); // Ensure UTC parsing
      
      // Set both dates to midnight UTC to avoid timezone issues
      const todayUTC = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const birthDateUTC = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      // Check if the date is in the future
      if (birthDateUTC > todayUTC) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      } else {
        const age = calculateAge(formData.dateOfBirth);
        if (age < 18) {
          errors.dateOfBirth = 'You must be at least 18 years old';
        }
      }
    }

    if (!formData.gender) {
      errors.gender = 'Please select your gender';
    }

    if (!formData.interestedIn) {
      errors.interestedIn = 'Please specify who you\'re interested in';
    }

    if (!formData.bio.trim()) {
      errors.bio = 'Bio is required';
    } else if (formData.bio.length < 20) {
      errors.bio = 'Bio must be at least 20 characters';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (formData.interests.length === 0) {
      errors.interests = 'Please select at least one interest';
    }

    if (photos.length === 0) {
      errors.photos = 'Please upload at least one photo';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const profileData: Omit<ProfileSetupRequest, 'userID'> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      bio: formData.bio,
      location: formData.location,
      interests: formData.interests,
      gender: formData.gender as 'male' | 'female' | 'other',
      interestedIn: formData.interestedIn as 'male' | 'female' | 'both',
      height: formData.height ? parseInt(formData.height) : undefined,
      education: formData.education || undefined,
      occupation: formData.occupation || undefined,
    };

    onComplete(profileData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Complete Your Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tell us about yourself to help others get to know you better.
      </Typography>

      {/* Photo Upload Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Photos {formErrors.photos && <span style={{ color: 'red' }}>*</span>}
        </Typography>
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <Paper
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  overflow: 'hidden',
                }}
              >
                <Avatar
                  src={URL.createObjectURL(photo)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 1,
                  }}
                  variant="rounded"
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                  }}
                  size="small"
                  onClick={() => removePhoto(index)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
          {photos.length < 6 && (
            <Grid item xs={4} sm={3} md={2}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                multiple
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Paper
                  sx={{
                    paddingTop: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: 'grey.400',
                    '&:hover': { borderColor: 'primary.main' },
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}
                  >
                    <PhotoCamera color="action" />
                    <Typography variant="caption" display="block">
                      Add Photo
                    </Typography>
                  </Box>
                </Paper>
              </label>
            </Grid>
          )}
        </Grid>
        {formErrors.photos && (
          <Typography variant="caption" color="error">
            {formErrors.photos}
          </Typography>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={!!formErrors.dateOfBirth}
            helperText={formErrors.dateOfBirth}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="location"
            label="Location"
            required
            value={formData.location}
            onChange={handleChange}
            error={!!formErrors.location}
            helperText={formErrors.location}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!formErrors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
              disabled={loading}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!formErrors.interestedIn}>
            <InputLabel>Interested In</InputLabel>
            <Select
              name="interestedIn"
              value={formData.interestedIn}
              onChange={handleSelectChange}
              disabled={loading}
            >
              <MenuItem value="male">Men</MenuItem>
              <MenuItem value="female">Women</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={3}
            name="bio"
            label="Bio"
            value={formData.bio}
            onChange={handleChange}
            error={!!formErrors.bio}
            helperText={formErrors.bio || 'Tell people about yourself (minimum 20 characters)'}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!formErrors.interests}>
            <InputLabel>Interests</InputLabel>
            <Select
              multiple
              value={formData.interests}
              onChange={handleInterestsChange}
              input={<OutlinedInput label="Interests" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={loading}
            >
              {interestOptions.map((interest) => (
                <MenuItem key={interest} value={interest}>
                  {interest}
                </MenuItem>
              ))}
            </Select>
            {formErrors.interests && (
              <Typography variant="caption" color="error">
                {formErrors.interests}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="height"
            label="Height (cm)"
            type="number"
            value={formData.height}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="education"
            label="Education"
            value={formData.education}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="occupation"
            label="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Creating Profile...' : 'Complete Registration'}
        </Button>
      </Box>
    </Box>
  );
}

export default ProfileSetupStep;