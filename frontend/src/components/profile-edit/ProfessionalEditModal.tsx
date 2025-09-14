import React, { useState } from 'react';
import EditModal from '../EditModal';
import ProfessionalStep from '../registration/profile-steps/ProfessionalStep';

interface ProfessionalEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    education?: string;
    occupation?: string;
    jobTitle?: string;
  };
  onSave: (data: {
    education?: string;
    occupation?: string;
    jobTitle?: string;
  }) => Promise<void>;
}

const ProfessionalEditModal: React.FC<ProfessionalEditModalProps> = ({
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
      console.error('Error saving professional information:', error);
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
      title="Edit Professional Information"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    >
      <ProfessionalStep
        data={formData}
        onComplete={handleDataChange}
        onBack={() => {}} // Not used in modal
        loading={loading}
      />
    </EditModal>
  );
};

export default ProfessionalEditModal;