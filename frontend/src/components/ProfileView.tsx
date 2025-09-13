import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Badge,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  LocationOn,
  Work,
  School,
  Favorite,
  Close,
  MoreVert,
  Share,
  Report,
  Block,
  Verified,
} from '@mui/icons-material';
import { DiscoverUser } from '../types/Dating';

interface ProfileViewProps {
  user: DiscoverUser;
  onClose?: () => void;
  compact?: boolean;
}

function ProfileView({ user, onClose, compact = false }: ProfileViewProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Mock user data with more details for demo
  const profileUser = {
    ...user,
    bio: user.bio || "Adventure seeker, coffee lover, and dog enthusiast. Looking for someone to explore the city with and share good laughs. Life's too short for boring conversations! 🌟",
    location: user.location || "San Francisco, CA",
    occupation: user.occupation || "Software Engineer",
    education: user.education || "Stanford University",
    interests: user.interests || ["Travel", "Photography", "Hiking", "Cooking", "Music", "Art"],
    verified: user.verified || true,
    photos: user.photos || [
      {
        photoID: 1,
        userID: user.userID,
        url: 'https://images.unsplash.com/photo-1494790108755-2616b2bef569?w=400&h=400&fit=crop&crop=face',
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
      {
        photoID: 2,
        userID: user.userID,
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
        isPrimary: false,
        uploadedAt: new Date().toISOString(),
      },
      {
        photoID: 3,
        userID: user.userID,
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        isPrimary: false,
        uploadedAt: new Date().toISOString(),
      }
    ]
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === profileUser.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? profileUser.photos.length - 1 : prev - 1
    );
  };

  const getDisplayAge = () => {
    return profileUser.age || 25;
  };

  return (
    <Paper sx={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: compact ? 1 : 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant={compact ? "subtitle1" : "h6"} fontWeight="bold">
          Profile
        </Typography>
        <Box>
          <IconButton size={compact ? "small" : "medium"}>
            <Share />
          </IconButton>
          <IconButton size={compact ? "small" : "medium"}>
            <MoreVert />
          </IconButton>
          {onClose && (
            <IconButton onClick={onClose} size={compact ? "small" : "medium"}>
              <Close />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Photo Carousel */}
        <Box sx={{ position: 'relative', height: compact ? 200 : 300 }}>
          <Box
            component="img"
            src={profileUser.photos[currentPhotoIndex]?.url}
            alt={`${profileUser.firstName || profileUser.username} photo ${currentPhotoIndex + 1}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Photo Navigation */}
          {profileUser.photos.length > 1 && (
            <>
              <IconButton
                onClick={prevPhoto}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
                size={compact ? "small" : "medium"}
              >
                <ArrowBackIos />
              </IconButton>
              
              <IconButton
                onClick={nextPhoto}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
                size={compact ? "small" : "medium"}
              >
                <ArrowForwardIos />
              </IconButton>

              {/* Photo Indicators */}
              <Box sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
              }}>
                {profileUser.photos.map((_: any, index: number) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === currentPhotoIndex ? 'white' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>

        {/* Profile Info */}
        <Box sx={{ p: compact ? 1 : 2 }}>
          {/* Name and Age */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant={compact ? "h6" : "h5"} fontWeight="bold">
              {profileUser.firstName || profileUser.username} {profileUser.lastName || ''}
            </Typography>
            {profileUser.verified && (
              <Verified color="primary" sx={{ fontSize: compact ? 18 : 20 }} />
            )}
            <Typography variant={compact ? "h6" : "h5"} color="text.secondary">
              {getDisplayAge()}
            </Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {profileUser.location}
            </Typography>
          </Box>

          {/* Bio */}
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {profileUser.bio}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Details Grid */}
          <Grid container spacing={2}>
            {profileUser.occupation && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent sx={{ py: compact ? 1 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Work
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {profileUser.occupation}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {profileUser.education && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent sx={{ py: compact ? 1 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Education
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {profileUser.education}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Interests */}
          {profileUser.interests && profileUser.interests.length > 0 && (
            <>
              <Box sx={{ mt: 3, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileUser.interests.map((interest: string, index: number) => (
                    <Chip
                      key={index}
                      label={interest}
                      size={compact ? "small" : "medium"}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Report />}
              size={compact ? "small" : "medium"}
              sx={{ flex: 1 }}
            >
              Report
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Block />}
              size={compact ? "small" : "medium"}
              sx={{ flex: 1 }}
            >
              Block
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default ProfileView;