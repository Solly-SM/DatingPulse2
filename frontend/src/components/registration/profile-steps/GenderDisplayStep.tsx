import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
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
  noContainer?: boolean;
}

function GenderDisplayStep({ data, onComplete, onBack, onSkip, loading, noContainer }: GenderDisplayStepProps) {
  const [gender, setGender] = useState(data.gender || '');
  const [showGender, setShowGender] = useState(data.showGender || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ gender, showGender });
  };

  const genderOptions = [
    { value: 'man', label: 'Man', symbol: '♂' },
    { value: 'woman', label: 'Woman', symbol: '♀' },
    { value: 'non-binary', label: 'Non-binary', symbol: '⚧' },
    { value: 'other', label: 'Other', symbol: '◊' },
  ];

  const content = (
    <>
      <Box sx={{ position: 'relative' }}>
        <Button
          variant="text"
          onClick={onSkip}
          sx={{
            position: 'absolute',
            top: -24,
            right: -24,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.08)',
              color: 'primary.main',
            },
          }}
        >
          Skip
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          What's your gender?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Choose how you identify
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
          <RadioGroup
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            sx={{ gap: 2 }}
          >
            {genderOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '1.5rem',
                        color: gender === option.value ? 'primary.main' : 'text.secondary',
                        fontWeight: 600,
                      }}
                    >
                      {option.symbol}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Box>
                }
                sx={{
                  m: 0,
                  p: 2.5,
                  border: '2px solid',
                  borderColor: gender === option.value ? 'primary.main' : 'divider',
                  borderRadius: 3,
                  backgroundColor: gender === option.value ? 'primary.light' : 'transparent',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: gender === option.value ? 'primary.light' : 'rgba(233, 30, 99, 0.08)',
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.15)',
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
              sx={{
                '&.Mui-checked': {
                  color: 'primary.main',
                },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
              Show my gender on my profile
            </Typography>
          }
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 2,
            backgroundColor: showGender ? 'rgba(233, 30, 99, 0.05)' : 'transparent',
            transition: 'background-color 0.2s ease-in-out',
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !gender}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0px 6px 20px rgba(233, 30, 99, 0.4)',
              },
              '&:disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </Box>
      </Box>
    </>
  );

  if (noContainer) {
    return content;
  }

  // Removed Card, CardContent wrappers
  return (
    <Box>
      {content}
    </Box>
  );
}

export default GenderDisplayStep;