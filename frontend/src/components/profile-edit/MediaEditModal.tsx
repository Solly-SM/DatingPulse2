import React from 'react';
import { Dialog } from '@mui/material';

interface MediaEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

function MediaEditModal({ open, onClose }: MediaEditModalProps) {
  return <Dialog open={open} onClose={onClose}><div>Media Modal - Coming Soon</div></Dialog>;
}

export default MediaEditModal;