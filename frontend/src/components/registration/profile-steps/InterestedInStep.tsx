import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';

interface InterestedInStepProps {
  data: {
    interestedIn: string[];
  };
  onComplete: (data: { interestedIn: string[] }) => void;
  onBack: () => void;
  loading?: boolean;
}

const interestedInOptions = [
  'Men',
  'Women', 
  'Non-binary',
  'Trans men',
  'Trans women',
  'All'
];

function InterestedInStep({ data, onComplete, onBack, loading }: InterestedInStepProps) {
  const [interestedIn, setInterestedIn] = useState<string[]>(data.interestedIn || []);

  const handleToggleOption = (option: string) => {
    if (option === 'All') {
      setInterestedIn(['All']);
    } else {
      setInterestedIn(prev => {
        const filtered = prev.filter(item => item !== 'All');
        if (filtered.includes(option)) {
          return filtered.filter(item => item !== option);
        } else {
          return [...filtered, option];
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ interestedIn });
  };

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Who are you interested in seeing?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Select all that apply to help us find the right matches for you
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {interestedInOptions.map((option) => (
              <Grid item key={option}>
                <Chip
                  label={option}
                  clickable
                  variant={interestedIn.includes(option) ? 'filled' : 'outlined'}
                  onClick={() => handleToggleOption(option)}
                  sx={{
                    bgcolor: interestedIn.includes(option) ? 'primary.main' : 'transparent',
                    color: interestedIn.includes(option) ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: interestedIn.includes(option) ? 'primary.dark' : 'action.hover',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

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
              disabled={loading || interestedIn.length === 0}
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

export default InterestedInStep;