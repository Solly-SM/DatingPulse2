import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { datingService } from '../services/datingService';
import { DiscoverUser } from '../types/Dating';
import MiniProfile from '../components/MiniProfile';

function Likes() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [likedUsers, setLikedUsers] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<DiscoverUser | null>(null);

  useEffect(() => {
    if (user?.userID) {
      loadLikedUsers();
    }
  }, [user?.userID]);

  const loadLikedUsers = async () => {
    if (!user?.userID) return;
    
    try {
      const usersData = await datingService.getReceivedLikes(user.userID);
      setLikedUsers(usersData);
    } catch (err: any) {
      setError('Failed to load users who liked you');
      console.error('Error loading liked users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (likedUser: DiscoverUser) => {
    try {
      const result = await datingService.likeUser(likedUser.userID);
      if (result.isMatch) {
        // Show match notification or navigate to match
        console.log('It\'s a match! 🎉');
      }
      // Remove from the list or mark as matched
      setLikedUsers(prev => prev.filter(user => user.userID !== likedUser.userID));
    } catch (err) {
      console.error('Failed to like user back:', err);
    }
  };

  const handlePass = async (passedUser: DiscoverUser) => {
    try {
      await datingService.passUser(passedUser.userID);
      // Remove from the list
      setLikedUsers(prev => prev.filter(user => user.userID !== passedUser.userID));
    } catch (err) {
      console.error('Failed to pass user:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading users who liked you...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '1400px', 
      mx: 'auto', 
      p: { xs: 2, sm: 3, md: 4 },
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Favorite color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            People Who Liked You
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {likedUsers.length > 0 
            ? `${likedUsers.length} ${likedUsers.length === 1 ? 'person has' : 'people have'} liked you! Like them back to create a match.`
            : 'No one has liked you yet. Keep exploring to meet new people!'
          }
        </Typography>
      </Paper>

      {likedUsers.length === 0 ? (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        }}>
          <FavoriteBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No likes yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep swiping and updating your profile to get more likes!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* User Cards */}
          <Grid item xs={12} md={selectedUser ? 8 : 12}>
            <Grid container spacing={3}>
              {likedUsers.map((likedUser) => (
                <Grid item xs={12} sm={6} lg={selectedUser ? 6 : 4} key={likedUser.userID}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => setSelectedUser(selectedUser?.userID === likedUser.userID ? null : likedUser)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={likedUser.photos?.[0]?.url}
                        sx={{ 
                          width: '100%', 
                          height: 200, 
                          borderRadius: '16px 16px 0 0',
                        }}
                      >
                        {likedUser.firstName?.[0] || likedUser.username?.[0]}
                      </Avatar>
                      <Chip
                        icon={<Favorite />}
                        label="Liked You"
                        color="secondary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: 'rgba(255, 20, 147, 0.9)',
                          color: 'white',
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {likedUser.firstName} {likedUser.lastName || ''}
                        {likedUser.age && `, ${likedUser.age}`}
                      </Typography>
                      
                      {likedUser.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {likedUser.location}
                          </Typography>
                        </Box>
                      )}

                      {likedUser.bio && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {likedUser.bio}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Favorite />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeBack(likedUser);
                          }}
                          sx={{ flex: 1 }}
                        >
                          Like Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePass(likedUser);
                          }}
                          sx={{ flex: 1 }}
                        >
                          Pass
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Selected User Profile */}
          {selectedUser && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: '16px',
                height: 'fit-content',
                position: 'sticky',
                top: 20,
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Profile Details
                </Typography>
                <MiniProfile 
                  user={selectedUser} 
                  showPhoto={true} 
                  variant="preview"
                  maxHeight="70vh"
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default Likes;