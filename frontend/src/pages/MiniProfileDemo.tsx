import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import MiniProfile from '../components/MiniProfile';
import { DiscoverUser } from '../types/Dating';

// Enhanced mock data with all new fields for demonstration
const mockUserBasic: DiscoverUser = {
  userID: 1,
  username: 'sarah_jones',
  firstName: 'Sarah',
  lastName: 'Jones',
  age: 25,
  bio: 'Adventure seeker, coffee lover, and dog enthusiast. Looking for someone to explore the city with and share good laughs.',
  location: 'San Francisco, CA',
  occupation: 'Software Engineer',
  education: 'Stanford University',
  interests: ['Travel', 'Photography', 'Hiking', 'Cooking', 'Music', 'Art'],
  verified: true,
  height: 165,
  gender: 'female',
  distance: 3.5,
  photos: [
    {
      photoID: 1,
      userID: 1,
      url: 'https://images.unsplash.com/photo-1494790108755-2616b2bef569?w=400&h=400&fit=crop&crop=face',
      isPrimary: true,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      photoID: 2,
      userID: 1,
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
      isPrimary: false,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    }
  ]
};

const mockUserEnhanced: DiscoverUser = {
  ...mockUserBasic,
  userID: 2,
  firstName: 'Alex',
  username: 'alex_fitness',
  age: 28,
  // Audio intro
  audioIntroUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  
  // Physical attributes
  height: 180,
  gender: 'male',
  bodyType: 'Athletic',
  ethnicity: 'Mixed',
  
  // Lifestyle
  pets: 'Dog lover',
  drinking: 'Socially',
  smoking: 'Never',
  workout: 'Daily',
  
  // Preferences  
  relationshipGoal: 'Long-term',
  lookingFor: 'Serious relationship',
  
  bio: 'Fitness enthusiast and outdoor adventurer. Love hiking, rock climbing, and trying new cuisines. Looking for someone who shares my passion for an active lifestyle and meaningful conversations.',
  location: 'Los Angeles, CA',
  occupation: 'Personal Trainer',
  education: 'UCLA',
  interests: ['Fitness', 'Hiking', 'Cooking', 'Travel', 'Photography', 'Yoga', 'Running', 'Climbing'],
  distance: 2.1,
  photos: [
    {
      photoID: 3,
      userID: 2,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      isPrimary: true,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    }
  ]
};

const mockUserCompact: DiscoverUser = {
  ...mockUserBasic,
  userID: 3,
  firstName: 'Emma',
  username: 'emma_art',
  age: 24,
  audioIntroUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  height: 158,
  gender: 'female',
  workout: 'Sometimes',
  bio: 'Creative soul with a love for art and music.',
  location: 'New York, NY',
  occupation: 'Graphic Designer',
  interests: ['Art', 'Music', 'Design'],
  distance: 1.2,
  photos: [
    {
      photoID: 4,
      userID: 3,
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      isPrimary: true,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    }
  ]
};

function MiniProfileDemo() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Enhanced MiniProfile Component Demo
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" gutterBottom sx={{ mb: 4 }}>
        Showcasing the improved MiniProfile with audio intro, full details, and proper priority ordering
      </Typography>

      <Grid container spacing={4}>
        {/* Basic Profile */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Basic Profile (Sidebar Variant)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 2 }}>
              Standard profile without enhanced features
            </Typography>
            <Box sx={{ height: '600px' }}>
              <MiniProfile 
                user={mockUserBasic} 
                showPhoto={true} 
                variant="sidebar" 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Enhanced Profile with Audio */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Enhanced Profile (Preview Variant)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 2 }}>
              With audio intro, lifestyle details, and full information
            </Typography>
            <Box sx={{ height: '600px' }}>
              <MiniProfile 
                user={mockUserEnhanced} 
                showPhoto={true} 
                variant="preview" 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Compact Profile */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Compact Profile 
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 2 }}>
              Compact variant with essential info and audio intro
            </Typography>
            <Box sx={{ height: '300px' }}>
              <MiniProfile 
                user={mockUserCompact} 
                showPhoto={true} 
                variant="compact" 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Full Height Demo */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Full Height Coverage Demo
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 2 }}>
              Shows how the MiniProfile adapts to use full available height
            </Typography>
            <Box sx={{ height: '800px', display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <MiniProfile 
                  user={mockUserEnhanced} 
                  showPhoto={true} 
                  variant="sidebar" 
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <MiniProfile 
                  user={mockUserEnhanced} 
                  showPhoto={false} 
                  variant="preview" 
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Features List */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          New Features Implemented ✅
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" component="div">
              <strong>Priority Ordering (Most Important First):</strong>
              <ol>
                <li>Name, age, verification status</li>
                <li>🎵 Audio intro (new!)</li>
                <li>Location with distance</li>
                <li>Physical attributes (height, gender, body type, ethnicity)</li>
                <li>Work and education</li>
                <li>Bio/About section</li>
                <li>Lifestyle preferences (fitness, pets, drinking, smoking)</li>
                <li>Relationship preferences</li>
                <li>Interests</li>
              </ol>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" component="div">
              <strong>Enhanced Features:</strong>
              <ul>
                <li>🎵 Audio intro playback with custom player</li>
                <li>📏 Full height coverage (removed height restrictions)</li>
                <li>🏃‍♂️ Lifestyle attributes (workout, pets, etc.)</li>
                <li>🧬 Physical attributes (body type, ethnicity)</li>
                <li>💕 Relationship preferences and goals</li>
                <li>📍 Distance display alongside location</li>
                <li>🎯 Organized sections with clear labels</li>
                <li>📱 Enhanced compact view with audio support</li>
                <li>🔄 Improved scrolling for overflow content</li>
              </ul>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default MiniProfileDemo;