import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';

interface AboutMeData {
  bio: string;
}

interface AboutMeStepProps {
  data: AboutMeData;
  onComplete: (data: AboutMeData) => void;
  onBack: () => void;
  loading: boolean;
}

function AboutMeStep({ data, onComplete, onBack, loading }: AboutMeStepProps) {
  const [formData, setFormData] = useState<AboutMeData>(data);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.bio.trim()) {
      errors.bio = 'Bio is required';
    } else if (formData.bio.length < 20) {
      errors.bio = 'Bio must be at least 20 characters';
    } else if (formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
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
        About Me
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tell people about yourself! What makes you unique and interesting?
      </Typography>

      <TextField
        required
        fullWidth
        multiline
        rows={6}
        name="bio"
        label="Bio"
        value={formData.bio}
        onChange={handleChange}
        error={!!formErrors.bio}
        helperText={formErrors.bio || `${formData.bio.length}/500 characters`}
        disabled={loading}
        placeholder="I love adventures, good food, and meaningful conversations. When I'm not exploring new places, you'll find me..."
      />

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

export default AboutMeStep;