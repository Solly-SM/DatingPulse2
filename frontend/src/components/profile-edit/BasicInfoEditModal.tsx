import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface BasicInfoEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    firstName: string;
    bio: string;
    dateOfBirth: string;
  };
  onSave: (data: {
    firstName: string;
    bio: string;
    dateOfBirth: string;
  }) => Promise<void>;
}

const BasicInfoEditModal: React.FC<BasicInfoEditModalProps> = ({
  open,
  onClose,
  currentData,
  onSave,
}) => {
  const [formData, setFormData] = useState(currentData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving basic info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(currentData); // Reset to original values
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
          minHeight: 400,
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1, position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ✨ Basic Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tell us about yourself
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="About Me"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Tell others about yourself..."
            variant="outlined"
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleCancel}
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !formData.firstName.trim()}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BasicInfoEditModal;