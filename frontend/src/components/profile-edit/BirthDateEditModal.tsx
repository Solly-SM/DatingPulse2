import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
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
  onSave: (data: {
    dateOfBirth: string;
  }) => Promise<void>;
}

const BirthDateEditModal: React.FC<BirthDateEditModalProps> = ({
  open,
  onClose,
  currentData,
  onSave,
}) => {
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

  const handleSave = async () => {
    const age = calculateAge(dateOfBirth);
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

  const age = calculateAge(dateOfBirth);
  const isValidAge = age === null || age >= 18;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ position: 'relative', mb: 3 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: -16,
              right: -16,
              color: 'grey.500',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            textAlign: 'center',
            mb: 2
          }}
        >
          When's your birthday?
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            textAlign: 'center'
          }}
        >
          Your age will be displayed on your profile. You must be at least 18 years old.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />

          {age && (
            <Typography
              variant="body2"
              color={isValidAge ? "text.secondary" : "error.main"}
              sx={{ textAlign: 'center' }}
            >
              You are {age} years old
              {!isValidAge && " - You must be at least 18 years old"}
            </Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handleCancel}
          disabled={loading}
          variant="outlined"
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
          disabled={loading || !dateOfBirth || !isValidAge}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #e91e63, #ff4081)',
            '&:hover': {
              background: 'linear-gradient(45deg, #c2185b, #e91e63)',
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
    </Dialog>
  );
};

export default BirthDateEditModal;