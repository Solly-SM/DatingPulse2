import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Typography,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface SexualOrientationEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    sexualOrientation?: string;
    showOrientation?: boolean;
  };
  onSave: (data: { sexualOrientation?: string; showOrientation?: boolean }) => Promise<void>;
}

function SexualOrientationEditModal({ 
  open, 
  onClose, 
  currentData, 
  onSave 
}: SexualOrientationEditModalProps) {
  const [sexualOrientation, setSexualOrientation] = useState(currentData.sexualOrientation || '');
  const [showOrientation, setShowOrientation] = useState(currentData.showOrientation || false);
  const [loading, setLoading] = useState(false);

  const orientationOptions = [
    { value: 'straight', label: 'Straight', description: 'Attracted to people of the opposite gender' },
    { value: 'gay', label: 'Gay', description: 'Attracted to people of the same gender' },
    { value: 'lesbian', label: 'Lesbian', description: 'Women attracted to women' },
    { value: 'bisexual', label: 'Bisexual', description: 'Attracted to people of more than one gender' },
    { value: 'pansexual', label: 'Pansexual', description: 'Attracted to people regardless of gender' },
    { value: 'asexual', label: 'Asexual', description: 'Little to no sexual attraction to others' },
    { value: 'demisexual', label: 'Demisexual', description: 'Sexual attraction only after emotional bond' },
    { value: 'queer', label: 'Queer', description: 'Non-heterosexual orientation' },
    { value: 'questioning', label: 'Questioning', description: 'Exploring your sexual orientation' },
    { value: 'other', label: 'Other', description: 'Another orientation not listed' },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ sexualOrientation, showOrientation });
      onClose();
    } catch (error) {
      console.error('Error saving sexual orientation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSexualOrientation(currentData.sexualOrientation || '');
    setShowOrientation(currentData.showOrientation || false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: 600,
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
          boxShadow: '0 8px 32px rgba(233, 30, 99, 0.15)'
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 0 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ px: 4, pt: 6, pb: 2 }}>
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
              🏳️‍🌈 Sexual Orientation
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
              Choose how you identify - this helps us find compatible matches
            </Typography>
          </Box>

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
                    border: '2px solid',
                    borderColor: sexualOrientation === option.value ? 'primary.main' : 'divider',
                    borderRadius: 3,
                    p: 2.5,
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: sexualOrientation === option.value ? 'rgba(233, 30, 99, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: sexualOrientation === option.value ? 'rgba(233, 30, 99, 0.12)' : 'rgba(233, 30, 99, 0.04)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.15)',
                    },
                  }}
                  onClick={() => setSexualOrientation(option.value)}
                >
                  <FormControlLabel
                    value={option.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                          {option.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ margin: 0, width: '100%' }}
                  />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={{ 
            mt: 3, 
            p: 3, 
            backgroundColor: 'rgba(233, 30, 99, 0.05)', 
            borderRadius: 3,
            border: '1px solid rgba(233, 30, 99, 0.2)'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.95rem', lineHeight: 1.6 }}>
              💡 <strong>Privacy Tip:</strong> Your sexual orientation helps us match you with compatible people. 
              You can choose whether to display this on your profile.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOrientation}
                  onChange={(e) => setShowOrientation(e.target.checked)}
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
                  Show my sexual orientation on my profile
                </Typography>
              }
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={loading || !sexualOrientation}
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SexualOrientationEditModal;