import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface PersonalityEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    communicationStyle?: string;
    loveLanguage?: string;
    zodiacSign?: string;
  };
  onSave: (data: { communicationStyle?: string; loveLanguage?: string; zodiacSign?: string }) => void;
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

function PersonalityEditModal({ 
  open, 
  onClose, 
  currentData, 
  onSave 
}: PersonalityEditModalProps) {
  const [formData, setFormData] = useState({
    communicationStyle: currentData.communicationStyle || '',
    loveLanguage: currentData.loveLanguage || '',
    zodiacSign: currentData.zodiacSign || '',
  });

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      communicationStyle: currentData.communicationStyle || '',
      loveLanguage: currentData.loveLanguage || '',
      zodiacSign: currentData.zodiacSign || '',
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 400,
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1, position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ✨ Personality & Traits
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Help us understand your personality and what makes you unique
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>What's your communication style?</InputLabel>
              <Select
                name="communicationStyle"
                value={formData.communicationStyle || ''}
                onChange={handleSelectChange}
                label="What's your communication style?"
              >
                {communicationStyles.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style}
                  </MenuItem>
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
                label="How do you receive love?"
              >
                {loveLanguages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
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
                label="What's your zodiac sign?"
              >
                {zodiacSigns.map((sign) => (
                  <MenuItem key={sign} value={sign}>
                    {sign}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: 'rgba(233, 30, 99, 0.04)', 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'rgba(233, 30, 99, 0.12)' 
        }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Optional:</strong> These details help potential matches understand your personality better, 
            but you can leave any field blank if you prefer.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PersonalityEditModal;