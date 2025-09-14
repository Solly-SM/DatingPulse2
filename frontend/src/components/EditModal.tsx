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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'grey.500',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
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