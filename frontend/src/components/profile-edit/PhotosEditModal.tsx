import React, { useState } from 'react';
import EditModal from '../EditModal';
import MediaStep from '../registration/profile-steps/MediaStep';

interface PhotosEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { photos: File[]; profilePhotoIndex?: number }) => Promise<void>;
}

const PhotosEditModal: React.FC<PhotosEditModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ photos });
      onClose();
    } catch (error) {
      console.error('Error saving photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotosChange = (data: { photos: File[]; profilePhotoIndex?: number; audioIntro?: File }) => {
    setPhotos(data.photos);
  };

  const handleCancel = () => {
    setPhotos([]); // Reset to original values
    onClose();
  };

  return (
    <EditModal
      open={open}
      onClose={onClose}
      title="📸 Photos & Media"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    >
      <MediaStep
        data={{ photos, audioIntro: undefined }}
        onComplete={handlePhotosChange}
        onBack={() => {}} // Not used in modal
        loading={loading}
      />
    </EditModal>
  );
};

export default PhotosEditModal;