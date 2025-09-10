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
} from '@mui/material';
import {
  Search,
  Favorite,
  Chat,
  Person,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <Container maxWidth="lg">
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
    </Container>
  );
}

export default Dashboard;