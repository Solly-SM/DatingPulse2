import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import SexualOrientationStep from '../../registration/profile-steps/SexualOrientationStep';

interface SexualOrientationModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    sexualOrientation?: string;
    showOrientation?: boolean;
  };
  onSave: (data: { sexualOrientation?: string; showOrientation?: boolean }) => void;
  loading?: boolean;
}

function SexualOrientationModal({ 
  open, 
  onClose, 
  currentData, 
  onSave,
  loading = false
}: SexualOrientationModalProps) {
  const handleComplete = (data: { sexualOrientation: string; showOrientation: boolean }) => {
    onSave(data);
    onClose();
  };

  const handleBack = () => {
    onClose();
  };

  const handleSkip = () => {
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
          <SexualOrientationStep
            data={{
              sexualOrientation: currentData.sexualOrientation || '',
              showOrientation: currentData.showOrientation || false,
            }}
            onComplete={handleComplete}
            onBack={handleBack}
            onSkip={handleSkip}
            loading={loading}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
}

export default SexualOrientationModal;