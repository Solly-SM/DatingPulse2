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
  bodyType: 'Slim',
  ethnicity: 'Asian',
  distance: 3.5,
  
  // Lifestyle
  pets: 'Cat lover',
  drinking: 'Occasionally',
  smoking: 'Never',
  workout: 'Regular',
  
  // Preferences  
  relationshipGoal: 'Long-term',
  lookingFor: 'Meaningful connection',
  
  photos: [
    {
      photoID: 1,
      userID: 1,
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTkxZTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkE8L3RleHQ+PC9zdmc+',
      isPrimary: true,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      photoID: 2,
      userID: 1,
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY0MDgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjI8L3RleHQ+PC9zdmc+',
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
  // Audio intro - Using a simple tone audio data URL that works reliably
  audioIntroUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAfBz2L0/PJdSgFKn3J8N2QQgoeaLvu5Z9NEAxPqeXwtWQcBz2N1fDMeywFJHfA8N2QQAoUXrTp66hWFApFmuPztV8gCj2L0/PJdSgEKn3J8N2QQgoeaLvu5Z9NEAxPqeXwtWQcBz2N1fDNeysFJHfI8N2QQAoUXrTp66hWFApGn+PytV8gCj2L0/PJdSgFK3zJ8N2QQgoeaLvu5Z9NEAxPpuHvxGklEwdBlM3vzW0rEzQ7stn1wGP/AP2gYuAyB3YAAAAASUVORK0=',
  
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
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzY0YmEyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkI8L3RleHQ+PC9zdmc+',
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
  audioIntroUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAfBz2L0/PJdSgFKn3J8N2QQgoeaLvu5Z9NEAxPqeXwtWQcBz2N1fDMeywFJHfA8N2QQAoUXrTp66hWFApFmuPztV8gCj2L0/PJdSgEKn3J8N2QQgoeaLvu5Z9NEAxPqeXwtWQcBz2N1fDNeysFJHfI8N2QQAoUXrTp66hWFApGn+PytV8gCj2L0/PJdSgFK3zJ8N2QQgoeaLvu5Z9NEAxPpuHvxGklEwdBlM3vzW0rEzQ7stn1wGP/AP2gYuAyB3YAAAAASUVORK0=',
  height: 158,
  gender: 'female',
  bodyType: 'Petite',
  ethnicity: 'Caucasian',
  workout: 'Sometimes',
  pets: 'No pets',
  drinking: 'Rarely',
  smoking: 'Never',
  relationshipGoal: 'Casual dating',
  lookingFor: 'Fun and friendship',
  bio: 'Creative soul with a love for art and music. Always exploring new galleries and concerts.',
  location: 'New York, NY',
  occupation: 'Graphic Designer',
  education: 'Art Institute',
  interests: ['Art', 'Music', 'Design', 'Photography', 'Coffee'],
  distance: 1.2,
  photos: [
    {
      photoID: 4,
      userID: 3,
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjdhZTYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkM8L3RleHQ+PC9zdmc+',
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
            <Box sx={{ height: '700px' }}>
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
            <Box sx={{ height: '700px' }}>
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
            <Box sx={{ height: '500px' }}>
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