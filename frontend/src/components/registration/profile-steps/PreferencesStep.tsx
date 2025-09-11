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
} from '@mui/material';

interface PreferencesData {
  interestedIn: string;
  relationshipGoal?: string;
  sexualOrientation?: string;
}

interface PreferencesStepProps {
  data: PreferencesData;
  onComplete: (data: PreferencesData) => void;
  onBack: () => void;
  loading: boolean;
}

const relationshipGoalOptions = [
  'Looking for love',
  'Open to dating',
  'Want to chat first',
  'Looking for friends',
  'Something casual',
  'Long-term relationship'
];
const sexualOrientationOptions = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Asexual',
  'Demisexual',
  'Prefer not to say'
];

function PreferencesStep({ data, onComplete, onBack, loading }: PreferencesStepProps) {
  const [formData, setFormData] = useState<PreferencesData>(data);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user makes selection
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.interestedIn) {
      errors.interestedIn = 'Please specify who you\'re interested in';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onComplete(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Dating Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Help us understand what you're looking for to find better matches.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!formErrors.interestedIn}>
            <InputLabel>Interested In</InputLabel>
            <Select
              name="interestedIn"
              value={formData.interestedIn}
              onChange={handleSelectChange}
              disabled={loading}
            >
              <MenuItem value="MALE">Men</MenuItem>
              <MenuItem value="FEMALE">Women</MenuItem>
              <MenuItem value="BOTH">Both</MenuItem>
            </Select>
            {formErrors.interestedIn && (
              <Typography variant="caption" color="error">
                {formErrors.interestedIn}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Relationship Goal</InputLabel>
            <Select
              name="relationshipGoal"
              value={formData.relationshipGoal || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {relationshipGoalOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Sexual Orientation</InputLabel>
            <Select
              name="sexualOrientation"
              value={formData.sexualOrientation || ''}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {sexualOrientationOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default PreferencesStep;