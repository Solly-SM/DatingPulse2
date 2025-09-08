package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PhotoDTO;
import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.entity.PhotoStatus;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.PhotoMapper;
import magnolia.datingpulse.DatingPulse.repositories.PhotoRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;
    private final PhotoMapper photoMapper;
    private final FileUploadService fileUploadService;
    private final ContentModerationService contentModerationService;

    @Transactional
    public PhotoDTO createPhoto(PhotoDTO photoDTO) {
        // Map DTO to entity (user will be null initially)
        Photo photo = photoMapper.toEntity(photoDTO);

        // Fetch and set user entity
        User user = userRepository.findById(photoDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + photoDTO.getUserID()));
        photo.setUser(user);

        // Set default values
        if (photo.getUploadedAt() == null) {
            photo.setUploadedAt(LocalDateTime.now());
        }
        if (photo.getStatus() == null) {
            photo.setStatus(PhotoStatus.PENDING);
        }

        // Save and map back to DTO
        Photo saved = photoRepository.save(photo);
        
        // Trigger automatic moderation
        contentModerationService.moderatePhoto(saved.getPhotoID(), saved.getDescription());
        
        return photoMapper.toDTO(saved);
    }

    /**
     * Upload a photo file and create photo record
     */
    @Transactional
    public PhotoDTO uploadPhoto(MultipartFile file, Long userId, String description, Boolean isProfilePhoto) throws IOException {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Upload file to cloud storage
        String photoUrl;
        if (Boolean.TRUE.equals(isProfilePhoto)) {
            photoUrl = fileUploadService.uploadProfilePhoto(file, userId);
        } else {
            photoUrl = fileUploadService.uploadPhoto(file, userId);
        }

        // Create photo entity
        Photo photo = Photo.builder()
                .user(user)
                .url(photoUrl)
                .description(description)
                .isProfilePhoto(Boolean.TRUE.equals(isProfilePhoto))
                .isPrivate(false)
                .visibility(magnolia.datingpulse.DatingPulse.entity.PhotoVisibility.PUBLIC)
                .status(PhotoStatus.PENDING)
                .uploadedAt(LocalDateTime.now())
                .orderIndex(0)
                .build();

        Photo saved = photoRepository.save(photo);
        
        // Trigger automatic moderation
        contentModerationService.moderatePhoto(saved.getPhotoID(), description);
        
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

    /**
     * Get active photos for a user (only ACTIVE status photos)
     */
    @Transactional(readOnly = true)
    public List<PhotoDTO> getActivePhotosByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        List<Photo> photos = photoRepository.findByUserAndStatus(user, PhotoStatus.ACTIVE);
        return photos.stream().map(photoMapper::toDTO).collect(Collectors.toList());
    }

    /**
     * Set a photo as profile photo
     */
    @Transactional
    public PhotoDTO setAsProfilePhoto(Long photoId, Long userId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));

        // Verify ownership
        if (!photo.getUser().getUserID().equals(userId)) {
            throw new IllegalArgumentException("You can only set your own photos as profile photo");
        }

        // Only allow active photos as profile photos
        if (photo.getStatus() != PhotoStatus.ACTIVE) {
            throw new IllegalArgumentException("Only approved photos can be set as profile photo");
        }

        // Remove profile photo status from other photos
        User user = photo.getUser();
        List<Photo> currentProfilePhotos = photoRepository.findByIsProfilePhotoTrueAndUser(user);
        for (Photo currentProfile : currentProfilePhotos) {
            currentProfile.setIsProfilePhoto(false);
        }
        photoRepository.saveAll(currentProfilePhotos);

        // Set this photo as profile photo
        photo.setIsProfilePhoto(true);
        photo.setUpdatedAt(LocalDateTime.now());
        Photo updated = photoRepository.save(photo);

        return photoMapper.toDTO(updated);
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
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setOrderIndex(photoDTO.getOrderIndex());

        Photo updated = photoRepository.save(existing);
        
        // Re-moderate if description changed
        if (photoDTO.getDescription() != null && !photoDTO.getDescription().equals(existing.getDescription())) {
            contentModerationService.moderatePhoto(updated.getPhotoID(), updated.getDescription());
        }
        
        return photoMapper.toDTO(updated);
    }

    @Transactional
    public void deletePhoto(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));

        // Delete from cloud storage
        try {
            fileUploadService.deletePhoto(photo.getUrl());
        } catch (Exception e) {
            // Log error but continue with database deletion
            // In production, you might want to queue this for retry
        }

        photoRepository.deleteById(photoId);
    }
}