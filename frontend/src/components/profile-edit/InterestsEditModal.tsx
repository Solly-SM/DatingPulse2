import React, { useState } from 'react';
import EditModal from '../EditModal';
import InterestsStep from '../registration/profile-steps/InterestsStep';

interface InterestsEditModalProps {
  open: boolean;
  onClose: () => void;
  currentInterests: string[];
  onSave: (interests: string[]) => Promise<void>;
}

const InterestsEditModal: React.FC<InterestsEditModalProps> = ({
  open,
  onClose,
  currentInterests,
  onSave,
}) => {
  const [interests, setInterests] = useState<string[]>(currentInterests);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(interests);
      onClose();
    } catch (error) {
      console.error('Error saving interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestsChange = (data: { interests: string[] }) => {
    setInterests(data.interests);
  };

  const handleCancel = () => {
    setInterests(currentInterests); // Reset to original values
    onClose();
  };

  return (
    <EditModal
      open={open}
      onClose={onClose}
      title="Edit Interests"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
      saveDisabled={interests.length === 0}
    >
      <InterestsStep
        data={{ interests }}
        onComplete={handleInterestsChange}
        onBack={() => {}} // Not used in modal
        loading={loading}
      />
    </EditModal>
  );
};

export default InterestsEditModal;