import React, { useState } from 'react';
import EditModal from '../EditModal';
import DatingPreferencesStep from '../registration/profile-steps/DatingPreferencesStep';

interface DatingPreferencesEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    relationshipGoal?: string;
    sexualOrientation?: string;
    lookingFor?: string;
    maxDistance?: number;
  };
  onSave: (data: {
    relationshipGoal?: string;
    sexualOrientation?: string;
    lookingFor?: string;
    maxDistance?: number;
  }) => Promise<void>;
}

const DatingPreferencesEditModal: React.FC<DatingPreferencesEditModalProps> = ({
  open,
  onClose,
  currentData,
  onSave,
}) => {
  const [formData, setFormData] = useState(currentData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving dating preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (data: typeof formData) => {
    setFormData(data);
  };

  const handleCancel = () => {
    setFormData(currentData); // Reset to original values
    onClose();
  };

  return (
    <EditModal
      open={open}
      onClose={onClose}
      title="Edit Dating Preferences"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    >
      <DatingPreferencesStep
        data={formData}
        onComplete={handleDataChange}
        onBack={() => {}} // Not used in modal
        loading={loading}
      />
    </EditModal>
  );
};

export default DatingPreferencesEditModal;