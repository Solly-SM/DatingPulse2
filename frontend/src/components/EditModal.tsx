import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  saveDisabled?: boolean;
  loading?: boolean;
}

const EditModal: React.FC<EditModalProps> = ({
  open,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  saveDisabled = false,
  loading = false,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
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
        },
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
          {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, pb: 4 }}>
        {children}
      </DialogContent>
      
      {(onSave || onCancel) && (
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCancel}
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          {onSave && (
            <Button
              onClick={onSave}
              variant="contained"
              disabled={saveDisabled || loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EditModal;