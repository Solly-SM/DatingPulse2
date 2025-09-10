import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  Button,
  Avatar,
  Box,
  Chip,
  Alert,
  CardMedia,
  Stack,
  Fab,
  LinearProgress,
  CardContent,
} from '@mui/material';
import {
  Favorite,
  Close,
  LocationOn,
  Cake,
  School,
  Work,
  Height,
  Undo,
  Star,
} from '@mui/icons-material';
import { datingService } from '../services/datingService';

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
  education?: string;
  occupation?: string;
  height?: number;
  distance?: number;
}

function Discover() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState<'like' | 'pass' | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Create mock users with more realistic data for demo
      const mockUsers: DiscoverUser[] = [
        {
          userID: 1,
          username: 'sarah_jones',
          firstName: 'Sarah',
          lastName: 'Jones',
          age: 25,
          bio: "Adventure seeker and coffee enthusiast ☕ Love hiking, photography, and trying new restaurants. Looking for someone to explore the world with! 🌍",
          location: 'Cape Town, 5km away',
          interests: ['Photography', 'Hiking', 'Coffee', 'Travel', 'Art'],
          photos: [{ url: '', isPrimary: true }],
          education: 'University of Cape Town',
          occupation: 'Graphic Designer',
          height: 165,
          distance: 5,
        },
        {
          userID: 2,
          username: 'mike_tech',
          firstName: 'Michael',
          lastName: 'Chen',
          age: 28,
          bio: "Tech entrepreneur by day, chef by night 👨‍💻👨‍🍳 Building the future while perfecting my pasta recipes. Swipe right if you love good food and great conversations!",
          location: 'Johannesburg, 2km away',
          interests: ['Technology', 'Cooking', 'Fitness', 'Music', 'Startups'],
          photos: [{ url: '', isPrimary: true }],
          education: 'MIT',
          occupation: 'Software Engineer',
          height: 180,
          distance: 2,
        },
        {
          userID: 3,
          username: 'emma_artist',
          firstName: 'Emma',
          lastName: 'Williams',
          age: 26,
          bio: "Artist with a passion for life! 🎨 Creating beauty in the world through painting and dance. Looking for someone who appreciates art, culture, and spontaneous adventures.",
          location: 'Durban, 8km away',
          interests: ['Art', 'Dancing', 'Movies', 'Wine', 'Culture'],
          photos: [{ url: '', isPrimary: true }],
          education: 'Rhodes University',
          occupation: 'Artist',
          height: 158,
          distance: 8,
        },
        {
          userID: 4,
          username: 'alex_fit',
          firstName: 'Alex',
          lastName: 'Thompson',
          age: 30,
          bio: "Fitness trainer and outdoor enthusiast 💪 When I'm not at the gym, you'll find me rock climbing, surfing, or planning my next adventure. Let's stay active together!",
          location: 'Cape Town, 3km away',
          interests: ['Fitness', 'Rock Climbing', 'Surfing', 'Nature', 'Health'],
          photos: [{ url: '', isPrimary: true }],
          education: 'Stellenbosch University',
          occupation: 'Personal Trainer',
          height: 175,
          distance: 3,
        },
      ];
      setUsers(mockUsers);
    } catch (err: any) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= users.length || animating) return;
    
    setAnimating(true);
    setLastAction('like');
    const currentUser = users[currentIndex];
    
    try {
      await datingService.likeUser(currentUser.userID);
    } catch (err) {
      console.error('Failed to like user:', err);
    }
    
    setTimeout(() => {
      nextUser();
      setAnimating(false);
    }, 300);
  };

  const handlePass = async () => {
    if (currentIndex >= users.length || animating) return;
    
    setAnimating(true);
    setLastAction('pass');
    const currentUser = users[currentIndex];
    
    try {
      await datingService.passUser(currentUser.userID);
    } catch (err) {
      console.error('Failed to pass user:', err);
    }
    
    setTimeout(() => {
      nextUser();
      setAnimating(false);
    }, 300);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setLastAction(null);
    }
  };

  const nextUser = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Finding amazing people near you...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
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
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🎉 That's everyone!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You've seen all the amazing people in your area
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Check back later for more potential matches, or expand your search radius in settings.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => {
              setCurrentIndex(0);
              loadUsers();
            }}
            sx={{ mr: 1 }}
          >
            Show Again
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => window.location.href = '/matches'}
          >
            View Matches
          </Button>
        </Box>
      </Container>
    );
  }

  const currentUser = users[currentIndex];
  const progress = ((currentIndex) / users.length) * 100;

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Discover
        </Typography>
        <Chip 
          icon={<LocationOn />} 
          label={`${users.length - currentIndex} nearby`}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Progress bar */}
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ mb: 2, height: 4, borderRadius: 2 }}
      />
      
      {/* Main Card */}
      <Card 
        sx={{ 
          position: 'relative',
          minHeight: 600,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: animating ? (lastAction === 'like' ? 'rotate(10deg) translateX(100px)' : 'rotate(-10deg) translateX(-100px)') : 'none',
          transition: 'transform 0.3s ease-in-out',
          opacity: animating ? 0.7 : 1,
        }}
      >
        {/* Photo Section */}
        <CardMedia
          sx={{
            height: 400,
            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            sx={{ 
              width: 200, 
              height: 200,
              border: '4px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            src={currentUser.photos?.find(p => p.isPrimary)?.url}
          >
            <Typography variant="h1">
              {currentUser.firstName?.[0] || currentUser.username[0]}
            </Typography>
          </Avatar>
          
          {/* Age badge */}
          <Chip
            icon={<Cake />}
            label={currentUser.age}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255,255,255,0.9)',
              fontWeight: 'bold',
            }}
          />
          
          {/* Distance badge */}
          <Chip
            icon={<LocationOn />}
            label={currentUser.distance ? `${currentUser.distance}km away` : currentUser.location}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          />
        </CardMedia>

        <CardContent sx={{ pb: 1 }}>
          {/* Name and Age */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            {currentUser.firstName || currentUser.username}
            {currentUser.age && (
              <Typography component="span" variant="h5" color="text.secondary" sx={{ ml: 1 }}>
                {currentUser.age}
              </Typography>
            )}
          </Typography>

          {/* Info chips */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {currentUser.education && (
              <Chip
                icon={<School />}
                label={currentUser.education}
                size="small"
                variant="outlined"
              />
            )}
            {currentUser.occupation && (
              <Chip
                icon={<Work />}
                label={currentUser.occupation}
                size="small"
                variant="outlined"
              />
            )}
            {currentUser.height && (
              <Chip
                icon={<Height />}
                label={`${currentUser.height}cm`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>

          {/* Bio */}
          {currentUser.bio && (
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
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
                  sx={{
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, gap: 2 }}>
        {/* Undo Button */}
        <Fab
          size="medium"
          onClick={handleUndo}
          disabled={currentIndex === 0 || animating}
          sx={{
            backgroundColor: 'grey.200',
            '&:hover': { backgroundColor: 'grey.300' },
            '&:disabled': { backgroundColor: 'grey.100' },
          }}
        >
          <Undo />
        </Fab>

        {/* Pass Button */}
        <Fab
          size="large"
          onClick={handlePass}
          disabled={animating}
          sx={{
            backgroundColor: 'error.light',
            color: 'white',
            '&:hover': { backgroundColor: 'error.main' },
            width: 64,
            height: 64,
          }}
        >
          <Close fontSize="large" />
        </Fab>

        {/* Super Like Button */}
        <Fab
          size="medium"
          disabled={animating}
          sx={{
            backgroundColor: 'info.light',
            color: 'white',
            '&:hover': { backgroundColor: 'info.main' },
          }}
        >
          <Star />
        </Fab>

        {/* Like Button */}
        <Fab
          size="large"
          onClick={handleLike}
          disabled={animating}
          sx={{
            backgroundColor: 'success.light',
            color: 'white',
            '&:hover': { backgroundColor: 'success.main' },
            width: 64,
            height: 64,
          }}
        >
          <Favorite fontSize="large" />
        </Fab>
      </Box>

      {/* Swipe Instructions */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Swipe left to pass • Swipe right to like
        </Typography>
      </Box>
    </Container>
  );
}

export default Discover;