import React, { useState } from 'react';
import EditModal from '../EditModal';
import PhysicalAttributesStep from '../registration/profile-steps/PhysicalAttributesStep';

interface PhysicalAttributesEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    height?: number;
    weight?: number;
    bodyType?: string;
    ethnicity?: string;
  };
  onSave: (data: {
    height?: number;
    weight?: number;
    bodyType?: string;
    ethnicity?: string;
  }) => Promise<void>;
}

const PhysicalAttributesEditModal: React.FC<PhysicalAttributesEditModalProps> = ({
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
      console.error('Error saving physical attributes:', error);
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
      title="💪 Physical Attributes"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    >
      <PhysicalAttributesStep
        data={formData}
        onComplete={handleDataChange}
        onBack={() => {}} // Not used in modal
        loading={loading}
        hideNavigation={true}
      />
    </EditModal>
  );
};

export default PhysicalAttributesEditModal;