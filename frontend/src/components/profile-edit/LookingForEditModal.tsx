import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface LookingForEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    lookingFor?: string;
  };
  onSave: (data: { lookingFor?: string }) => Promise<void>;
}

const lookingForOptions = [
  { value: 'serious_relationship', label: 'Serious Relationship', emoji: '💕' },
  { value: 'casual_dating', label: 'Casual Dating', emoji: '🍷' },
  { value: 'friendship', label: 'Friendship', emoji: '🤝' },
  { value: 'something_fun', label: 'Something Fun', emoji: '🎉' },
  { value: 'not_sure', label: 'Not Sure Yet', emoji: '🤷' },
  { value: 'marriage', label: 'Marriage', emoji: '💍' },
];

function LookingForEditModal({ 
  open, 
  onClose, 
  currentData, 
  onSave 
}: LookingForEditModalProps) {
  const [lookingFor, setLookingFor] = useState<string>(currentData.lookingFor || '');
  const [loading, setLoading] = useState(false);

  const handleSelectOption = (option: string) => {
    setLookingFor(option);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ lookingFor });
      onClose();
    } catch (error) {
      console.error('Error saving looking for preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLookingFor(currentData.lookingFor || '');
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
          minHeight: 500,
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
              💫 What are you looking for?
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
              Choose what best describes what you're hoping to find
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {lookingForOptions.map((option) => (
              <Grid item xs={12} sm={6} key={option.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: lookingFor === option.value ? 'primary.main' : 'divider',
                    backgroundColor: lookingFor === option.value ? 'rgba(233, 30, 99, 0.08)' : 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: lookingFor === option.value ? 'rgba(233, 30, 99, 0.12)' : 'rgba(233, 30, 99, 0.04)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 8px 24px rgba(233, 30, 99, 0.25)',
                    },
                  }}
                  onClick={() => handleSelectOption(option.value)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h3" sx={{ mb: 2, fontSize: '3rem' }}>
                      {option.emoji}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: lookingFor === option.value ? 'primary.main' : 'text.primary',
                        fontWeight: 600
                      }}
                    >
                      {option.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {lookingFor && (
            <Box sx={{ 
              mt: 3, 
              p: 3, 
              backgroundColor: 'rgba(233, 30, 99, 0.05)', 
              borderRadius: 3,
              border: '1px solid rgba(233, 30, 99, 0.2)',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                Selected: {lookingForOptions.find(opt => opt.value === lookingFor)?.label}
              </Typography>
            </Box>
          )}
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
            disabled={loading || !lookingFor}
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

export default LookingForEditModal;