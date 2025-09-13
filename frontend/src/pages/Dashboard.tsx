import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Search,
  Favorite,
  Chat,
  Person,
  TrendingUp,
  LocationOn,
  FavoriteBorder,
  Close,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data for user browsing
  const suggestedUsers = [
    {
      id: 1,
      name: 'Emma',
      age: 25,
      location: '2 km away',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      interests: ['Photography', 'Travel', 'Music'],
      bio: 'Adventure seeker, coffee lover ☕',
    },
    {
      id: 2,
      name: 'Alex',
      age: 28,
      location: '5 km away',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      interests: ['Fitness', 'Cooking', 'Movies'],
      bio: 'Gym enthusiast and foodie 🍕',
    },
    {
      id: 3,
      name: 'Sofia',
      age: 23,
      location: '1 km away',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      interests: ['Art', 'Books', 'Yoga'],
      bio: 'Artist and book worm 📚',
    },
  ];

  const quickActions = [
    {
      title: 'Discover People',
      description: 'Find new connections and potential matches',
      icon: <Search fontSize="large" />,
      action: () => navigate('/discover'),
      color: '#e91e63',
    },
    {
      title: 'View Matches',
      description: 'See your mutual likes and start conversations',
      icon: <Favorite fontSize="large" />,
      action: () => navigate('/matches'),
      color: '#ff4081',
    },
    {
      title: 'Messages',
      description: 'Chat with your matches and build connections',
      icon: <Chat fontSize="large" />,
      action: () => navigate('/messages'),
      color: '#9c27b0',
    },
    {
      title: 'Edit Profile',
      description: 'Update your profile to attract better matches',
      icon: <Person fontSize="large" />,
      action: () => navigate('/profile'),
      color: '#673ab7',
    },
  ];

  const handleLike = (userId: number) => {
    console.log('Liked user:', userId);
    // Add like functionality here
  };

  const handlePass = (userId: number) => {
    console.log('Passed user:', userId);
    // Add pass functionality here
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome back, {user?.username}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ready to find your perfect match? Let's get started!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            Quick Actions
          </Typography>
        </Grid>
        
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={action.action}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    color: action.color, 
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" variant="outlined">
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* User Browsing Section */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2">
              People Near You
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Search />}
              onClick={() => navigate('/discover')}
            >
              See All
            </Button>
          </Box>
        </Grid>

        {suggestedUsers.map((person) => (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <Card 
              sx={{ 
                height: '100%',
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              {/* Profile Image */}
              <Box
                sx={{
                  height: 300,
                  backgroundImage: `url(${person.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                {/* Action buttons overlay */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 2,
                }}>
                  <IconButton
                    onClick={() => handlePass(person.id)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Close />
                  </IconButton>
                  <IconButton
                    onClick={() => handleLike(person.id)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <FavoriteBorder />
                  </IconButton>
                </Box>
              </Box>

              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h3">
                    {person.name}, {person.age}
                  </Typography>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {person.location}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {person.bio}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {person.interests.slice(0, 2).map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                  {person.interests.length > 2 && (
                    <Chip
                      label={`+${person.interests.length - 2}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Stats Section */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Your Activity
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              0
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Profile Views
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Favorite sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              0
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Matches
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Chat sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              0
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Conversations
            </Typography>
          </Paper>
        </Grid>

        {/* Getting Started Tips */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              💡 Tips to Get Started
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Complete your profile to attract better matches and start discovering people in your area!
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/profile')}
                startIcon={<Person />}
              >
                Complete Profile
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/discover')}
                startIcon={<Search />}
              >
                Start Discovering
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;