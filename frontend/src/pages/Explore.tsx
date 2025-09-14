import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Alert,
  LinearProgress,
  Fab,
  IconButton,
} from '@mui/material';
import {
  FilterList,
  Search,
  FavoriteBorder,
  Home as HomeIcon,
  ChildCare,
  School,
  Work,
  DirectionsRun,
  Restaurant,
  MusicNote,
  Favorite,
  Close,
  Star,
  Undo,
  LocationOn,
  Settings,
  ArrowBack,
  Pets,
  LocalBar,
  SportsEsports,
  Psychology,
  Nature,
  AutoAwesome,
} from '@mui/icons-material';
import { datingService } from '../services/datingService';
import { DiscoverUser } from '../types/Dating';
import ProfileView from '../components/ProfileView';
import PhotoViewer from '../components/PhotoViewer';
import PulseLogo from '../components/PulseLogo';
import PulseLoader from '../components/PulseLoader';

// Category definition with icon and description
interface ExploreCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  filterCriteria: {
    relationshipGoal?: string;
    lifestyle?: string;
    interests?: string[];
    ageRange?: { min: number; max: number };
  };
}

const exploreCategories: ExploreCategory[] = [
  {
    id: 'serious-dating',
    title: 'Serious Dating',
    description: 'People looking for long-term relationships',
    icon: <FavoriteBorder sx={{ fontSize: 40 }} />,
    color: '#e91e63',
    filterCriteria: {
      relationshipGoal: 'Long-term relationship',
    },
  },
  {
    id: 'casual-fun',
    title: 'Casual & Fun',
    description: 'Relaxed dating and new connections',
    icon: <HomeIcon sx={{ fontSize: 40 }} />,
    color: '#ff4081',
    filterCriteria: {
      relationshipGoal: 'Casual dating',
    },
  },
  {
    id: 'fitness-active',
    title: 'Fitness & Active',
    description: 'Sports enthusiasts and fitness lovers',
    icon: <DirectionsRun sx={{ fontSize: 40 }} />,
    color: '#4caf50',
    filterCriteria: {
      lifestyle: 'Active/Fitness focused',
      interests: ['Sports', 'Hiking', 'Yoga'],
    },
  },
  {
    id: 'career-focused',
    title: 'Career Focused',
    description: 'Ambitious professionals and entrepreneurs',
    icon: <Work sx={{ fontSize: 40 }} />,
    color: '#2196f3',
    filterCriteria: {
      lifestyle: 'Career focused',
      interests: ['Business', 'Technology'],
    },
  },
  {
    id: 'creative-artistic',
    title: 'Creative & Artistic',
    description: 'Artists, musicians, and creative minds',
    icon: <MusicNote sx={{ fontSize: 40 }} />,
    color: '#9c27b0',
    filterCriteria: {
      lifestyle: 'Artistic/Creative',
      interests: ['Art', 'Music', 'Photography'],
    },
  },
  {
    id: 'foodie-culture',
    title: 'Foodie & Culture',
    description: 'Food lovers and culture enthusiasts',
    icon: <Restaurant sx={{ fontSize: 40 }} />,
    color: '#ff9800',
    filterCriteria: {
      interests: ['Cooking', 'Travel', 'Art'],
    },
  },
  {
    id: 'family-oriented',
    title: 'Family Oriented',
    description: 'People who want or have children',
    icon: <ChildCare sx={{ fontSize: 40 }} />,
    color: '#795548',
    filterCriteria: {
      relationshipGoal: 'Marriage',
    },
  },
  {
    id: 'intellectual',
    title: 'Intellectual',
    description: 'Book lovers and deep thinkers',
    icon: <School sx={{ fontSize: 40 }} />,
    color: '#607d8b',
    filterCriteria: {
      interests: ['Reading', 'Technology', 'Business'],
    },
  },
  {
    id: 'pet-lovers',
    title: 'Pet Lovers',
    description: 'Dog and cat enthusiasts',
    icon: <Pets sx={{ fontSize: 40 }} />,
    color: '#8bc34a',
    filterCriteria: {
      interests: ['Pets', 'Animals', 'Dog Walking'],
    },
  },
  {
    id: 'nightlife-social',
    title: 'Nightlife & Social',
    description: 'Party lovers and social butterflies',
    icon: <LocalBar sx={{ fontSize: 40 }} />,
    color: '#ff5722',
    filterCriteria: {
      lifestyle: 'Social/Party focused',
      interests: ['Nightlife', 'Dancing', 'Socializing'],
    },
  },
  {
    id: 'gaming-tech',
    title: 'Gaming & Tech',
    description: 'Gamers and tech enthusiasts',
    icon: <SportsEsports sx={{ fontSize: 40 }} />,
    color: '#3f51b5',
    filterCriteria: {
      interests: ['Gaming', 'Technology', 'Esports'],
    },
  },
  {
    id: 'mindful-spiritual',
    title: 'Mindful & Spiritual',
    description: 'Meditation and spiritual growth seekers',
    icon: <Psychology sx={{ fontSize: 40 }} />,
    color: '#9c27b0',
    filterCriteria: {
      lifestyle: 'Mindful/Spiritual',
      interests: ['Meditation', 'Yoga', 'Spirituality'],
    },
  },
  {
    id: 'eco-conscious',
    title: 'Eco-Conscious',
    description: 'Environmentally aware individuals',
    icon: <Nature sx={{ fontSize: 40 }} />,
    color: '#4caf50',
    filterCriteria: {
      lifestyle: 'Eco-conscious',
      interests: ['Environment', 'Sustainability', 'Nature'],
    },
  },
  {
    id: 'luxury-lifestyle',
    title: 'Luxury Lifestyle',
    description: 'Fine dining and luxury experiences',
    icon: <AutoAwesome sx={{ fontSize: 40 }} />,
    color: '#ffd700',
    filterCriteria: {
      lifestyle: 'Luxury focused',
      interests: ['Fine Dining', 'Luxury Travel', 'Fashion'],
    },
  },
];

function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory | null>(null);
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState<'like' | 'pass' | 'superlike' | null>(null);
  const [animating, setAnimating] = useState(false);
  const [actionHistory, setActionHistory] = useState<Array<{ userID: number; action: string }>>([]);

  const loadUsersForCategory = async (category: ExploreCategory) => {
    setLoading(true);
    setError('');
    setCurrentIndex(0);
    setUsers([]);
    
    try {
      // Use the actual API method which returns DiscoverUser[] directly
      const response = await datingService.getDiscoverUsers(0, 20);
      setUsers(response || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users for this category');
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: ExploreCategory) => {
    setSelectedCategory(category);
    loadUsersForCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setUsers([]);
    setCurrentIndex(0);
    setError('');
  };

  const currentUser = users[currentIndex];
  const progress = users.length > 0 ? ((currentIndex) / users.length) * 100 : 0;

  const nextUser = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= users.length || animating) return;
    
    setAnimating(true);
    setLastAction('like');
    
    try {
      const result = await datingService.likeUser(currentUser.userID);
      setActionHistory(prev => [...prev, { userID: currentUser.userID, action: 'like' }]);
      
      if (result.isMatch) {
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
        console.log('Super match! 🌟');
      }
    } catch (err) {
      console.error('Failed to super like user:', err);
    }
    
    setTimeout(() => {
      nextUser();
      setAnimating(false);
    }, 300);
  };

  const handleUndo = async () => {
    if (currentIndex === 0 || animating || actionHistory.length === 0) return;
    
    // For now, just go back one user without API call since undoAction doesn't exist
    setActionHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <PulseLoader visible={true} size={80} />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          Finding amazing people in {selectedCategory?.title}...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
          <Button onClick={handleBackToCategories} sx={{ ml: 2 }}>
            Back to Categories
          </Button>
        </Alert>
      </Box>
    );
  }

  // Category Selection View
  if (!selectedCategory) {
    return (
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <PulseLogo sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Explore
          </Typography>
        </Box>

        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Choose what you're looking for today ✨
        </Typography>

        {/* Categories Grid */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Grid container spacing={3}>
            {exploreCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 32px rgba(0,0,0,0.15)`,
                      border: `2px solid ${category.color}`,
                    },
                  }}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${category.color}15`,
                        color: category.color,
                        margin: '0 auto 16px auto',
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: category.color }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  // Single User View (similar to Home page)
  if (users.length === 0) {
    return (
      <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={handleBackToCategories}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: selectedCategory.color }}>
            {selectedCategory.title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
          No one in this category right now. Try another category!
        </Typography>
      </Box>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center' }}>
          <IconButton onClick={handleBackToCategories}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: selectedCategory.color }}>
            {selectedCategory.title}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          You've seen everyone in {selectedCategory.title}! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Check back later for new profiles or explore other categories.
        </Typography>
        <Button variant="contained" onClick={handleBackToCategories} sx={{ mt: 2 }}>
          Explore Other Categories
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBackToCategories}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${selectedCategory.color}15`,
              color: selectedCategory.color,
            }}
          >
            {React.cloneElement(selectedCategory.icon as React.ReactElement, { sx: { fontSize: 20 } } as any)}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: selectedCategory.color }}>
            {selectedCategory.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {users.length - currentIndex} left
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 4, borderRadius: 2 }}
        />
      </Box>
      
      {/* Two-column layout - Photos in middle, Profile on right */}
      <Grid container spacing={3} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Middle column - Photos with Action Buttons directly below */}
        <Grid item xs={7} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Photo container */}
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

          {/* Action Buttons - positioned directly below photos with matching width */}
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
        </Grid>

        {/* Right column - Profile details WITHOUT pictures */}
        <Grid item xs={5}>
          <ProfileView user={currentUser} compact={true} hidePhotos={true} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Explore;