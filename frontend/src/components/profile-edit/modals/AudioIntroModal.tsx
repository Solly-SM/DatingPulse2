import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import AudioIntroStep from '../../registration/profile-steps/AudioIntroStep';

interface AudioIntroModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    audioIntroUrl?: string;
  };
  onSave: (data: { audioIntro?: File | null; removeAudio?: boolean }) => void;
  loading?: boolean;
}

function AudioIntroModal({ 
  open, 
  onClose, 
  currentData, 
  onSave,
  loading = false
}: AudioIntroModalProps) {
  const handleComplete = (data: { audioIntro?: File }) => {
    onSave({ audioIntro: data.audioIntro });
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
          <AudioIntroStep
            data={{
              audioIntro: undefined, // Let the step component handle existing audio
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

export default AudioIntroModal;