import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Typography,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface SexualOrientationEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    sexualOrientation?: string;
    showOrientation?: boolean;
  };
  onSave: (data: { sexualOrientation?: string; showOrientation?: boolean }) => void;
}

function SexualOrientationEditModal({ 
  open, 
  onClose, 
  currentData, 
  onSave 
}: SexualOrientationEditModalProps) {
  const [sexualOrientation, setSexualOrientation] = useState(currentData.sexualOrientation || '');
  const [showOrientation, setShowOrientation] = useState(currentData.showOrientation || false);

  const orientationOptions = [
    { value: 'straight', label: 'Straight', description: 'Attracted to people of the opposite gender' },
    { value: 'gay', label: 'Gay', description: 'Attracted to people of the same gender' },
    { value: 'lesbian', label: 'Lesbian', description: 'Women attracted to women' },
    { value: 'bisexual', label: 'Bisexual', description: 'Attracted to people of more than one gender' },
    { value: 'pansexual', label: 'Pansexual', description: 'Attracted to people regardless of gender' },
    { value: 'asexual', label: 'Asexual', description: 'Little to no sexual attraction to others' },
    { value: 'demisexual', label: 'Demisexual', description: 'Sexual attraction only after emotional bond' },
    { value: 'queer', label: 'Queer', description: 'Non-heterosexual orientation' },
    { value: 'questioning', label: 'Questioning', description: 'Exploring your sexual orientation' },
    { value: 'other', label: 'Other', description: 'Another orientation not listed' },
  ];

  const handleSave = () => {
    onSave({ sexualOrientation, showOrientation });
    onClose();
  };

  const handleCancel = () => {
    setSexualOrientation(currentData.sexualOrientation || '');
    setShowOrientation(currentData.showOrientation || false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🏳️‍🌈 Sexual Orientation
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose how you identify - this helps us find compatible matches
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <RadioGroup
            value={sexualOrientation}
            onChange={(e) => setSexualOrientation(e.target.value)}
            sx={{ gap: 1 }}
          >
            {orientationOptions.map((option) => (
              <Box
                key={option.value}
                sx={{
                  border: '1px solid',
                  borderColor: sexualOrientation === option.value ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  p: 2,
                  transition: 'all 0.2s ease',
                  backgroundColor: sexualOrientation === option.value ? 'rgba(233, 30, 99, 0.04)' : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)',
                  },
                }}
              >
                <FormControlLabel
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {option.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {option.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ margin: 0, width: '100%' }}
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showOrientation}
                onChange={(e) => setShowOrientation(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">
                  Show my sexual orientation on my profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This helps potential matches understand your identity
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!sexualOrientation}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SexualOrientationEditModal;