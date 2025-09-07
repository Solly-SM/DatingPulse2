package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PhotoDTO;
import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.PhotoMapper;
import magnolia.datingpulse.DatingPulse.repositories.PhotoRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;
    private final PhotoMapper photoMapper;

    @Transactional
    public PhotoDTO createPhoto(PhotoDTO photoDTO) {
        // Map DTO to entity (user will be null initially)
        Photo photo = photoMapper.toEntity(photoDTO);

        // Fetch and set user entity
        User user = userRepository.findById(photoDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + photoDTO.getUserID()));
        photo.setUser(user);

        // Save and map back to DTO
        Photo saved = photoRepository.save(photo);
        return photoMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public PhotoDTO getPhotoById(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));
        return photoMapper.toDTO(photo);
    }

    @Transactional(readOnly = true)
    public List<PhotoDTO> getPhotosByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        List<Photo> photos = photoRepository.findByUser(user);
        return photos.stream().map(photoMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public PhotoDTO updatePhoto(Long photoId, PhotoDTO photoDTO) {
        Photo existing = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));

        // Optionally, update user if userID is present and different
        if (photoDTO.getUserID() != null && !photoDTO.getUserID().equals(existing.getUser().getUserID())) {
            User user = userRepository.findById(photoDTO.getUserID())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + photoDTO.getUserID()));
            existing.setUser(user);
        }

        // Update other fields
        existing.setDescription(photoDTO.getDescription());
        existing.setIsProfilePhoto(photoDTO.getIsProfilePhoto());
        existing.setIsPrivate(photoDTO.getIsPrivate());
        if (photoDTO.getVisibility() != null)
            existing.setVisibility(magnolia.datingpulse.DatingPulse.entity.PhotoVisibility.valueOf(photoDTO.getVisibility()));
        if (photoDTO.getStatus() != null)
            existing.setStatus(magnolia.datingpulse.DatingPulse.entity.PhotoStatus.valueOf(photoDTO.getStatus()));
        existing.setUpdatedAt(photoDTO.getUpdatedAt());
        existing.setOrderIndex(photoDTO.getOrderIndex());

        Photo updated = photoRepository.save(existing);
        return photoMapper.toDTO(updated);
    }

    @Transactional
    public void deletePhoto(Long photoId) {
        if (!photoRepository.existsById(photoId)) {
            throw new IllegalArgumentException("Photo not found with ID: " + photoId);
        }
        photoRepository.deleteById(photoId);
    }
}