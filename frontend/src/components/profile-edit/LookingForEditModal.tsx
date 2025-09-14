import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface LookingForEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    lookingFor?: string;
  };
  onSave: (data: { lookingFor?: string }) => void;
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

  const handleSelectOption = (option: string) => {
    setLookingFor(option);
  };

  const handleSave = () => {
    onSave({ lookingFor });
    onClose();
  };

  const handleCancel = () => {
    setLookingFor(currentData.lookingFor || '');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          💫 What are you looking for?
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose what best describes what you're hoping to find
        </Typography>

        <Grid container spacing={2}>
          {lookingForOptions.map((option) => (
            <Grid item xs={12} sm={6} key={option.value}>
              <Box
                onClick={() => handleSelectOption(option.value)}
                sx={{
                  border: '2px solid',
                  borderColor: lookingFor === option.value ? 'primary.main' : 'divider',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: lookingFor === option.value ? 'rgba(233, 30, 99, 0.04)' : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(233, 30, 99, 0.15)',
                  },
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {option.emoji}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="medium"
                  color={lookingFor === option.value ? 'primary.main' : 'text.primary'}
                >
                  {option.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {lookingFor && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(233, 30, 99, 0.04)', borderRadius: 2 }}>
            <Typography variant="body2" color="primary.main" fontWeight="medium">
              Selected: {lookingForOptions.find(opt => opt.value === lookingFor)?.label}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!lookingFor}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LookingForEditModal;