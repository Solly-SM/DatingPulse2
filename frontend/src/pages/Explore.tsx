import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Chip,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
  LinearProgress,
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
} from '@mui/icons-material';
import { datingService } from '../services/datingService';
import { DiscoverUser } from '../types/Dating';
import ProfileView from '../components/ProfileView';

interface FilterOptions {
  relationshipGoal: string;
  familyPlans: string;
  lifestyle: string;
  interests: string[];
  ageRange: { min: number; max: number };
}

function Explore() {
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    relationshipGoal: '',
    familyPlans: '',
    lifestyle: '',
    interests: [],
    ageRange: { min: 18, max: 50 },
  });
  const [filteredUsers, setFilteredUsers] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const relationshipGoals = [
    'Long-term relationship',
    'Casual dating', 
    'Friendship',
    'Marriage',
    'Something casual',
    'Not sure yet'
  ];

  const familyPlanOptions = [
    'Want children',
    "Don't want children",
    'Have children',
    'Open to children',
    'Prefer not to say'
  ];

  const lifestyleOptions = [
    'Active/Fitness focused',
    'Social/Party lover',
    'Quiet/Homebody',
    'Travel enthusiast',
    'Career focused',
    'Artistic/Creative'
  ];

  const interestOptions = [
    'Travel', 'Photography', 'Hiking', 'Cooking', 'Music', 'Art',
    'Sports', 'Reading', 'Movies', 'Gaming', 'Dancing', 'Yoga',
    'Technology', 'Business', 'Animals', 'Volunteering'
  ];

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const applyFilters = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would send filters to the backend
      const users = await datingService.getDiscoverUsers(0, 20);
      
      // For demo purposes, we'll just show all users
      // In real implementation, backend would filter based on preferences
      setFilteredUsers(users);
      setShowFilters(false);
    } catch (err: any) {
      setError('Failed to load filtered users');
      console.error('Error loading filtered users:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      relationshipGoal: '',
      familyPlans: '',
      lifestyle: '',
      interests: [],
      ageRange: { min: 18, max: 50 },
    });
    setFilteredUsers([]);
    setShowFilters(true);
  };

  if (showFilters) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Explore
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find people who share your relationship goals and values
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FilterList color="primary" />
            <Typography variant="h5" fontWeight="bold">
              Set Your Preferences
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Relationship Goals */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Relationship Goal</InputLabel>
                <Select
                  value={filters.relationshipGoal}
                  label="Relationship Goal"
                  onChange={(e) => handleFilterChange('relationshipGoal', e.target.value)}
                >
                  {relationshipGoals.map((goal) => (
                    <MenuItem key={goal} value={goal}>
                      {goal}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Family Plans */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Family Plans</InputLabel>
                <Select
                  value={filters.familyPlans}
                  label="Family Plans"
                  onChange={(e) => handleFilterChange('familyPlans', e.target.value)}
                >
                  {familyPlanOptions.map((plan) => (
                    <MenuItem key={plan} value={plan}>
                      {plan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Lifestyle */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Lifestyle</InputLabel>
                <Select
                  value={filters.lifestyle}
                  label="Lifestyle"
                  onChange={(e) => handleFilterChange('lifestyle', e.target.value)}
                >
                  {lifestyleOptions.map((lifestyle) => (
                    <MenuItem key={lifestyle} value={lifestyle}>
                      {lifestyle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Age Range */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Age Range: {filters.ageRange.min} - {filters.ageRange.max}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 80 }}>
                  <InputLabel>Min</InputLabel>
                  <Select
                    value={filters.ageRange.min}
                    label="Min"
                    onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, min: e.target.value })}
                  >
                    {Array.from({ length: 33 }, (_, i) => i + 18).map((age) => (
                      <MenuItem key={age} value={age}>
                        {age}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 80 }}>
                  <InputLabel>Max</InputLabel>
                  <Select
                    value={filters.ageRange.max}
                    label="Max"
                    onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, max: e.target.value })}
                  >
                    {Array.from({ length: 33 }, (_, i) => i + 18).map((age) => (
                      <MenuItem key={age} value={age}>
                        {age}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Interests */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Interests (select any that are important to you)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {interestOptions.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    onClick={() => handleInterestToggle(interest)}
                    color={filters.interests.includes(interest) ? 'primary' : 'default'}
                    variant={filters.interests.includes(interest) ? 'filled' : 'outlined'}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: filters.interests.includes(interest) 
                          ? 'primary.dark' 
                          : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={resetFilters}
              size="large"
            >
              Reset Filters
            </Button>
            <Button
              variant="contained"
              onClick={applyFilters}
              size="large"
              startIcon={<Search />}
              disabled={!filters.relationshipGoal && !filters.familyPlans && !filters.lifestyle && filters.interests.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                },
              }}
            >
              Find Matches
            </Button>
          </Box>
        </Paper>

        {/* Selected Filters Summary */}
        {(filters.relationshipGoal || filters.familyPlans || filters.lifestyle || filters.interests.length > 0) && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Preferences
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {filters.relationshipGoal && (
                <Chip icon={<FavoriteBorder />} label={`Goal: ${filters.relationshipGoal}`} color="primary" />
              )}
              {filters.familyPlans && (
                <Chip icon={<ChildCare />} label={`Family: ${filters.familyPlans}`} color="secondary" />
              )}
              {filters.lifestyle && (
                <Chip icon={<DirectionsRun />} label={`Lifestyle: ${filters.lifestyle}`} color="info" />
              )}
              {filters.interests.map((interest) => (
                <Chip key={interest} label={interest} size="small" variant="outlined" />
              ))}
            </Stack>
          </Paper>
        )}
      </Box>
    );
  }

  // Show filtered results
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" gutterBottom>
            Finding people who match your preferences...
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
          <Button onClick={() => setShowFilters(true)} sx={{ ml: 2 }}>
            Back to Filters
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Your Matches
        </Typography>
        <Button
          variant="outlined"
          onClick={resetFilters}
          startIcon={<FilterList />}
        >
          Change Filters
        </Button>
      </Box>

      {/* Active Filters Summary */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Showing people matching your preferences:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {filters.relationshipGoal && (
            <Chip label={filters.relationshipGoal} size="small" color="primary" />
          )}
          {filters.familyPlans && (
            <Chip label={filters.familyPlans} size="small" color="secondary" />
          )}
          {filters.lifestyle && (
            <Chip label={filters.lifestyle} size="small" color="info" />
          )}
          <Chip label={`Age ${filters.ageRange.min}-${filters.ageRange.max}`} size="small" />
          {filters.interests.slice(0, 3).map((interest) => (
            <Chip key={interest} label={interest} size="small" variant="outlined" />
          ))}
          {filters.interests.length > 3 && (
            <Chip label={`+${filters.interests.length - 3} more`} size="small" variant="outlined" />
          )}
        </Stack>
      </Paper>

      {/* Results Grid */}
      {filteredUsers.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            No matches found
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Try adjusting your filters to see more profiles
          </Typography>
          <Button variant="contained" onClick={resetFilters} sx={{ mt: 2 }}>
            Update Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={user.userID}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}>
                <ProfileView user={user} compact={true} />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {filteredUsers.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Showing {filteredUsers.length} matches
          </Typography>
          <Button variant="outlined" onClick={() => {
            // Load more users logic
            console.log('Load more users');
          }}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Explore;