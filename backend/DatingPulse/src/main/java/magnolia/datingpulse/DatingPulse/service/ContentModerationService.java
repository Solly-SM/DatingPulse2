package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import magnolia.datingpulse.DatingPulse.dto.PhotoDTO;
import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.entity.PhotoStatus;
import magnolia.datingpulse.DatingPulse.repositories.PhotoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContentModerationService {

    private final PhotoRepository photoRepository;

    @Value("${app.moderation.auto-approve:false}")
    private boolean autoApprove;

    @Value("${app.moderation.blocked-keywords:nude,explicit,inappropriate}")
    private String blockedKeywords;

    // Simple content filtering patterns (in production, use ML services like AWS Rekognition)
    private static final List<String> INAPPROPRIATE_PATTERNS = Arrays.asList(
            "nude", "naked", "explicit", "nsfw", "adult", "sex", "porn"
    );

    /**
     * Moderate photo content automatically
     */
    @Transactional
    public PhotoStatus moderatePhoto(Long photoId, String description) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));

        PhotoStatus status = performAutomaticModeration(description);
        
        photo.setStatus(status);
        
        photoRepository.save(photo);

        log.info("Photo {} moderated with status: {}", photoId, status);
        return status;
    }

    /**
     * Perform automatic content moderation
     */
    private PhotoStatus performAutomaticModeration(String description) {
        // Check for inappropriate content in description
        if (description != null && containsInappropriateContent(description)) {
            return PhotoStatus.REJECTED;
        }

        // If auto-approval is enabled and content passes basic checks
        if (autoApprove) {
            return PhotoStatus.ACTIVE;
        }

        // Default to pending for manual review
        return PhotoStatus.PENDING;
    }

    /**
     * Check if content contains inappropriate keywords
     */
    private boolean containsInappropriateContent(String text) {
        String lowerText = text.toLowerCase();
        
        // Check blocked keywords from configuration
        if (blockedKeywords != null && !blockedKeywords.trim().isEmpty()) {
            List<String> blockedList = Arrays.asList(blockedKeywords.split(","));
            for (String keyword : blockedList) {
                if (lowerText.contains(keyword.trim().toLowerCase())) {
                    return true;
                }
            }
        }

        // Check predefined inappropriate patterns
        return INAPPROPRIATE_PATTERNS.stream()
                .anyMatch(pattern -> lowerText.contains(pattern));
    }

    /**
     * Approve a photo manually
     */
    @Transactional
    public void approvePhoto(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));

        photo.setStatus(PhotoStatus.ACTIVE);
        
        photoRepository.save(photo);

        log.info("Photo {} manually approved", photoId);
    }

    /**
     * Reject a photo manually
     */
    @Transactional
    public void rejectPhoto(Long photoId, String reason) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));

        photo.setStatus(PhotoStatus.REJECTED);
        
        photoRepository.save(photo);

        log.info("Photo {} manually rejected. Reason: {}", photoId, reason);
    }

    /**
     * Flag a photo as inappropriate (user reporting)
     */
    @Transactional
    public void flagPhoto(Long photoId, Long reporterId, String reason) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + photoId));

        photo.setStatus(PhotoStatus.FLAGGED);
        
        photoRepository.save(photo);

        log.info("Photo {} flagged by user {} for reason: {}", photoId, reporterId, reason);
    }

    /**
     * Get photos pending moderation
     */
    @Transactional(readOnly = true)
    public List<Photo> getPhotosPendingModeration() {
        return photoRepository.findByStatus(PhotoStatus.PENDING);
    }

    /**
     * Get flagged photos for review
     */
    @Transactional(readOnly = true)
    public List<Photo> getFlaggedPhotos() {
        return photoRepository.findByStatus(PhotoStatus.FLAGGED);
    }

    /**
     * Bulk approve photos
     */
    @Transactional
    public void bulkApprovePhotos(List<Long> photoIds) {
        List<Photo> photos = photoRepository.findAllById(photoIds);
        
        for (Photo photo : photos) {
            photo.setStatus(PhotoStatus.ACTIVE);
            
        }
        
        photoRepository.saveAll(photos);
        log.info("Bulk approved {} photos", photos.size());
    }

    /**
     * Bulk reject photos
     */
    @Transactional
    public void bulkRejectPhotos(List<Long> photoIds, String reason) {
        List<Photo> photos = photoRepository.findAllById(photoIds);
        
        for (Photo photo : photos) {
            photo.setStatus(PhotoStatus.REJECTED);
            
        }
        
        photoRepository.saveAll(photos);
        log.info("Bulk rejected {} photos. Reason: {}", photos.size(), reason);
    }
}