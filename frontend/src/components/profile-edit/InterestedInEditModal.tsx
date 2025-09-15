import React from 'react';
import { Dialog } from '@mui/material';

interface InterestedInEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: any;
  onSave: (data: any) => Promise<void>;
}

function InterestedInEditModal({ open, onClose }: InterestedInEditModalProps) {
  return <Dialog open={open} onClose={onClose}><div>Interested In Modal - Coming Soon</div></Dialog>;
}

export default InterestedInEditModal;