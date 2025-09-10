import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Box,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Favorite,
  Close,
  LocationOn,
  Cake,
} from '@mui/icons-material';
import { datingService } from '../services/datingService';
import { userService } from '../services/userService';

interface DiscoverUser {
  userID: number;
  username: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  bio?: string;
  location?: string;
  interests?: string[];
  photos?: { url: string; isPrimary: boolean }[];
}

function Discover() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // For now, we'll get all users as the backend might not have discover endpoint
      const allUsers = await userService.getAllUsers();
      // Transform to match our interface
      const discoverUsers = allUsers.map(user => ({
        userID: user.userID,
        username: user.username,
        firstName: user.username, // Fallback to username
        age: Math.floor(Math.random() * 20) + 20, // Mock age
        bio: `Hi, I'm ${user.username}!`, // Mock bio
        location: 'Unknown', // Mock location
        interests: ['Music', 'Travel'], // Mock interests
      }));
      setUsers(discoverUsers);
    } catch (err: any) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= users.length) return;
    
    const currentUser = users[currentIndex];
    try {
      await datingService.likeUser(currentUser.userID);
      nextUser();
    } catch (err) {
      console.error('Failed to like user:', err);
      nextUser(); // Continue anyway
    }
  };

  const handlePass = async () => {
    if (currentIndex >= users.length) return;
    
    const currentUser = users[currentIndex];
    try {
      await datingService.passUser(currentUser.userID);
      nextUser();
    } catch (err) {
      console.error('Failed to pass user:', err);
      nextUser(); // Continue anyway
    }
  };

  const nextUser = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">Loading potential matches...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" mt={4}>
          <Typography variant="h5" gutterBottom>
            🎉 No more users to discover!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Check back later for more potential matches.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              setCurrentIndex(0);
              loadUsers();
            }}
          >
            Start Over
          </Button>
        </Box>
      </Container>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Discover People
      </Typography>
      
      <Card sx={{ minHeight: 500, position: 'relative' }}>
        {/* User Photo */}
        <Box
          sx={{
            height: 300,
            backgroundColor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            sx={{ width: 150, height: 150 }}
            src={currentUser.photos?.find(p => p.isPrimary)?.url}
          >
            {currentUser.firstName?.[0] || currentUser.username[0]}
          </Avatar>
        </Box>

        <CardContent sx={{ pb: 1 }}>
          {/* Name and Age */}
          <Typography variant="h5" component="h2" gutterBottom>
            {currentUser.firstName || currentUser.username}
            {currentUser.age && (
              <Chip
                icon={<Cake />}
                label={`${currentUser.age}`}
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>

          {/* Location */}
          {currentUser.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                {currentUser.location}
              </Typography>
            </Box>
          )}

          {/* Bio */}
          {currentUser.bio && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {currentUser.bio}
            </Typography>
          )}

          {/* Interests */}
          {currentUser.interests && currentUser.interests.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {currentUser.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </CardContent>

        {/* Action Buttons */}
        <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
          <IconButton
            size="large"
            onClick={handlePass}
            sx={{
              backgroundColor: 'grey.100',
              '&:hover': { backgroundColor: 'grey.200' },
              mx: 2,
            }}
          >
            <Close fontSize="large" />
          </IconButton>
          
          <IconButton
            size="large"
            onClick={handleLike}
            sx={{
              backgroundColor: 'pink.100',
              color: 'primary.main',
              '&:hover': { backgroundColor: 'pink.200' },
              mx: 2,
            }}
          >
            <Favorite fontSize="large" />
          </IconButton>
        </CardActions>
      </Card>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        textAlign="center" 
        sx={{ mt: 2 }}
      >
        {users.length - currentIndex - 1} more people to discover
      </Typography>
    </Container>
  );
}

export default Discover;