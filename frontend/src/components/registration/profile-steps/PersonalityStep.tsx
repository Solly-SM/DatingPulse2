import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface PersonalityData {
  communicationStyle?: string;
  loveLanguage?: string;
  zodiacSign?: string;
}

interface PersonalityStepProps {
  data: PersonalityData;
  onComplete: (data: PersonalityData) => void;
  onBack: () => void;
  loading?: boolean;
}

const communicationStyles = [
  'Direct and honest',
  'Gentle and understanding',
  'Playful and humorous',
  'Deep and thoughtful',
  'Calm and patient',
  'Energetic and enthusiastic'
];

const loveLanguages = [
  'Words of Affirmation',
  'Quality Time',
  'Physical Touch',
  'Acts of Service',
  'Receiving Gifts'
];

const zodiacSigns = [
  'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋',
  'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏',
  'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
];

function PersonalityStep({ data, onComplete, onBack, loading }: PersonalityStepProps) {
  const [formData, setFormData] = useState<PersonalityData>(data);

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
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          What else makes you, you?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Help us understand your personality and what makes you unique
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>What's your communication style?</InputLabel>
                <Select
                  name="communicationStyle"
                  value={formData.communicationStyle || ''}
                  onChange={handleSelectChange}
                  disabled={loading}
                  label="What's your communication style?"
                >
                  {communicationStyles.map((style) => (
                    <MenuItem key={style} value={style}>{style}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>How do you receive love?</InputLabel>
                <Select
                  name="loveLanguage"
                  value={formData.loveLanguage || ''}
                  onChange={handleSelectChange}
                  disabled={loading}
                  label="How do you receive love?"
                >
                  {loveLanguages.map((language) => (
                    <MenuItem key={language} value={language}>{language}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>What's your zodiac sign?</InputLabel>
                <Select
                  name="zodiacSign"
                  value={formData.zodiacSign || ''}
                  onChange={handleSelectChange}
                  disabled={loading}
                  label="What's your zodiac sign?"
                >
                  {zodiacSigns.map((sign) => (
                    <MenuItem key={sign} value={sign}>{sign}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 3 }}>
            These details help create more meaningful connections
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

export default PersonalityStep;