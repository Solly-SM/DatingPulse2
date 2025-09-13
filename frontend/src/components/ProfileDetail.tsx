import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  School,
  Work,
  Height,
  Verified,
  Favorite,
  Star,
} from '@mui/icons-material';
import { DiscoverUser } from '../types/Dating';

interface ProfileDetailProps {
  user: DiscoverUser;
}

function ProfileDetail({ user }: ProfileDetailProps) {
  return (
    <Card
      sx={{
        height: 600,
        overflow: 'auto',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Name and Age */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 60, 
              height: 60,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.5rem',
            }}
          >
            {user.firstName?.[0] || user.username[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h4" component="h2" fontWeight="bold">
                {user.firstName || user.username}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                {user.age}
              </Typography>
              {user.verified && (
                <Verified color="primary" sx={{ fontSize: 24 }} />
              )}
            </Box>
            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {user.distance}km away
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Bio Section */}
        {user.bio && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              About
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {user.bio}
            </Typography>
          </Box>
        )}

        {/* Basic Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Details
          </Typography>
          <Stack spacing={1.5}>
            {user.education && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body1">{user.education}</Typography>
              </Box>
            )}
            {user.occupation && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Work sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body1">{user.occupation}</Typography>
              </Box>
            )}
            {user.height && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Height sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body1">{user.height}cm</Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Interests
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {user.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  size="medium"
                  sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Photo Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Photos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.photos?.length || 0} photo{(user.photos?.length || 0) !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<Favorite />}
              label="Like"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              icon={<Star />}
              label="Super Like"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProfileDetail;