import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from '@mui/material';

interface GenderDisplayStepProps {
  data: {
    gender: string;
    showGender: boolean;
  };
  onComplete: (data: { gender: string; showGender: boolean }) => void;
  onBack: () => void;
  onSkip: () => void;
  loading?: boolean;
}

function GenderDisplayStep({ data, onComplete, onBack, onSkip, loading }: GenderDisplayStepProps) {
  const [gender, setGender] = useState(data.gender || '');
  const [showGender, setShowGender] = useState(data.showGender || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ gender, showGender });
  };

  const genderOptions = [
    { value: 'man', label: 'Man' },
    { value: 'woman', label: 'Woman' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'other', label: 'Other' },
  ];

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
          What's your gender?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Choose how you identify
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mb: 4 }}>
            <RadioGroup
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              sx={{ gap: 1 }}
            >
              {genderOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{
                    m: 0,
                    p: 2,
                    border: '1px solid',
                    borderColor: gender === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    backgroundColor: gender === option.value ? 'primary.light' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={showGender}
                onChange={(e) => setShowGender(e.target.checked)}
                color="primary"
              />
            }
            label="Show my gender on my profile"
            sx={{ mb: 3 }}
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
              disabled={loading || !gender}
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

export default GenderDisplayStep;