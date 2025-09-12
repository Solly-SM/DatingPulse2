import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

interface BirthDateStepProps {
  data: {
    dateOfBirth: string;
  };
  onComplete: (data: { dateOfBirth: string }) => void;
  onBack: () => void;
  onSkip: () => void;
  loading?: boolean;
}

function BirthDateStep({ data, onComplete, onBack, onSkip, loading }: BirthDateStepProps) {
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ dateOfBirth });
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dateOfBirth);

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="text"
            onClick={onSkip}
            sx={{ position: 'absolute', top: -16, right: -16 }}
          >
            Skip
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          When's your birthday?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your age will be displayed on your profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 3 }}
            variant="outlined"
          />

          {age && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You are {age} years old
            </Typography>
          )}

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
              disabled={loading || !dateOfBirth}
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

export default BirthDateStep;