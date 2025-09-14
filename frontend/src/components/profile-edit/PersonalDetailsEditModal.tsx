import React, { useState } from 'react';
import EditModal from '../EditModal';
import PersonalDetailsStep from '../registration/profile-steps/PersonalDetailsStep';

interface PersonalDetailsEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    location: string;
  };
  onSave: (data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    location: string;
  }) => Promise<void>;
}

const PersonalDetailsEditModal: React.FC<PersonalDetailsEditModalProps> = ({
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
      console.error('Error saving personal details:', error);
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

  const isValid = formData.firstName.trim() && 
                  formData.lastName.trim() && 
                  formData.dateOfBirth && 
                  formData.gender && 
                  formData.location.trim();

  return (
    <EditModal
      open={open}
      onClose={onClose}
      title="Edit Personal Details"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
      saveDisabled={!isValid}
    >
      <PersonalDetailsStep
        data={formData}
        onComplete={handleDataChange}
        onBack={() => {}} // Not used in modal
        loading={loading}
      />
    </EditModal>
  );
};

export default PersonalDetailsEditModal;