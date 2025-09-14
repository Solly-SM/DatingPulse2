import React, { useState } from 'react';
import EditModal from '../EditModal';
import LifestyleStep from '../registration/profile-steps/LifestyleStep';

interface LifestyleEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    pets?: string;
    drinking?: string;
    smoking?: string;
    workout?: string;
    dietaryPreference?: string;
    socialMedia?: string;
    sleepingHabits?: string;
    languages?: string[];
  };
  onSave: (data: {
    pets?: string;
    drinking?: string;
    smoking?: string;
    workout?: string;
    dietaryPreference?: string;
    socialMedia?: string;
    sleepingHabits?: string;
    languages?: string[];
  }) => Promise<void>;
}

const LifestyleEditModal: React.FC<LifestyleEditModalProps> = ({
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
      console.error('Error saving lifestyle preferences:', error);
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
      title="Edit Lifestyle & Preferences"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    >
      <LifestyleStep
        data={formData}
        onComplete={handleDataChange}
        onBack={() => {}} // Not used in modal
        loading={loading}
      />
    </EditModal>
  );
};

export default LifestyleEditModal;