import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import DistancePreferenceStep from '../../registration/profile-steps/DistancePreferenceStep';

interface DistancePreferenceModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    maxDistance?: number;
  };
  onSave: (data: { maxDistance?: number }) => void;
  loading?: boolean;
}

function DistancePreferenceModal({ 
  open, 
  onClose, 
  currentData, 
  onSave,
  loading = false
}: DistancePreferenceModalProps) {
  const handleComplete = (data: { maxDistance: number }) => {
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
          <DistancePreferenceStep
            data={{
              maxDistance: currentData.maxDistance || 50,
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

export default DistancePreferenceModal;