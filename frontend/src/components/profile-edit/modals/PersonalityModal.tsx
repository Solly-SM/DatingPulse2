import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import PersonalityStep from '../../registration/profile-steps/PersonalityStep';

interface PersonalityModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    communicationStyle?: string;
    loveLanguage?: string;
    zodiacSign?: string;
  };
  onSave: (data: { 
    communicationStyle?: string; 
    loveLanguage?: string; 
    zodiacSign?: string; 
  }) => void;
  loading?: boolean;
}

function PersonalityModal({ 
  open, 
  onClose, 
  currentData, 
  onSave,
  loading = false
}: PersonalityModalProps) {
  const handleComplete = (data: { 
    communicationStyle?: string; 
    loveLanguage?: string; 
    zodiacSign?: string; 
  }) => {
    onSave(data);
    onClose();
  };

  const handleBack = () => {
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
          p: 0,
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            bgcolor: 'white',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
        >
          <Close />
        </IconButton>
        
        <DialogContent sx={{ p: 0 }}>
          <PersonalityStep
            data={{
              communicationStyle: currentData.communicationStyle || '',
              loveLanguage: currentData.loveLanguage || '',
              zodiacSign: currentData.zodiacSign || '',
            }}
            onComplete={handleComplete}
            onBack={handleBack}
            loading={loading}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
}

export default PersonalityModal;