import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { 
  PhotoCamera, 
  Delete, 
  Star, 
  StarBorder,
  Edit,
  Save,
  Cancel 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile, Photo } from '../types/User';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    bio: '',
    location: '',
    city: '',
    region: '',
    country: '',
    interests: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    interestedIn: '' as 'male' | 'female' | 'both' | '',
    height: '',
    education: '',
    occupation: '',
    jobTitle: '',
    // Privacy controls
    showGender: true,
    showAge: true,
    showLocation: true,
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    try {
      const profileData = await userService.getProfile(user.userID);
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        age: profileData.age?.toString() || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        city: profileData.city || '',
        region: profileData.region || '',
        country: profileData.country || '',
        interests: profileData.interests?.join(', ') || '',
        gender: profileData.gender || '',
        interestedIn: profileData.interestedIn || '',
        height: profileData.height?.toString() || '',
        education: profileData.education || '',
        occupation: profileData.occupation || '',
        jobTitle: profileData.jobTitle || '',
        // Privacy controls
        showGender: profileData.showGender !== false, // Default to true
        showAge: profileData.showAge !== false, // Default to true  
        showLocation: profileData.showLocation !== false, // Default to true
      });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: profile?.dateOfBirth || '1995-01-01', // Keep existing or default
        bio: formData.bio,
        location: formData.location,
        city: formData.city || undefined,
        region: formData.region || undefined,
        country: formData.country || undefined,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        gender: formData.gender as 'male' | 'female' | 'other',
        interestedIn: formData.interestedIn as 'male' | 'female' | 'both',
        height: formData.height ? parseInt(formData.height) : undefined,
        education: formData.education || undefined,
        occupation: formData.occupation || undefined,
        jobTitle: formData.jobTitle || undefined,
        // Privacy controls
        showGender: formData.showGender,
        showAge: formData.showAge,
        showLocation: formData.showLocation,
      };

      const updatedProfile = await userService.updateProfile(user.userID, {
        userID: user.userID,
        ...profileData,
      });
      
      setProfile(updatedProfile);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        age: profile.age?.toString() || '',
        bio: profile.bio || '',
        location: profile.location || '',
        city: profile.city || '',
        region: profile.region || '',
        country: profile.country || '',
        interests: profile.interests?.join(', ') || '',
        gender: profile.gender || '',
        interestedIn: profile.interestedIn || '',
        height: profile.height?.toString() || '',
        education: profile.education || '',
        occupation: profile.occupation || '',
        jobTitle: profile.jobTitle || '',
        // Privacy controls
        showGender: profile.showGender !== false,
        showAge: profile.showAge !== false,
        showLocation: profile.showLocation !== false,
      });
    }
    setEditing(false);
    setError('');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Profile
        </Typography>
        {!editing && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </Box>

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

        {/* Profile Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={editing ? formData.firstName : profile?.firstName || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={editing ? formData.lastName : profile?.lastName || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    value={profile?.age || ''}
                    disabled
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={editing ? formData.location : profile?.location || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                  />
                </Grid>
                
                {editing && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleSelectChange}
                          label="Gender"
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Interested In</InputLabel>
                        <Select
                          name="interestedIn"
                          value={formData.interestedIn}
                          onChange={handleSelectChange}
                          label="Interested In"
                        >
                          <MenuItem value="male">Men</MenuItem>
                          <MenuItem value="female">Women</MenuItem>
                          <MenuItem value="both">Both</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={editing ? 4 : 3}
                    value={editing ? formData.bio : profile?.bio || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    placeholder="Tell others about yourself..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Interests
                    </Typography>
                    {editing ? (
                      <TextField
                        fullWidth
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="Music, Sports, Travel, etc. (comma separated)"
                      />
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile?.interests?.map((interest, index) => (
                          <Chip key={index} label={interest} size="small" />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                {/* Display additional profile information in view mode */}
                {!editing && (
                  <>
                    {(profile?.education || profile?.occupation || profile?.jobTitle) && (
                      <>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Professional Information
                          </Typography>
                        </Grid>
                        {profile?.education && (
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Education"
                              value={profile.education}
                              disabled
                              variant="filled"
                            />
                          </Grid>
                        )}
                        {profile?.occupation && (
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Occupation"
                              value={profile.occupation}
                              disabled
                              variant="filled"
                            />
                          </Grid>
                        )}
                        {profile?.jobTitle && (
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Job Title"
                              value={profile.jobTitle}
                              disabled
                              variant="filled"
                            />
                          </Grid>
                        )}
                      </>
                    )}
                    
                    {(profile?.city || profile?.region || profile?.country) && (
                      <>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Location Details
                          </Typography>
                        </Grid>
                        {profile?.city && (
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="City"
                              value={profile.city}
                              disabled
                              variant="filled"
                            />
                          </Grid>
                        )}
                        {profile?.region && (
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Region/State"
                              value={profile.region}
                              disabled
                              variant="filled"
                            />
                          </Grid>
                        )}
                        {profile?.country && (
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Country"
                              value={profile.country}
                              disabled
                              variant="filled"
                            />
                          </Grid>
                        )}
                      </>
                    )}

                    {/* Display privacy settings in view mode */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Privacy Settings
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Gender Visibility"
                        value={profile?.showGender !== false ? 'Visible' : 'Hidden'}
                        disabled
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Age Visibility"
                        value={profile?.showAge !== false ? 'Visible' : 'Hidden'}
                        disabled
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Location Visibility"
                        value={profile?.showLocation !== false ? 'Visible' : 'Hidden'}
                        disabled
                        variant="filled"
                      />
                    </Grid>
                  </>
                )}
                
                {editing && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Height (cm)"
                        name="height"
                        type="number"
                        value={formData.height}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="Software Engineer, Teacher, etc."
                      />
                    </Grid>
                    
                    {/* Enhanced Location Fields */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Region/State"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        placeholder="New York"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="United States"
                      />
                    </Grid>

                    {/* Privacy Controls */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Privacy Settings
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Control what information is visible on your profile
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.showGender}
                            onChange={handleSwitchChange}
                            name="showGender"
                          />
                        }
                        label="Show Gender"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.showAge}
                            onChange={handleSwitchChange}
                            name="showAge"
                          />
                        }
                        label="Show Age"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.showLocation}
                            onChange={handleSwitchChange}
                            name="showLocation"
                          />
                        }
                        label="Show Location"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              
              {editing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;