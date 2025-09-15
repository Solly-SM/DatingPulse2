import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface InterestedInEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    interestedIn: string;
  };
  onSave: (data: { interestedIn: string }) => Promise<void>;
}

const interestedInOptions = [
  'Men',
  'Women', 
  'Non-binary',
  'Trans men',
  'Trans women',
  'All'
];

function InterestedInEditModal({ open, onClose, currentData, onSave }: InterestedInEditModalProps) {
  const [interestedIn, setInterestedIn] = useState<string[]>(
    currentData.interestedIn ? [currentData.interestedIn] : []
  );
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert array back to single string for compatibility
      const selectedValue = interestedIn.includes('All') ? 'both' : 
                           interestedIn.includes('Men') && interestedIn.includes('Women') ? 'both' :
                           interestedIn.includes('Men') ? 'male' :
                           interestedIn.includes('Women') ? 'female' : 'both';
      await onSave({ interestedIn: selectedValue });
      onClose();
    } catch (error) {
      console.error('Error saving interested in preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setInterestedIn(currentData.interestedIn ? [currentData.interestedIn] : []);
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
          borderRadius: 4,
          minHeight: 400,
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
              Who are you interested in?
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
              Select all that apply to help us find the right matches for you
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
              {interestedInOptions.map((option) => (
                <Grid item key={option}>
                  <Chip
                    label={option}
                    clickable
                    variant={interestedIn.includes(option) ? 'filled' : 'outlined'}
                    onClick={() => handleToggleOption(option)}
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      py: 3,
                      px: 2,
                      height: 'auto',
                      borderWidth: 2,
                      transition: 'all 0.2s ease-in-out',
                      bgcolor: interestedIn.includes(option) ? 'primary.main' : 'transparent',
                      color: interestedIn.includes(option) ? 'white' : 'text.primary',
                      borderColor: interestedIn.includes(option) ? 'primary.main' : 'divider',
                      '&:hover': {
                        bgcolor: interestedIn.includes(option) ? 'primary.dark' : 'rgba(233, 30, 99, 0.08)',
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.25)',
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {interestedIn.length > 0 && (
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                backgroundColor: 'rgba(233, 30, 99, 0.05)', 
                borderRadius: 2,
                border: '1px solid rgba(233, 30, 99, 0.2)',
                textAlign: 'center'
              }}>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                  Selected: {interestedIn.join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
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
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || interestedIn.length === 0}
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

export default InterestedInEditModal;