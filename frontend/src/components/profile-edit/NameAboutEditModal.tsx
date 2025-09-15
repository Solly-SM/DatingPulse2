import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface NameAboutEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    firstName: string;
    bio: string;
  };
  onSave: (data: { firstName: string; bio: string }) => Promise<void>;
}

function NameAboutEditModal({ open, onClose, currentData, onSave }: NameAboutEditModalProps) {
  const [formData, setFormData] = useState(currentData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving name and about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(currentData);
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
          borderRadius: 4,
          minHeight: 500,
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
          boxShadow: '0 8px 32px rgba(233, 30, 99, 0.15)'
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 0 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ px: 4, pt: 6, pb: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              What's your name?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              This will be displayed on your profile
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  py: 0.5,
                  '& fieldset': {
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                },
              }}
              variant="outlined"
              placeholder="Enter your first name"
            />

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  mt: 2,
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Tell us about yourself
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                Share what makes you unique and what you're passionate about
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="About Me"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="I love adventure and meeting new people! When I'm not exploring new places, you can find me trying out new restaurants or enjoying a good book. I'm looking for someone who shares my passion for life and is ready for genuine connections..."
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  '& fieldset': {
                    borderWidth: 2,
                  },
                  '& textarea': {
                    lineHeight: 1.6,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                },
              }}
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={loading}
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
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.firstName.trim()}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
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
      </Box>
    </Dialog>
  );
}

export default NameAboutEditModal;