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

interface PhysicalAttributesData {
  height?: number;
  weight?: number;
  bodyType?: string;
  ethnicity?: string;
}

interface PhysicalAttributesStepProps {
  data: PhysicalAttributesData;
  onComplete: (data: PhysicalAttributesData) => void;
  onBack: () => void;
  onSkip?: () => void;
  loading: boolean;
  hideNavigation?: boolean;
}

const bodyTypes = [
  'Slim', 'Athletic', 'Average', 'Curvy', 'Muscular', 'Plus Size', 'Other', 'Prefer not to say'
];

const ethnicities = [
  'African', 'Asian', 'Caucasian', 'Hispanic/Latino', 'Middle Eastern', 
  'Native American', 'Pacific Islander', 'Mixed', 'Other', 'Prefer not to say'
];

function PhysicalAttributesStep({ data, onComplete, onBack, onSkip, loading, hideNavigation = false }: PhysicalAttributesStepProps) {
  const [formData, setFormData] = useState<PhysicalAttributesData>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'height' || name === 'weight' ? (value ? parseInt(value) : undefined) : value,
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
      {onSkip && (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Button
            variant="text"
            onClick={onSkip}
            sx={{ position: 'absolute', top: -16, right: 0 }}
          >
            Skip
          </Button>
        </Box>
      )}
      
      <Typography variant="h6" gutterBottom>
        Physical Attributes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        These details are optional but help create better matches.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="height"
            label="Height (cm)"
            type="number"
            value={formData.height || ''}
            onChange={handleChange}
            disabled={loading}
            inputProps={{ min: 100, max: 250 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="weight"
            label="Weight (kg)"
            type="number"
            value={formData.weight || ''}
            onChange={handleChange}
            disabled={loading}
            inputProps={{ min: 30, max: 300 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Body Type</InputLabel>
            <Select
              name="bodyType"
              value={formData.bodyType || ''}
              onChange={handleSelectChange}
              disabled={loading}
              label="Body Type"
            >
              {bodyTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Ethnicity</InputLabel>
            <Select
              name="ethnicity"
              value={formData.ethnicity || ''}
              onChange={handleSelectChange}
              disabled={loading}
              label="Ethnicity"
            >
              {ethnicities.map((ethnicity) => (
                <MenuItem key={ethnicity} value={ethnicity}>{ethnicity}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {!hideNavigation && (
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
      )}
    </Box>
  );
}

export default PhysicalAttributesStep;