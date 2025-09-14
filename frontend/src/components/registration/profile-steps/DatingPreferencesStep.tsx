import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface DatingPreferencesData {
  relationshipGoal?: string;
  sexualOrientation?: string;
  lookingFor?: string;
  maxDistance?: number;
}

interface DatingPreferencesStepProps {
  data: DatingPreferencesData;
  onComplete: (data: DatingPreferencesData) => void;
  onBack: () => void;
  loading: boolean;
}

const relationshipGoals = [
  'Looking for love',
  'Open to dating',
  'Want to chat first',
  'Looking for friends',
  'Something casual',
  'Long-term relationship',
];

const sexualOrientations = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Asexual',
  'Demisexual',
  'Prefer not to say',
];

function DatingPreferencesStep({ data, onComplete, onBack, loading }: DatingPreferencesStepProps) {
  const [formData, setFormData] = useState<DatingPreferencesData>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxDistance' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Dating Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your dating preferences to find better matches.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>💘 Relationship Goal</InputLabel>
            <Select
              name="relationshipGoal"
              value={formData.relationshipGoal || ''}
              onChange={handleSelectChange}
              disabled={loading}
              label="💘 Relationship Goal"
            >
              {relationshipGoals.map((goal) => (
                <MenuItem key={goal} value={goal}>{goal}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>🏳️‍🌈 Sexual Orientation</InputLabel>
            <Select
              name="sexualOrientation"
              value={formData.sexualOrientation || ''}
              onChange={handleSelectChange}
              disabled={loading}
              label="🏳️‍🌈 Sexual Orientation"
            >
              {sexualOrientations.map((orientation) => (
                <MenuItem key={orientation} value={orientation}>{orientation}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="lookingFor"
            label="🔍 Looking For"
            value={formData.lookingFor || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="What you're seeking in a partner"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="maxDistance"
            label="📍 Max Distance (km)"
            type="number"
            value={formData.maxDistance || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="Maximum distance for matches"
            inputProps={{ min: 1, max: 500 }}
          />
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

export default DatingPreferencesStep;