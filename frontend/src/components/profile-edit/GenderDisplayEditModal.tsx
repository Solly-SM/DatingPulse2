import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface GenderDisplayEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    gender: string;
    showGender: boolean;
  };
  onSave: (data: { gender: string; showGender: boolean }) => Promise<void>;
}

function GenderDisplayEditModal({ open, onClose, currentData, onSave }: GenderDisplayEditModalProps) {
  const [gender, setGender] = useState(currentData.gender || '');
  const [showGender, setShowGender] = useState(currentData.showGender || false);
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { value: 'man', label: 'Man', symbol: '♂' },
    { value: 'woman', label: 'Woman', symbol: '♀' },
    { value: 'non-binary', label: 'Non-binary', symbol: '⚧' },
    { value: 'other', label: 'Other', symbol: '◊' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ gender, showGender });
      onClose();
    } catch (error) {
      console.error('Error saving gender information:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setGender(currentData.gender || '');
    setShowGender(currentData.showGender || false);
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
              What's your gender?
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
              Choose how you identify
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
              <RadioGroup
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                sx={{ gap: 2 }}
              >
                {genderOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '1.5rem',
                            color: gender === option.value ? 'primary.main' : 'text.secondary',
                            fontWeight: 600,
                          }}
                        >
                          {option.symbol}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          {option.label}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      m: 0,
                      p: 2.5,
                      border: '2px solid',
                      borderColor: gender === option.value ? 'primary.main' : 'divider',
                      borderRadius: 3,
                      backgroundColor: gender === option.value ? 'primary.light' : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: gender === option.value ? 'primary.light' : 'rgba(233, 30, 99, 0.08)',
                        borderColor: 'primary.main',
                        transform: 'translateY(-1px)',
                        boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.15)',
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={showGender}
                  onChange={(e) => setShowGender(e.target.checked)}
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
                  Show my gender on my profile
                </Typography>
              }
              sx={{
                mb: 4,
                p: 2,
                borderRadius: 2,
                backgroundColor: showGender ? 'rgba(233, 30, 99, 0.05)' : 'transparent',
                transition: 'background-color 0.2s ease-in-out',
              }}
            />
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
            disabled={loading || !gender}
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

export default GenderDisplayEditModal;