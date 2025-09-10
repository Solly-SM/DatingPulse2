import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  Alert,
} from '@mui/material';
import { Person, PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserProfile } from '../types/User';

function Profile() {
  const { user } = useAuth();
  const [, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    bio: '',
    location: '',
    interests: '',
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const profileData = await userService.getProfile(user.userID);
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        age: profileData.age?.toString() || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        interests: profileData.interests?.join(', ') || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, [user, setProfile]);

  useEffect(() => {
    loadProfile();
  }, [user, loadProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
      };
      
      await userService.updateProfile(user.userID, updateData);
      setSuccess('Profile updated successfully!');
      loadProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
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
        {/* Profile Picture Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              sx={{ mb: 2 }}
            >
              Upload Photo
            </Button>
            <Typography variant="body2" color="text.secondary">
              Add photos to make your profile more attractive
            </Typography>
          </Paper>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
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
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell others about yourself..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Music, Sports, Travel, etc. (comma separated)"
                  />
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;