import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface BirthDateEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    dateOfBirth: string;
  };
  onSave: (data: { dateOfBirth: string }) => Promise<void>;
}

function BirthDateEditModal({ open, onClose, currentData, onSave }: BirthDateEditModalProps) {
  const [dateOfBirth, setDateOfBirth] = useState(currentData.dateOfBirth || '');
  const [loading, setLoading] = useState(false);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dateOfBirth);
  const isValidAge = age === null || age >= 18;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (age && age < 18) {
      alert('You must be at least 18 years old to use this app.');
      return;
    }
    
    setLoading(true);
    try {
      await onSave({ dateOfBirth });
      onClose();
    } catch (error) {
      console.error('Error saving birth date:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDateOfBirth(currentData.dateOfBirth || '');
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
              When's your birthday?
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
              Your age will be displayed on your profile. You must be at least 18 years old.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  py: 0.5,
                  '& fieldset': {
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                },
              }}
              variant="outlined"
            />

            {age && (
              <Typography
                variant="body2"
                color={isValidAge ? "text.secondary" : "error.main"}
                sx={{ 
                  mb: 3,
                  fontSize: '1rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  p: 2,
                  backgroundColor: isValidAge ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  borderRadius: 2,
                  border: `1px solid ${isValidAge ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                }}
              >
                You are {age} years old
                {!isValidAge && " - You must be at least 18 years old"}
              </Typography>
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
            disabled={loading || !dateOfBirth || !isValidAge}
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

export default BirthDateEditModal;