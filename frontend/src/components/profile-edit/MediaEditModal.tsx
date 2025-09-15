import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';

interface MediaEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { photos: File[]; profilePhotoIndex?: number }) => Promise<void>;
}

function MediaEditModal({ open, onClose, onSave }: MediaEditModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ photos: selectedFiles });
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Error saving photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
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
          minHeight: 400,
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
              📸 Add Photos
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
              Choose photos that represent you well
            </Typography>
          </Box>

          <Box sx={{ 
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(233, 30, 99, 0.05)',
            mb: 3
          }}>
            <PhotoCamera sx={{ fontSize: '4rem', color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Upload Photos
            </Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <Button variant="contained" component="span" sx={{
                background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}>
                Choose Photos
              </Button>
            </label>
          </Box>

          {selectedFiles.length > 0 && (
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'rgba(233, 30, 99, 0.05)', 
              borderRadius: 3,
              border: '1px solid rgba(233, 30, 99, 0.2)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Selected Photos: {selectedFiles.length}
              </Typography>
              {selectedFiles.map((file, index) => (
                <Typography key={index} variant="body2" color="text.secondary">
                  • {file.name}
                </Typography>
              ))}
            </Box>
          )}
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
            onClick={handleSave}
            variant="contained"
            disabled={loading || selectedFiles.length === 0}
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
            {loading ? 'Uploading...' : 'Save Photos'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default MediaEditModal;