import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Work,
  School,
  Verified,
  Favorite,
  ArrowBackIos,
  ArrowForwardIos,
  Height,
  Wc,
  FitnessCenter,
  Pets,
  SmokingRooms,
  LocalBar,
} from '@mui/icons-material';
import { DiscoverUser } from '../types/Dating';

interface MiniProfileProps {
  user: DiscoverUser;
  showPhoto?: boolean;
  variant?: 'sidebar' | 'preview' | 'compact';
  maxHeight?: string;
}

function MiniProfile({ user, showPhoto = true, variant = 'sidebar', maxHeight = '400px' }: MiniProfileProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Create profile user with fallback data
  const profileUser = {
    ...user,
    bio: user.bio || undefined,
    location: user.location || undefined,
    occupation: user.occupation || undefined,
    education: user.education || undefined,
    interests: user.interests || [],
    verified: user.verified || false,
    photos: user.photos || [],
  };

  const getDisplayAge = () => {
    return profileUser.age || 25;
  };

  const getProfilePhoto = () => {
    const photos = profileUser.photos || [];
    if (photos.length === 0) return null;
    return photos[currentPhotoIndex]?.url || photos[0]?.url;
  };

  const nextPhoto = () => {
    const photos = profileUser.photos || [];
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    const photos = profileUser.photos || [];
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const hasBasicInfo = profileUser.firstName || profileUser.username;
  const hasLocation = profileUser.location;
  const hasWork = profileUser.occupation;
  const hasEducation = profileUser.education;
  const hasBio = profileUser.bio;
  const hasInterests = profileUser.interests && profileUser.interests.length > 0;

  // Different layouts based on variant
  const isSidebar = variant === 'sidebar';
  const isPreview = variant === 'preview';
  const isCompact = variant === 'compact';

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        height: isCompact ? 'auto' : isSidebar ? '70vh' : '100%', // Limit sidebar height to 70vh
        maxHeight: maxHeight,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Photo Section - Only show if showPhoto is true and photo exists */}
      {showPhoto && getProfilePhoto() && (
        <Box sx={{ position: 'relative', height: isCompact ? 120 : isSidebar ? 180 : 200, flexShrink: 0 }}>
          <Box
            component="img"
            src={getProfilePhoto()!}
            alt={`${profileUser.firstName || profileUser.username} photo`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Photo navigation for multiple photos */}
          {profileUser.photos && profileUser.photos.length > 1 && (
            <>
              {/* Previous photo button */}
              <IconButton
                onClick={prevPhoto}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
                size="small"
              >
                <ArrowBackIos sx={{ fontSize: 14 }} />
              </IconButton>
              
              {/* Next photo button */}
              <IconButton
                onClick={nextPhoto}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
                size="small"
              >
                <ArrowForwardIos sx={{ fontSize: 14 }} />
              </IconButton>
              
              {/* Photo indicators */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                {profileUser.photos.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: index === currentPhotoIndex 
                        ? 'rgba(255,255,255,0.9)' 
                        : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  />
                ))}
              </Box>
            </>
          )}
          
          {/* Verification badge overlay */}
          {profileUser.verified && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                p: 0.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <Verified color="primary" sx={{ fontSize: 20 }} />
            </Box>
          )}
        </Box>
      )}

      {/* Profile Info Section */}
      <Box sx={{ 
        p: isCompact ? 1.5 : 2, 
        flexGrow: 1, 
        overflow: 'auto',
        minHeight: 0,
      }}>
        {/* Basic Info - Always show if available */}
        {hasBasicInfo && (
          <Box sx={{ mb: 2 }}>
            {/* Avatar (when no photo is shown) */}
            {!showPhoto || !getProfilePhoto() && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: isCompact ? 40 : 50,
                    height: isCompact ? 40 : 50,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: isCompact ? '1rem' : '1.25rem',
                    fontWeight: 'bold',
                  }}
                >
                  {profileUser.firstName?.charAt(0) || profileUser.username?.charAt(0) || 'U'}
                </Avatar>
                {profileUser.verified && !showPhoto && (
                  <Verified color="primary" sx={{ fontSize: 20 }} />
                )}
              </Box>
            )}

            {/* Name and Age */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant={isCompact ? "subtitle1" : "h6"} fontWeight="bold" noWrap>
                {profileUser.firstName || profileUser.username}
              </Typography>
              <Typography variant={isCompact ? "subtitle1" : "h6"} color="text.secondary">
                {getDisplayAge()}
              </Typography>
              
              {/* Verification badge (when photo is shown) */}
              {profileUser.verified && (showPhoto && getProfilePhoto()) && (
                <Verified color="primary" sx={{ fontSize: 18 }} />
              )}
            </Box>
          </Box>
        )}

        {/* Location - Only show if available */}
        {hasLocation && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {profileUser.location}
            </Typography>
          </Box>
        )}

        {/* Important physical info - Height and Gender */}
        {(profileUser.height || profileUser.gender) && !isCompact && (
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={1}>
              {profileUser.height && (
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Height color="primary" sx={{ fontSize: 16 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Height
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {profileUser.height}cm
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              {profileUser.gender && (
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Wc color="primary" sx={{ fontSize: 16 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Gender
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                            {profileUser.gender}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Bio - Only show if available */}
        {hasBio && !isCompact && (
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {profileUser.bio}
          </Typography>
        )}

        {/* Work and Education - Only show if available */}
        {(hasWork || hasEducation) && !isCompact && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Grid container spacing={1}>
              {hasWork && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Work color="primary" sx={{ fontSize: 18 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Work
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" noWrap>
                            {profileUser.occupation}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {hasEducation && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School color="primary" sx={{ fontSize: 18 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Education
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" noWrap>
                            {profileUser.education}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Interests - Only show if available */}
        {hasInterests && !isCompact && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Interests
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {profileUser.interests.slice(0, 6).map((interest: string, index: number) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                ))}
                {profileUser.interests.length > 6 && (
                  <Chip
                    label={`+${profileUser.interests.length - 6}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                )}
              </Box>
            </Box>
          </>
        )}

        {/* Compact view key info - show most important details */}
        {isCompact && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {profileUser.height && (
                <Chip
                  label={`${profileUser.height}cm`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  icon={<Height sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              )}
              {profileUser.gender && (
                <Chip
                  label={profileUser.gender}
                  size="small"
                  variant="outlined"
                  color="primary"
                  icon={<Wc sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: '0.65rem', height: 20, textTransform: 'capitalize' }}
                />
              )}
              {hasInterests && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Favorite fontSize="small" color="action" sx={{ fontSize: 14 }} />
                  <Typography variant="caption" color="text.secondary">
                    {profileUser.interests.length} interests
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default MiniProfile;