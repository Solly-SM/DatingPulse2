import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface InterestsData {
  interests: string[];
}

interface InterestsStepProps {
  data: InterestsData;
  onComplete: (data: InterestsData) => void;
  onBack: () => void;
  loading: boolean;
}

const interestCategories = {
  '🎨 Creativity': [
    '🎨 Art', '📸 Photography', '✍️ Writing', '🎵 Music', '🖊️ Drawing', '🧵 Crafts', '🎨 Design', '📝 Poetry', '🎤 Singing', '💃 Dancing'
  ],
  '⭐ Fan Favorites': [
    '🎬 Movies', '📺 TV Shows', '🌸 Anime', '📚 Comics', '📖 Books', '🎧 Podcasts', '📱 YouTube', '🎬 Netflix', '🎮 Gaming Streams', '📽️ Documentaries'
  ],
  '🍽️ Food & Drink': [
    '👨‍🍳 Cooking', '🧁 Baking', '🍷 Wine Tasting', '☕ Coffee', '🍺 Beer', '🍸 Cocktails', '🚚 Food Trucks', '🍽️ Fine Dining', '🔥 BBQ', '🥗 Vegetarian'
  ],
  '🎮 Gaming': [
    '🎮 Video Games', '🎲 Board Games', '🃏 Card Games', '💻 PC Gaming', '🎮 Console Gaming', '📱 Mobile Games', '🥽 VR Gaming', '🏆 Esports', '👾 Retro Games', '🗡️ RPGs'
  ],
  '💪 Sports & Fitness': [
    '🏃‍♂️ Running', '💪 Gym', '🧘‍♀️ Yoga', '🏊‍♂️ Swimming', '🏈 Football', '🏀 Basketball', '🎾 Tennis', '🚴‍♂️ Cycling', '🥾 Hiking', '🧗‍♂️ Rock Climbing'
  ],
  '✈️ Travel & Adventure': [
    '✈️ Travel', '🏔️ Adventure', '🏕️ Camping', '🎒 Backpacking', '🚗 Road Trips', '🏖️ Beaches', '⛰️ Mountains', '🏙️ Cities', '🌿 Nature', '🗺️ Exploration'
  ],
  '📚 Learning & Growth': [
    '📚 Reading', '🗣️ Languages', '🔬 Science', '🏛️ History', '🤔 Philosophy', '🧠 Psychology', '🌱 Self-improvement', '🧘‍♂️ Meditation', '🙏 Spirituality', '💻 Technology'
  ],
  '🎉 Social & Lifestyle': [
    '🎉 Parties', '🌃 Nightlife', '🎵 Concerts', '🎪 Festivals', '👗 Fashion', '🛍️ Shopping', '🤝 Volunteering', '❤️ Social Causes', '🗳️ Politics', '✊ Activism'
  ]
};

function InterestsStep({ data, onComplete, onBack, loading }: InterestsStepProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(data.interests);
  const [error, setError] = useState<string>('');

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else if (selectedInterests.length < 10) {
      setSelectedInterests(prev => [...prev, interest]);
    }
    setError('');
  };

  const validateForm = () => {
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest');
      return false;
    }
    if (selectedInterests.length > 10) {
      setError('Please select no more than 10 interests');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onComplete({ interests: selectedInterests });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Interests
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Select up to 10 interests that represent you. This helps us find people with similar passions!
      </Typography>
      <Typography variant="body2" color="primary" sx={{ mb: 3 }}>
        Selected: {selectedInterests.length}/10
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Your Selected Interests:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {selectedInterests.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              onDelete={() => handleInterestToggle(interest)}
              color="primary"
              variant="filled"
            />
          ))}
        </Box>
      </Box>

      {Object.entries(interestCategories).map(([category, interests]) => (
        <Accordion key={category} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {interests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                const canSelect = selectedInterests.length < 10 || isSelected;
                
                return (
                  <Grid item key={interest}>
                    <Chip
                      label={interest}
                      onClick={() => canSelect && handleInterestToggle(interest)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      disabled={!canSelect}
                      sx={{ 
                        cursor: canSelect ? 'pointer' : 'not-allowed',
                        opacity: canSelect ? 1 : 0.5 
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || selectedInterests.length === 0}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default InterestsStep;