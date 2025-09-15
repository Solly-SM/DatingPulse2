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

interface LookingForStepProps {
  data: {
    lookingFor: string;
  };
  onComplete: (data: { lookingFor: string }) => void;
  onBack: () => void;
  loading?: boolean;
}

const lookingForOptions = [
  { value: 'serious_relationship', label: 'Serious Relationship', emoji: '💕' },
  { value: 'casual_dating', label: 'Casual Dating', emoji: '🍷' },
  { value: 'friendship', label: 'Friendship', emoji: '🤝' },
  { value: 'something_fun', label: 'Something Fun', emoji: '🎉' },
  { value: 'not_sure', label: 'Not Sure Yet', emoji: '🤷' },
  { value: 'marriage', label: 'Marriage', emoji: '💍' },
];

function LookingForStep({ data, onComplete, onBack, loading }: LookingForStepProps) {
  const [lookingFor, setLookingFor] = useState<string>(data.lookingFor || '');

  const handleSelectOption = (option: string) => {
    setLookingFor(option);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ lookingFor });
  };

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Choose what best describes what you're hoping to find
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {lookingForOptions.map((option) => (
              <Grid item xs={12} sm={6} key={option.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: lookingFor === option.value ? '2px solid' : '1px solid',
                    borderColor: lookingFor === option.value ? 'primary.main' : 'divider',
                    bgcolor: lookingFor === option.value ? 'primary.light' : 'background.paper',
                    '&:hover': {
                      bgcolor: lookingFor === option.value ? 'primary.light' : 'action.hover',
                    },
                  }}
                  onClick={() => handleSelectOption(option.value)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {option.emoji}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: lookingFor === option.value ? 'primary.dark' : 'text.primary',
                        fontWeight: lookingFor === option.value ? 'bold' : 'normal'
                      }}
                    >
                      {option.label}
                    </Typography>
                  </CardContent>
                </Card>
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
              disabled={loading || !lookingFor}
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

export default LookingForStep;