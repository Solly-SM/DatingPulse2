import React from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  Work,
  School,
  Verified,
  Height,
  Cake,
} from '@mui/icons-material';
import { DiscoverUser } from '../types/Dating';

interface MiniProfileProps {
  user: DiscoverUser;
  compact?: boolean;
  showHeader?: boolean;
}

function MiniProfile({ user, compact = false, showHeader = true }: MiniProfileProps) {
  if (!user) {
    return null;
  }

  // Helper function to get user's display age
  const getDisplayAge = () => {
    return user.age || null;
  };

  // Helper function to get user's display name
  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.username;
  };

  // Helper function to get user's primary photo URL
  const getPrimaryPhotoUrl = () => {
    const primaryPhoto = user.photos?.find(photo => photo.isPrimary);
    return primaryPhoto?.url || user.photos?.[0]?.url;
  };

  return (
    <Paper 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: compact ? 1 : 2,
      }}
    >
      {/* Header */}
      {showHeader && (
        <Box sx={{ 
          p: compact ? 1 : 2,
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0
        }}>
          <Typography variant={compact ? "subtitle2" : "h6"} fontWeight="bold" color="primary.main">
            Profile
          </Typography>
        </Box>
      )}

      {/* Profile Content */}
      <Box sx={{ 
        p: compact ? 1.5 : 2, 
        flexGrow: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 1.5 : 2,
      }}>
        
        {/* Avatar and Basic Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={getPrimaryPhotoUrl()}
            sx={{ 
              width: compact ? 50 : 60, 
              height: compact ? 50 : 60,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: compact ? '1.2rem' : '1.5rem',
            }}
          >
            {getDisplayName()[0]?.toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography 
                variant={compact ? "subtitle1" : "h6"} 
                fontWeight="bold"
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getDisplayName()}
              </Typography>
              
              {user.verified && (
                <Verified color="primary" sx={{ fontSize: compact ? 16 : 20 }} />
              )}
            </Box>
            
            {/* Age and Location on same line */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {getDisplayAge() && (
                <Chip
                  icon={<Cake sx={{ fontSize: '16px !important' }} />}
                  label={`${getDisplayAge()}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              )}
              
              {user.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {user.location}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Bio - only show if user has filled it out */}
        {user.bio && (
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: compact ? 2 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {user.bio}
            </Typography>
          </Box>
        )}

        <Divider />

        {/* Key Details - only show if user has filled them out */}
        <Stack spacing={1}>
          {user.occupation && (
            <Card variant="outlined" sx={{ borderRadius: 1 }}>
              <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work color="primary" sx={{ fontSize: 16 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Work
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      {user.occupation}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {user.education && (
            <Card variant="outlined" sx={{ borderRadius: 1 }}>
              <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School color="primary" sx={{ fontSize: 16 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Education
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      {user.education}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {user.height && (
            <Card variant="outlined" sx={{ borderRadius: 1 }}>
              <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Height color="primary" sx={{ fontSize: 16 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Height
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      {user.height} cm
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Stack>

        {/* Interests - only show if user has them */}
        {user.interests && user.interests.length > 0 && (
          <Box>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>
              Interests
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {user.interests.slice(0, compact ? 4 : 6).map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    height: 20, 
                    fontSize: '0.65rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              ))}
              {user.interests.length > (compact ? 4 : 6) && (
                <Chip
                  label={`+${user.interests.length - (compact ? 4 : 6)} more`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ 
                    height: 20, 
                    fontSize: '0.65rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Distance - show if available */}
        {user.distance && (
          <Box sx={{ textAlign: 'center', mt: 'auto' }}>
            <Typography variant="caption" color="text.secondary">
              {user.distance} km away
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default MiniProfile;