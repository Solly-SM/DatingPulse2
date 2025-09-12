import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

interface NameAboutStepProps {
  data: {
    firstName: string;
    bio: string;
  };
  onComplete: (data: { firstName: string; bio: string }) => void;
  onBack: () => void;
  loading?: boolean;
}

function NameAboutStep({ data, onComplete, onBack, loading }: NameAboutStepProps) {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    bio: data.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          What's your name?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This will be displayed on your profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            variant="outlined"
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Tell us about yourself
          </Typography>
          
          <TextField
            fullWidth
            label="About Me"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Write a brief description about yourself..."
            sx={{ mb: 4 }}
            variant="outlined"
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.firstName.trim()}
              sx={{
                background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                },
              }}
            >
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default NameAboutStep;