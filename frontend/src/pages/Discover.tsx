import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  Stack,
  Fab,
  LinearProgress,
  Paper,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Favorite,
  Close,
  LocationOn,
  Undo,
  Star,
  Settings,
  FilterList,
} from '@mui/icons-material';
import { datingService } from '../services/datingService';
import { DiscoverUser } from '../types/Dating';
import PhotoViewer from '../components/PhotoViewer';
import ProfileDetail from '../components/ProfileDetail';

function Discover() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState<'like' | 'pass' | 'superlike' | null>(null);
  const [animating, setAnimating] = useState(false);
  const [actionHistory, setActionHistory] = useState<Array<{ userID: number; action: string }>>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const discoverUsers = await datingService.getDiscoverUsers(0, 10);
      setUsers(discoverUsers);
    } catch (err: any) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = users[currentIndex];
  const progress = users.length > 0 ? ((currentIndex) / users.length) * 100 : 0;

  const handleLike = async () => {
    if (currentIndex >= users.length || animating) return;
    
    setAnimating(true);
    setLastAction('like');
    
    try {
      const result = await datingService.likeUser(currentUser.userID);
      setActionHistory(prev => [...prev, { userID: currentUser.userID, action: 'like' }]);
      
      if (result.isMatch) {
        // Show match notification
        console.log('It\'s a match! 🎉');
      }
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
    
    try {
      await datingService.passUser(currentUser.userID);
      setActionHistory(prev => [...prev, { userID: currentUser.userID, action: 'pass' }]);
    } catch (err) {
      console.error('Failed to pass user:', err);
    }
    
    setTimeout(() => {
      nextUser();
      setAnimating(false);
    }, 300);
  };

  const handleSuperLike = async () => {
    if (currentIndex >= users.length || animating) return;
    
    setAnimating(true);
    setLastAction('superlike');
    
    try {
      const result = await datingService.superLikeUser(currentUser.userID);
      setActionHistory(prev => [...prev, { userID: currentUser.userID, action: 'superlike' }]);
      
      if (result.isMatch) {
        console.log('Super Like Match! 🌟');
      }
    } catch (err) {
      console.error('Failed to super like user:', err);
    }
    
    setTimeout(() => {
      nextUser();
      setAnimating(false);
    }, 300);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && actionHistory.length > 0) {
      setCurrentIndex(prev => prev - 1);
      setActionHistory(prev => prev.slice(0, -1));
      setLastAction(null);
    }
  };

  const nextUser = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Load more users when reaching the end
      loadMoreUsers();
    }
  };

  const loadMoreUsers = async () => {
    try {
      const moreUsers = await datingService.getDiscoverUsers(users.length, 10);
      setUsers(prev => [...prev, ...moreUsers]);
    } catch (err) {
      console.error('Failed to load more users:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" gutterBottom>
            Finding amazing people near you...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
          <Button onClick={loadUsers} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Box textAlign="center" mt={4}>
          <Typography variant="h5" gutterBottom>
            No more users in your area
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Check back later for new profiles!
          </Typography>
          <Button variant="contained" onClick={loadUsers} sx={{ mt: 2 }}>
            Refresh
          </Button>
        </Box>
      </Box>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <Box sx={{ p: 4 }}>
        <Box textAlign="center" mt={4}>
          <Typography variant="h5" gutterBottom>
            You've seen everyone!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Come back later to discover new people in your area.
          </Typography>
          <Button variant="contained" onClick={() => {
            setCurrentIndex(0);
            loadUsers();
          }} sx={{ mt: 2 }}>
            Start Over
          </Button>
        </Box>
      </Box>
    );
  }

  // Mobile layout - fall back to single column like before
  if (isMobile) {
    return (
      <Box sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Discover
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<LocationOn />} 
              label={`${users.length - currentIndex} nearby`}
              variant="outlined"
              size="small"
            />
            <IconButton size="small">
              <FilterList />
            </IconButton>
            <IconButton size="small">
              <Settings />
            </IconButton>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 4, borderRadius: 2 }}
        />
        
        {/* Card Stack with Action Buttons */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          {/* Photo Stack Container - reduced height to make space for action buttons */}
          <Box sx={{ position: 'relative', minHeight: 500, mb: 2 }}>
            {/* Next card (background) */}
            {currentIndex + 1 < users.length && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  right: 4,
                  bottom: 4,
                  zIndex: 1,
                  opacity: 0.5,
                  transform: 'scale(0.95)',
                }}
              >
                <PhotoViewer
                  user={users[currentIndex + 1]}
                  onLike={() => {}}
                  onPass={() => {}}
                  onSuperLike={() => {}}
                  isAnimating={false}
                  lastAction={null}
                />
              </Box>
            )}
            
            {/* Current card */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <PhotoViewer
                user={currentUser}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuperLike}
                isAnimating={animating}
                lastAction={lastAction}
              />
            </Box>
          </Box>

          {/* Action Buttons - now directly below photos */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              borderRadius: 3,
              backgroundColor: 'background.paper',
            }}
          >
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Fab
              size="medium"
              onClick={handleUndo}
              disabled={currentIndex === 0 || animating}
              sx={{ 
                backgroundColor: 'warning.light',
                '&:hover': { backgroundColor: 'warning.main' },
                '&:disabled': { backgroundColor: 'grey.200' },
              }}
            >
              <Undo />
            </Fab>
            
            <Fab
              size="large"
              onClick={handlePass}
              disabled={animating}
              sx={{ 
                backgroundColor: 'error.light',
                '&:hover': { backgroundColor: 'error.main' },
                color: 'white',
              }}
            >
              <Close />
            </Fab>
            
            <Fab
              size="medium"
              onClick={handleSuperLike}
              disabled={animating}
              sx={{ 
                backgroundColor: 'info.light',
                '&:hover': { backgroundColor: 'info.main' },
                color: 'white',
              }}
            >
              <Star />
            </Fab>
            
            <Fab
              size="large"
              onClick={handleLike}
              disabled={animating}
              sx={{ 
                backgroundColor: 'success.light',
                '&:hover': { backgroundColor: 'success.main' },
                color: 'white',
              }}
            >
              <Favorite />
            </Fab>
          </Stack>
          
          <Typography 
            variant="caption" 
            display="block" 
            textAlign="center" 
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Swipe or drag • Tap for Super Like
          </Typography>
        </Paper>
        </Box>
      </Box>
    );
  }

  // Desktop three-column layout
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 3, pt: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Discover
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            icon={<LocationOn />} 
            label={`${users.length - currentIndex} nearby`}
            variant="outlined"
            size="small"
          />
          <IconButton size="small">
            <FilterList />
          </IconButton>
          <IconButton size="small">
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* Progress bar */}
      <Box sx={{ px: 3, mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 4, borderRadius: 2 }}
        />
      </Box>
      
      {/* Three-column layout */}
      <Grid container spacing={3} sx={{ px: 3, height: 'calc(100vh - 200px)' }}>
        {/* Middle column - Photos with Action Buttons (slightly bigger) */}
        <Grid item xs={5.5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Photo Stack Container - reduced height to make space for action buttons */}
            <Box sx={{ position: 'relative', flexGrow: 1, mb: 2, minHeight: 0 }}>
              {/* Next card (background) */}
              {currentIndex + 1 < users.length && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    right: 4,
                    bottom: 4,
                    zIndex: 1,
                    opacity: 0.5,
                    transform: 'scale(0.95)',
                  }}
                >
                  <PhotoViewer
                    user={users[currentIndex + 1]}
                    onLike={() => {}}
                    onPass={() => {}}
                    onSuperLike={() => {}}
                    isAnimating={false}
                    lastAction={null}
                  />
                </Box>
              )}
              
              {/* Current card */}
              <Box sx={{ position: 'relative', zIndex: 2, height: '100%' }}>
                <PhotoViewer
                  user={currentUser}
                  onLike={handleLike}
                  onPass={handlePass}
                  onSuperLike={handleSuperLike}
                  isAnimating={animating}
                  lastAction={lastAction}
                />
              </Box>
            </Box>

            {/* Action Buttons - now directly below photos */}
            <Paper 
              elevation={4}
              sx={{ 
                p: 2, 
                borderRadius: 3,
                backgroundColor: 'background.paper',
                flexShrink: 0,
              }}
            >
              <Stack direction="row" justifyContent="center" spacing={2}>
                <Fab
                  size="medium"
                  onClick={handleUndo}
                  disabled={currentIndex === 0 || animating}
                  sx={{ 
                    backgroundColor: 'warning.light',
                    '&:hover': { backgroundColor: 'warning.main' },
                    '&:disabled': { backgroundColor: 'grey.200' },
                  }}
                >
                  <Undo />
                </Fab>
                
                <Fab
                  size="large"
                  onClick={handlePass}
                  disabled={animating}
                  sx={{ 
                    backgroundColor: 'error.light',
                    '&:hover': { backgroundColor: 'error.main' },
                    color: 'white',
                  }}
                >
                  <Close />
                </Fab>
                
                <Fab
                  size="medium"
                  onClick={handleSuperLike}
                  disabled={animating}
                  sx={{ 
                    backgroundColor: 'info.light',
                    '&:hover': { backgroundColor: 'info.main' },
                    color: 'white',
                  }}
                >
                  <Star />
                </Fab>
                
                <Fab
                  size="large"
                  onClick={handleLike}
                  disabled={animating}
                  sx={{ 
                    backgroundColor: 'success.light',
                    '&:hover': { backgroundColor: 'success.main' },
                    color: 'white',
                  }}
                >
                  <Favorite />
                </Fab>
              </Stack>
              
              <Typography 
                variant="caption" 
                display="block" 
                textAlign="center" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Swipe or drag • Tap for Super Like
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* Right column - Profile details */}
        <Grid item xs={3.25}>
          <ProfileDetail user={currentUser} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Discover;