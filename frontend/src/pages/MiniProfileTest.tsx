import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import MiniProfile from '../components/MiniProfile';
import { DiscoverUser } from '../types/Dating';

// Enhanced mock user data with all the new fields
const mockEnhancedUser: DiscoverUser = {
  userID: 1,
  firstName: 'Emma',
  username: 'emma_johnson',
  age: 28,
  bio: 'Adventure seeker, coffee enthusiast, and dog lover. Looking for someone to explore new places and create amazing memories together! 🌟',
  location: 'San Francisco, CA',
  interests: ['🎨 Photography', '🏃‍♀️ Running', '☕ Coffee', '🎵 Music', '✈️ Travel', '🐕 Dogs'],
  photos: [
    {
      photoID: 1,
      userID: 1,
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b739?w=400',
      caption: 'Beach day!',
      uploadedAt: '2024-01-15T10:30:00Z',
      isPrimary: true
    }
  ],
  verified: true,
  gender: 'female',
  height: 165,
  education: 'Bachelor\'s in Computer Science',
  occupation: 'Tech Company',
  jobTitle: 'Senior Frontend Developer',
  
  // Physical Attributes
  weight: 60,
  bodyType: 'Athletic',
  ethnicity: 'Caucasian',
  
  // Audio intro (mock URL for demo)
  audioIntroUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  
  // Lifestyle Data  
  pets: '🐕 Have dogs',
  drinking: '🥂 Socially',
  smoking: '🚫 Never',
  workout: '🏃‍♂️ Often',
  dietaryPreference: '🥗 Vegetarian',
  sleepingHabits: '🌅 Early bird',
  languages: ['English', 'Spanish', 'French'],
  
  // Preferences
  relationshipGoal: 'Looking for love',
  sexualOrientation: 'Straight',
  lookingFor: 'Someone who shares my love for adventure and has a great sense of humor',
  
  // Personality
  communicationStyle: 'Direct but thoughtful',
  loveLanguage: 'Quality Time',
  zodiacSign: 'Pisces',
  
  // Additional Optional Profile Fields
  religion: 'Spiritual but not religious',
  politicalViews: 'Progressive',
  familyPlans: 'Want kids someday',
  fitnessLevel: 'Very active',
  travelFrequency: 'Love to travel',
  industry: 'Technology',
  musicPreferences: ['🎵 Indie Pop', '🎸 Rock', '🎤 Jazz'],
  foodPreferences: ['🥗 Healthy eating', '🍜 Asian cuisine', '☕ Coffee lover'],
  entertainmentPreferences: ['📚 Reading', '🎬 Documentaries', '🎮 Gaming'],
  currentlyReading: 'The Seven Husbands of Evelyn Hugo',
  lifeGoals: 'Build meaningful relationships, travel the world, and make a positive impact through technology',
  petPreferences: 'Love dogs, have cats too',
};

// Basic user for comparison
const basicUser: DiscoverUser = {
  userID: 2,
  firstName: 'John',
  username: 'john_basic',
  age: 25,
  bio: 'Simple bio here',
  location: 'New York, NY',
  interests: ['Hiking', 'Movies'],
  verified: false,
  height: 180,
  gender: 'male',
};

function MiniProfileTest() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        🎯 Enhanced MiniProfile Test
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Testing the enhanced MiniProfile component with all new fields, audio intro, and full height coverage
      </Typography>

      <Grid container spacing={3}>
        {/* Enhanced Profile */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Enhanced Profile (All Fields)
            </Typography>
            <Box sx={{ height: '80vh' }}>
              <MiniProfile
                user={mockEnhancedUser}
                showPhoto={true}
                variant="preview"
                maxHeight="100%"
              />
            </Box>
          </Box>
        </Grid>

        {/* Basic Profile for Comparison */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Basic Profile (Limited Fields)
            </Typography>
            <Box sx={{ height: '80vh' }}>
              <MiniProfile
                user={basicUser}
                showPhoto={false}
                variant="preview"
                maxHeight="100%"
              />
            </Box>
          </Box>
        </Grid>

        {/* Compact View Test */}
        <Grid item xs={12}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Compact View (With Audio Indicator)
            </Typography>
            <MiniProfile
              user={mockEnhancedUser}
              showPhoto={true}
              variant="compact"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MiniProfileTest;