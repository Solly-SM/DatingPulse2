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

interface SexualOrientationStepProps {
  data: {
    sexualOrientation: string;
    showOrientation: boolean;
  };
  onComplete: (data: { sexualOrientation: string; showOrientation: boolean }) => void;
  onBack: () => void;
  onSkip: () => void;
  loading?: boolean;
}

function SexualOrientationStep({ data, onComplete, onBack, onSkip, loading }: SexualOrientationStepProps) {
  const [sexualOrientation, setSexualOrientation] = useState(data.sexualOrientation || '');
  const [showOrientation, setShowOrientation] = useState(data.showOrientation || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ sexualOrientation, showOrientation });
  };

  const orientationOptions = [
    { 
      value: 'straight', 
      label: 'Straight', 
      description: 'Attracted to people of the opposite gender' 
    },
    { 
      value: 'gay', 
      label: 'Gay', 
      description: 'Attracted to people of the same gender' 
    },
    { 
      value: 'lesbian', 
      label: 'Lesbian', 
      description: 'Women attracted to women' 
    },
    { 
      value: 'bisexual', 
      label: 'Bisexual', 
      description: 'Attracted to people of more than one gender' 
    },
    { 
      value: 'pansexual', 
      label: 'Pansexual', 
      description: 'Attracted to people regardless of gender' 
    },
    { 
      value: 'asexual', 
      label: 'Asexual', 
      description: 'Little to no sexual attraction to others' 
    },
    { 
      value: 'demisexual', 
      label: 'Demisexual', 
      description: 'Sexual attraction only after emotional bond' 
    },
    { 
      value: 'queer', 
      label: 'Queer', 
      description: 'Non-heterosexual orientation' 
    },
    { 
      value: 'questioning', 
      label: 'Questioning', 
      description: 'Exploring your sexual orientation' 
    },
    { 
      value: 'other', 
      label: 'Other', 
      description: 'Another orientation not listed' 
    },
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
          What's your sexual orientation?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Choose how you identify - this helps us find compatible matches
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
            <RadioGroup
              value={sexualOrientation}
              onChange={(e) => setSexualOrientation(e.target.value)}
              sx={{ gap: 1 }}
            >
              {orientationOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    border: '1px solid',
                    borderColor: sexualOrientation === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    backgroundColor: sexualOrientation === option.value ? 'primary.light' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                    p: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSexualOrientation(option.value)}
                >
                  <FormControlLabel
                    value={option.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              💡 <strong>Privacy Tip:</strong> Your sexual orientation helps us match you with compatible people. 
              You can choose whether to display this on your profile.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOrientation}
                  onChange={(e) => setShowOrientation(e.target.checked)}
                  color="primary"
                />
              }
              label="Show my sexual orientation on my profile"
            />
          </Box>

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
              disabled={loading || !sexualOrientation}
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

export default SexualOrientationStep;