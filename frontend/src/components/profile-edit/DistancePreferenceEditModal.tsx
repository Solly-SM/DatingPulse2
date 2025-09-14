import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface DistancePreferenceEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    maxDistance?: number;
  };
  onSave: (data: { maxDistance?: number }) => void;
}

function DistancePreferenceEditModal({ 
  open, 
  onClose, 
  currentData, 
  onSave 
}: DistancePreferenceEditModalProps) {
  const [maxDistance, setMaxDistance] = useState<number>(currentData.maxDistance || 50);

  const handleDistanceChange = (event: Event, newValue: number | number[]) => {
    setMaxDistance(newValue as number);
  };

  const getDistanceText = (distance: number) => {
    if (distance >= 100) {
      return 'Anywhere';
    }
    return `${distance} km`;
  };

  const handleSave = () => {
    onSave({ maxDistance });
    onClose();
  };

  const handleCancel = () => {
    setMaxDistance(currentData.maxDistance || 50);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          📍 Distance Preference
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          How far are you willing to travel to meet someone?
        </Typography>

        <Box sx={{ px: 2, mb: 4 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 3,
            p: 3,
            backgroundColor: 'rgba(233, 30, 99, 0.04)',
            borderRadius: 3,
            border: '1px solid rgba(233, 30, 99, 0.2)',
          }}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {getDistanceText(maxDistance)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Maximum distance for potential matches
            </Typography>
          </Box>

          <Slider
            value={maxDistance}
            onChange={handleDistanceChange}
            min={1}
            max={100}
            step={1}
            marks={[
              { value: 1, label: '1km' },
              { value: 25, label: '25km' },
              { value: 50, label: '50km' },
              { value: 75, label: '75km' },
              { value: 100, label: 'Anywhere' },
            ]}
            sx={{
              color: 'primary.main',
              height: 8,
              '& .MuiSlider-track': {
                border: 'none',
                background: 'linear-gradient(90deg, #e91e63 0%, #ff4081 100%)',
              },
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'inherit',
                },
                '&:before': {
                  display: 'none',
                },
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#bfbfbf',
                height: 8,
                width: 1,
                '&.MuiSlider-markActive': {
                  opacity: 1,
                  backgroundColor: 'currentColor',
                },
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
                color: 'text.secondary',
              },
            }}
          />
        </Box>

        <Box sx={{ 
          p: 2, 
          backgroundColor: 'background.paper', 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Tip:</strong> Choosing a larger distance gives you more potential matches, 
            but you might need to travel further for dates.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DistancePreferenceEditModal;