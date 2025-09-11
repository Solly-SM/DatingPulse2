import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
} from '@mui/material';

interface LifestyleData {
  pets?: string;
  drinking?: string;
  smoking?: string;
  workout?: string;
  dietaryPreference?: string;
  socialMedia?: string;
  sleepingHabits?: string;
  languages?: string[];
}

interface LifestyleStepProps {
  data: LifestyleData;
  onComplete: (data: LifestyleData) => void;
  onBack: () => void;
  loading: boolean;
}

const petOptions = ['Love them', 'Have pets', 'Allergic', 'Not a fan', 'Want pets'];
const drinkingOptions = ['Never', 'Rarely', 'Socially', 'Regularly', 'Prefer not to say'];
const smokingOptions = ['Never', 'Socially', 'Regularly', 'Trying to quit', 'Prefer not to say'];
const workoutOptions = ['Daily', 'Often', 'Sometimes', 'Rarely', 'Never'];
const dietOptions = ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Other'];
const socialMediaOptions = ['Very active', 'Active', 'Rarely use', 'Not on social media'];
const sleepOptions = ['Early bird', 'Night owl', 'Depends on the day', 'Inconsistent schedule'];

const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese',
  'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Other'
];

function LifestyleStep({ data, onComplete, onBack, loading }: LifestyleStepProps) {
  const [formData, setFormData] = useState<LifestyleData>(data);

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = formData.languages || [];
    if (currentLanguages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: currentLanguages.filter(l => l !== language)
      }));
    } else if (currentLanguages.length < 5) {
      setFormData(prev => ({
        ...prev,
        languages: [...currentLanguages, language]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Lifestyle & Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your lifestyle preferences to find compatible matches.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Pets</InputLabel>
            <Select
              name="pets"
              value={formData.pets || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {petOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Drinking</InputLabel>
            <Select
              name="drinking"
              value={formData.drinking || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {drinkingOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Smoking</InputLabel>
            <Select
              name="smoking"
              value={formData.smoking || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {smokingOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Workout Frequency</InputLabel>
            <Select
              name="workout"
              value={formData.workout || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {workoutOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Dietary Preference</InputLabel>
            <Select
              name="dietaryPreference"
              value={formData.dietaryPreference || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {dietOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Social Media Usage</InputLabel>
            <Select
              name="socialMedia"
              value={formData.socialMedia || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {socialMediaOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Sleeping Habits</InputLabel>
            <Select
              name="sleepingHabits"
              value={formData.sleepingHabits || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {sleepOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Languages (Select up to 5)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {languageOptions.map((language) => {
              const isSelected = (formData.languages || []).includes(language);
              const canSelect = (formData.languages || []).length < 5 || isSelected;
              
              return (
                <Chip
                  key={language}
                  label={language}
                  onClick={() => canSelect && handleLanguageToggle(language)}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  disabled={!canSelect}
                  sx={{ 
                    cursor: canSelect ? 'pointer' : 'not-allowed',
                    opacity: canSelect ? 1 : 0.5 
                  }}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default LifestyleStep;