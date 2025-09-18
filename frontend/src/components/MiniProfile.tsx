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
  Psychology,
  Church,
  ChildCare,
  TravelExplore,
  Restaurant,
  MovieCreation,
  LibraryBooks,
  Language,
} from '@mui/icons-material';
import { DiscoverUser } from '../types/Dating';
import AudioPlayer from './AudioPlayer';

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
    jobTitle: user.jobTitle || undefined,
    education: user.education || undefined,
    interests: user.interests || [],
    verified: user.verified || false,
    photos: user.photos || [],
    audioIntroUrl: user.audioIntroUrl || undefined,
    // Physical attributes
    weight: user.weight || undefined,
    bodyType: user.bodyType || undefined,
    ethnicity: user.ethnicity || undefined,
    // Lifestyle
    pets: user.pets || undefined,
    drinking: user.drinking || undefined,
    smoking: user.smoking || undefined,
    workout: user.workout || undefined,
    dietaryPreference: user.dietaryPreference || undefined,
    sleepingHabits: user.sleepingHabits || undefined,
    languages: user.languages || [],
    // Preferences
    relationshipGoal: user.relationshipGoal || undefined,
    sexualOrientation: user.sexualOrientation || undefined,
    lookingFor: user.lookingFor || undefined,
    // Personality
    communicationStyle: user.communicationStyle || undefined,
    loveLanguage: user.loveLanguage || undefined,
    zodiacSign: user.zodiacSign || undefined,
    // Additional fields
    religion: user.religion || undefined,
    politicalViews: user.politicalViews || undefined,
    familyPlans: user.familyPlans || undefined,
    fitnessLevel: user.fitnessLevel || undefined,
    travelFrequency: user.travelFrequency || undefined,
    industry: user.industry || undefined,
    musicPreferences: user.musicPreferences || [],
    foodPreferences: user.foodPreferences || [],
    entertainmentPreferences: user.entertainmentPreferences || [],
    currentlyReading: user.currentlyReading || undefined,
    lifeGoals: user.lifeGoals || undefined,
    petPreferences: user.petPreferences || undefined,
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
  const hasWork = profileUser.occupation || profileUser.jobTitle;
  const hasEducation = profileUser.education;
  const hasBio = profileUser.bio;
  const hasInterests = profileUser.interests && profileUser.interests.length > 0;
  const hasAudioIntro = profileUser.audioIntroUrl;
  const hasPhysicalAttributes = profileUser.height || profileUser.gender || profileUser.weight || profileUser.bodyType || profileUser.ethnicity;
  const hasLifestyle = profileUser.pets || profileUser.drinking || profileUser.smoking || profileUser.workout || 
                      profileUser.dietaryPreference || profileUser.sleepingHabits || (profileUser.languages && profileUser.languages.length > 0);
  const hasPreferences = profileUser.relationshipGoal || profileUser.sexualOrientation || profileUser.lookingFor;
  const hasPersonality = profileUser.communicationStyle || profileUser.loveLanguage || profileUser.zodiacSign;
  const hasAdditionalInfo = profileUser.religion || profileUser.politicalViews || profileUser.familyPlans || 
                           profileUser.fitnessLevel || profileUser.travelFrequency || profileUser.industry;
  const hasEnhancedPreferences = (profileUser.musicPreferences && profileUser.musicPreferences.length > 0) ||
                                (profileUser.foodPreferences && profileUser.foodPreferences.length > 0) ||
                                (profileUser.entertainmentPreferences && profileUser.entertainmentPreferences.length > 0) ||
                                profileUser.currentlyReading || profileUser.lifeGoals || profileUser.petPreferences;

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
        height: isCompact ? 'auto' : '100%', // Remove artificial height restrictions
        maxHeight: isCompact ? 'auto' : maxHeight, // Only apply maxHeight when specified
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

        {/* Audio Intro - High priority, show early in profile */}
        {hasAudioIntro && !isCompact && (
          <Box sx={{ mb: 2 }}>
            <AudioPlayer 
              audioUrl={profileUser.audioIntroUrl!} 
              title="Voice Introduction"
              compact={false}
            />
          </Box>
        )}

        {/* Important physical info - Height, Gender, Weight, Body Type, etc. */}
        {hasPhysicalAttributes && !isCompact && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Physical Attributes
            </Typography>
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

              {profileUser.bodyType && (
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FitnessCenter color="primary" sx={{ fontSize: 16 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Body Type
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {profileUser.bodyType}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {profileUser.ethnicity && (
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Psychology color="primary" sx={{ fontSize: 16 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Ethnicity
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {profileUser.ethnicity}
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
                            {profileUser.jobTitle || profileUser.occupation}
                          </Typography>
                          {profileUser.jobTitle && profileUser.occupation && profileUser.jobTitle !== profileUser.occupation && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              at {profileUser.occupation}
                            </Typography>
                          )}
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

        {/* Lifestyle - Show lifestyle information */}
        {hasLifestyle && !isCompact && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Lifestyle
              </Typography>
              <Grid container spacing={1}>
                {profileUser.pets && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Pets color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Pets
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.pets}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.drinking && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalBar color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Drinking
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.drinking}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.smoking && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SmokingRooms color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Smoking
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.smoking}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.workout && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FitnessCenter color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Fitness
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.workout}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.dietaryPreference && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Restaurant color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Diet
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.dietaryPreference}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.languages && profileUser.languages.length > 0 && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Language color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Languages
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.languages.join(', ')}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </>
        )}

        {/* Personality - Show personality traits */}
        {hasPersonality && !isCompact && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Personality
              </Typography>
              <Grid container spacing={1}>
                {profileUser.communicationStyle && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Psychology color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Communication Style
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.communicationStyle}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.loveLanguage && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Favorite color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Love Language
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.loveLanguage}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.zodiacSign && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Psychology color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Zodiac Sign
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.zodiacSign}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </>
        )}

        {/* Preferences - Show relationship and personal preferences */}
        {hasPreferences && !isCompact && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Looking For
              </Typography>
              <Grid container spacing={1}>
                {profileUser.relationshipGoal && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Favorite color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Relationship Goal
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.relationshipGoal}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.lookingFor && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                          "{profileUser.lookingFor}"
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </>
        )}

        {/* Enhanced Preferences - Music, Food, Entertainment, etc. */}
        {hasEnhancedPreferences && !isCompact && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Preferences & Interests
              </Typography>
              
              {profileUser.musicPreferences && profileUser.musicPreferences.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Music
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {profileUser.musicPreferences.slice(0, 3).map((pref, index) => (
                      <Chip
                        key={index}
                        label={pref}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {profileUser.foodPreferences && profileUser.foodPreferences.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Food
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {profileUser.foodPreferences.slice(0, 3).map((pref, index) => (
                      <Chip
                        key={index}
                        label={pref}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {profileUser.entertainmentPreferences && profileUser.entertainmentPreferences.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Entertainment
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {profileUser.entertainmentPreferences.slice(0, 3).map((pref, index) => (
                      <Chip
                        key={index}
                        label={pref}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {profileUser.currentlyReading && (
                <Box sx={{ mb: 1.5 }}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LibraryBooks color="primary" sx={{ fontSize: 16 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Currently Reading
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                            {profileUser.currentlyReading}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {profileUser.lifeGoals && (
                <Box sx={{ mb: 1.5 }}>
                  <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Typography variant="caption" color="text.secondary">
                        Life Goals
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.3, mt: 0.5 }}>
                        {profileUser.lifeGoals}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Additional Information */}
        {hasAdditionalInfo && !isCompact && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Additional Information
              </Typography>
              <Grid container spacing={1}>
                {profileUser.religion && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Church color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Religion
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.religion}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.familyPlans && (
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ChildCare color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Family Plans
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.familyPlans}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {profileUser.travelFrequency && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TravelExplore color="primary" sx={{ fontSize: 16 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Travel
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {profileUser.travelFrequency}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </>
        )}

        {/* Compact view key info - show most important details */}
        {isCompact && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {/* Audio intro indicator for compact view */}
              {hasAudioIntro && (
                <Chip
                  label="🎙️ Voice Intro"
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              )}
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