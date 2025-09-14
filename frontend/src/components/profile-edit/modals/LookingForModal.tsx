import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import LookingForStep from '../../registration/profile-steps/LookingForStep';

interface LookingForModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    lookingFor?: string;
  };
  onSave: (data: { lookingFor?: string }) => void;
  loading?: boolean;
}

function LookingForModal({ 
  open, 
  onClose, 
  currentData, 
  onSave,
  loading = false
}: LookingForModalProps) {
  const handleComplete = (data: { lookingFor: string }) => {
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
          <LookingForStep
            data={{
              lookingFor: currentData.lookingFor || '',
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

export default LookingForModal;