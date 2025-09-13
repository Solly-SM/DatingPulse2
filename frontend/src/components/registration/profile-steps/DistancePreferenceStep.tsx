import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Slider,
} from '@mui/material';

interface DistancePreferenceStepProps {
  data: {
    maxDistance: number;
  };
  onComplete: (data: { maxDistance: number }) => void;
  onBack: () => void;
  loading?: boolean;
}

function DistancePreferenceStep({ data, onComplete, onBack, loading }: DistancePreferenceStepProps) {
  const [maxDistance, setMaxDistance] = useState<number>(data.maxDistance || 50);

  const handleDistanceChange = (event: Event, newValue: number | number[]) => {
    setMaxDistance(newValue as number);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ maxDistance });
  };

  const getDistanceText = (distance: number) => {
    if (distance >= 100) {
      return 'Anywhere';
    }
    return `${distance} km`;
  };

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Choose your distance preference
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          How far are you willing to travel to meet someone?
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ px: 2, mb: 4 }}>
            <Typography variant="h4" align="center" sx={{ mb: 3, color: 'primary.main' }}>
              {getDistanceText(maxDistance)}
            </Typography>
            
            <Slider
              value={maxDistance}
              onChange={handleDistanceChange}
              min={1}
              max={100}
              step={1}
              marks={[
                { value: 1, label: '1km' },
                { value: 25, label: '25km' },
                { value: 50, label: '50km' },
                { value: 75, label: '75km' },
                { value: 100, label: 'Anywhere' },
              ]}
              sx={{
                color: 'primary.main',
                height: 8,
                '& .MuiSlider-track': {
                  border: 'none',
                },
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: 'inherit',
                  },
                  '&:before': {
                    display: 'none',
                  },
                },
                '& .MuiSlider-valueLabel': {
                  lineHeight: 1.2,
                  fontSize: 12,
                  background: 'unset',
                  padding: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50% 50% 50% 0',
                  backgroundColor: 'primary.main',
                  transformOrigin: 'bottom left',
                  transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                  '&:before': { display: 'none' },
                  '&.MuiSlider-valueLabelOpen': {
                    transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                  },
                  '& > *': {
                    transform: 'rotate(45deg)',
                  },
                },
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            You can change this anytime in your settings
          </Typography>

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
              disabled={loading}
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

export default DistancePreferenceStep;