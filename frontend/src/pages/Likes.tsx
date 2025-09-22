import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  IconButton,
  Stack,
  Divider,
  Button,
  Alert,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Favorite,
  Star,
  LocationOn,
  School,
  Work,
  AccessTime,
  ArrowBack,
  FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { datingService } from '../services/datingService';
import { ReceivedLike } from '../types/Dating';
import PulseLogo from '../components/PulseLogo';
import PulseLoader from '../components/PulseLoader';
import MiniProfile from '../components/MiniProfile';

interface GroupedLikes {
  [key: string]: ReceivedLike[];
}

const Likes: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [likes, setLikes] = useState<ReceivedLike[]>([]);
  const [groupedLikes, setGroupedLikes] = useState<GroupedLikes>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'likes' | 'super_likes'>('all');
  const [selectedLike, setSelectedLike] = useState<ReceivedLike | null>(null);

  useEffect(() => {
    loadReceivedLikes();
  }, [user]);

  const loadReceivedLikes = async () => {
    if (!user?.userID) return;
    
    setLoading(true);
    setError('');
    
    try {
      const receivedLikes = await datingService.getReceivedLikes(user.userID);
      setLikes(receivedLikes);
      groupLikesByDate(receivedLikes);
    } catch (err: any) {
      setError(err.message || 'Failed to load likes');
      console.error('Failed to load received likes:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupLikesByDate = (likesData: ReceivedLike[]) => {
    const grouped: GroupedLikes = {};
    
    likesData.forEach(like => {
      const date = new Date(like.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo <= 7) {
          dateKey = `${daysAgo} days ago`;
        } else {
          dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(like);
    });
    
    setGroupedLikes(grouped);
  };

  const getFilteredLikes = () => {
    if (filter === 'all') return likes;
    if (filter === 'likes') return likes.filter(like => like.type === 'LIKE');
    if (filter === 'super_likes') return likes.filter(like => like.type === 'SUPER_LIKE');
    return likes;
  };

  const handleLikeBack = async (likedUser: ReceivedLike) => {
    try {
      if (likedUser.type === 'SUPER_LIKE') {
        await datingService.superLikeUser(likedUser.likerID);
      } else {
        await datingService.likeUser(likedUser.likerID);
      }
      // Optionally remove the like from the list or mark as matched
    } catch (err) {
      console.error('Failed to like back:', err);
    }
  };

  const handleLikeSelect = (like: ReceivedLike) => {
    setSelectedLike(like);
  };

  const handleBackToLikes = () => {
    setSelectedLike(null);
  };

  const renderLikeCard = (like: ReceivedLike) => (
    <Card
      key={like.likeID}
      sx={{
        mb: 2,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        ...(selectedLike?.likeID === like.likeID && {
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }),
      }}
      onClick={() => handleLikeSelect(like)}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              like.type === 'SUPER_LIKE' ? (
                <Star sx={{ color: '#FFD700', fontSize: 20 }} />
              ) : null
            }
          >
            <Avatar
              src={like.liker.photos?.[0]?.url}
              sx={{ width: 60, height: 60 }}
            >
              {like.liker.firstName?.[0]}
            </Avatar>
          </Badge>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {like.liker.firstName} {like.liker.lastName}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              {like.liker.age && (
                <Typography variant="body2" color="text.secondary">
                  {like.liker.age}
                </Typography>
              )}
              {like.liker.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14 }} color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {like.liker.location}
                  </Typography>
                </Box>
              )}
            </Stack>
            
            {like.liker.occupation && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Work sx={{ fontSize: 14 }} color="action" />
                <Typography variant="body2" color="text.secondary">
                  {like.liker.occupation}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <AccessTime sx={{ fontSize: 12 }} color="action" />
              <Typography variant="caption" color="text.secondary">
                {new Date(like.createdAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={like.type === 'SUPER_LIKE' ? <Star /> : <Favorite />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card selection when clicking Like Back
              handleLikeBack(like);
            }}
            size="small"
            sx={{
              background: like.type === 'SUPER_LIKE' 
                ? 'linear-gradient(45deg, #FFD700, #FFA500)'
                : 'linear-gradient(45deg, #e91e63, #f06292)',
              '&:hover': {
                background: like.type === 'SUPER_LIKE'
                  ? 'linear-gradient(45deg, #FFA500, #FF8C00)'
                  : 'linear-gradient(45deg, #c51a5a, #e91e63)',
              },
            }}
          >
            Like Back
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <PulseLoader />
      </Box>
    );
  }

  // Mobile layout - stack or single view
  if (isMobile) {
    if (selectedLike) {
      return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleBackToLikes}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6">
              {selectedLike.liker.firstName} {selectedLike.liker.lastName}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <MiniProfile
              user={selectedLike.liker}
              showPhoto={true}
              variant="preview"
            />
          </Box>
        </Box>
      );
    }

    // Full-width and full-height likes list for mobile
    return (
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton onClick={() => navigate('/explore')}>
            <ArrowBack />
          </IconButton>
          <PulseLogo sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Your Likes
          </Typography>
          <Badge badgeContent={likes.length} color="primary" sx={{ ml: 1 }}>
            <Favorite color="primary" />
          </Badge>
        </Box>

        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          People who liked you ❤️
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filter Chips */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ overflowX: 'auto' }}>
            <FilterList color="action" />
            <Chip
              label="All"
              variant={filter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setFilter('all')}
              color="primary"
            />
            <Chip
              label="Likes"
              variant={filter === 'likes' ? 'filled' : 'outlined'}
              onClick={() => setFilter('likes')}
              color="primary"
              icon={<Favorite />}
            />
            <Chip
              label="Super Likes"
              variant={filter === 'super_likes' ? 'filled' : 'outlined'}
              onClick={() => setFilter('super_likes')}
              color="secondary"
              icon={<Star />}
            />
          </Stack>
        </Box>

        {/* Likes Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {likes.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                textAlign: 'center',
              }}
            >
              <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No likes yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep exploring to find your perfect match!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/explore')}
                sx={{ mt: 2 }}
              >
                Start Exploring
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {Object.entries(groupedLikes).map(([dateKey, dateLikes]) => {
                  const filteredDateLikes = dateLikes.filter(like => {
                    if (filter === 'all') return true;
                    if (filter === 'likes') return like.type === 'LIKE';
                    if (filter === 'super_likes') return like.type === 'SUPER_LIKE';
                    return true;
                  });

                  if (filteredDateLikes.length === 0) return null;

                  return (
                    <Box key={dateKey} sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {dateKey}
                        </Typography>
                        <Chip
                          label={filteredDateLikes.length}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {filteredDateLikes.map(renderLikeCard)}
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    );
  }

  // Desktop layout
  if (!selectedLike) {
    // Full-width and full-height likes list when no like is selected
    return (
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton onClick={() => navigate('/explore')}>
            <ArrowBack />
          </IconButton>
          <PulseLogo sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Your Likes
          </Typography>
          <Badge badgeContent={likes.length} color="primary" sx={{ ml: 1 }}>
            <Favorite color="primary" />
          </Badge>
        </Box>

        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          People who liked you ❤️
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filter Chips */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterList color="action" />
            <Chip
              label="All"
              variant={filter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setFilter('all')}
              color="primary"
            />
            <Chip
              label="Likes"
              variant={filter === 'likes' ? 'filled' : 'outlined'}
              onClick={() => setFilter('likes')}
              color="primary"
              icon={<Favorite />}
            />
            <Chip
              label="Super Likes"
              variant={filter === 'super_likes' ? 'filled' : 'outlined'}
              onClick={() => setFilter('super_likes')}
              color="secondary"
              icon={<Star />}
            />
          </Stack>
        </Box>

        {/* Likes Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {likes.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                textAlign: 'center',
              }}
            >
              <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No likes yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep exploring to find your perfect match!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/explore')}
                sx={{ mt: 2 }}
              >
                Start Exploring
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {Object.entries(groupedLikes).map(([dateKey, dateLikes]) => {
                  const filteredDateLikes = dateLikes.filter(like => {
                    if (filter === 'all') return true;
                    if (filter === 'likes') return like.type === 'LIKE';
                    if (filter === 'super_likes') return like.type === 'SUPER_LIKE';
                    return true;
                  });

                  if (filteredDateLikes.length === 0) return null;

                  return (
                    <Box key={dateKey} sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {dateKey}
                        </Typography>
                        <Chip
                          label={filteredDateLikes.length}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {filteredDateLikes.map(renderLikeCard)}
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    );
  }

  // Split layout when like is selected (likes list + profile)
  return (
    <Box sx={{ height: '100%', display: 'flex', gap: 2, p: 2 }}>
      {/* Left Section - Likes List (60%) */}
      <Box sx={{ flex: 0.6 }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <IconButton onClick={() => navigate('/explore')}>
              <ArrowBack />
            </IconButton>
            <PulseLogo sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Your Likes
            </Typography>
            <Badge badgeContent={likes.length} color="primary" sx={{ ml: 1 }}>
              <Favorite color="primary" />
            </Badge>
          </Box>

          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            People who liked you ❤️
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filter Chips */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterList color="action" />
              <Chip
                label="All"
                variant={filter === 'all' ? 'filled' : 'outlined'}
                onClick={() => setFilter('all')}
                color="primary"
              />
              <Chip
                label="Likes"
                variant={filter === 'likes' ? 'filled' : 'outlined'}
                onClick={() => setFilter('likes')}
                color="primary"
                icon={<Favorite />}
              />
              <Chip
                label="Super Likes"
                variant={filter === 'super_likes' ? 'filled' : 'outlined'}
                onClick={() => setFilter('super_likes')}
                color="secondary"
                icon={<Star />}
              />
            </Stack>
          </Box>

          {/* Likes Content */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {likes.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  textAlign: 'center',
                }}
              >
                <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No likes yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keep exploring to find your perfect match!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/explore')}
                  sx={{ mt: 2 }}
                >
                  Start Exploring
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {Object.entries(groupedLikes).map(([dateKey, dateLikes]) => {
                    const filteredDateLikes = dateLikes.filter(like => {
                      if (filter === 'all') return true;
                      if (filter === 'likes') return like.type === 'LIKE';
                      if (filter === 'super_likes') return like.type === 'SUPER_LIKE';
                      return true;
                    });

                    if (filteredDateLikes.length === 0) return null;

                    return (
                      <Box key={dateKey} sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {dateKey}
                          </Typography>
                          <Chip
                            label={filteredDateLikes.length}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        {filteredDateLikes.map(renderLikeCard)}
                      </Box>
                    );
                  })}
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Box>

      {/* Right Section - Mini Profile (40%) */}
      <Box sx={{ flex: 0.4, minWidth: '300px' }}>
        <MiniProfile
          user={selectedLike.liker}
          showPhoto={true}
          variant="preview"
        />
      </Box>
    </Box>
  );
};

export default Likes;