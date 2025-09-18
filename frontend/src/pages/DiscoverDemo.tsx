import React, { useState } from 'react';
import {
  Typography,
  Box,
  Chip,
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
import { DiscoverUser } from '../types/Dating';
import PhotoViewer from '../components/PhotoViewer';
import MiniProfile from '../components/MiniProfile';

// Mock user data for demo
const mockUsers: DiscoverUser[] = [
  {
    userID: 1,
    username: "sarah_johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    age: 25,
    bio: "Love hiking, photography, and trying new coffee shops. Looking for someone who shares my passion for adventure and good conversations.",
    photos: [
      { photoID: 1, userID: 1, url: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=600&fit=crop&crop=face", isPrimary: true, uploadedAt: "2024-01-01" }
    ],
    distance: 2.5,
    education: "University of California",
    occupation: "Graphic Designer",
    height: 165,
    interests: ["Photography", "Hiking", "Coffee", "Travel", "Art", "Music"],
    verified: true
  },
  {
    userID: 2,
    username: "emma_watson",
    firstName: "Emma",
    lastName: "Watson",
    age: 28,
    bio: "Yoga instructor and book lover. Always up for outdoor adventures or cozy nights in with a good novel.",
    photos: [
      { photoID: 2, userID: 2, url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face", isPrimary: true, uploadedAt: "2024-01-01" }
    ],
    distance: 1.8,
    education: "Stanford University",
    occupation: "Yoga Instructor",
    height: 170,
    interests: ["Yoga", "Reading", "Nature", "Meditation", "Cooking"],
    verified: true
  }
];

function DiscoverDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lastAction, setLastAction] = useState<'like' | 'pass' | 'superlike' | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const currentUser = mockUsers[currentIndex];
  const progress = ((currentIndex) / mockUsers.length) * 100;

  const handleLike = () => {
    if (animating) return;
    setAnimating(true);
    setLastAction('like');
    
    setTimeout(() => {
      nextUser();
      setAnimating(false);
    }, 300);
  };

  const handlePass = () => {
    if (animating) return;
    setAnimating(true);
    setLastAction('pass');
    
    setTimeout(() => {
      nextUser();
      setAnimating(false);
    }, 300);
  };

  const handleSuperLike = () => {
    if (animating) return;
    setAnimating(true);
    setLastAction('superlike');
    
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
    if (currentIndex < mockUsers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reset to beginning for demo
      setCurrentIndex(0);
    }
  };

  // Mobile layout - fall back to single column like before
  if (isMobile) {
    return (
      <Box sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Discover (Demo)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<LocationOn />} 
              label={`${mockUsers.length - currentIndex} nearby`}
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
        
        {/* Card Stack */}
        <Box sx={{ position: 'relative', minHeight: 600, mb: 3 }}>
          {/* Next card (background) */}
          {currentIndex + 1 < mockUsers.length && (
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
                user={mockUsers[currentIndex + 1]}
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

        {/* Action Buttons */}
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
    );
  }

  // Desktop three-column layout
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 3, pt: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Discover (Demo)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            icon={<LocationOn />} 
            label={`${mockUsers.length - currentIndex} nearby`}
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
        {/* Middle column - Photos (slightly bigger) */}
        <Grid item xs={5.5}>
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* Next card (background) */}
            {currentIndex + 1 < mockUsers.length && (
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
                  user={mockUsers[currentIndex + 1]}
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
        </Grid>

        {/* Right column - Mini Profile details */}
        <Grid item xs={3.25}>
          <MiniProfile user={currentUser} />
        </Grid>
      </Grid>

      {/* Action Buttons - Fixed at bottom */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: '50%', 
        transform: 'translateX(-50%)',
        p: 3 
      }}>
        <Paper 
          elevation={4}
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

export default DiscoverDemo;