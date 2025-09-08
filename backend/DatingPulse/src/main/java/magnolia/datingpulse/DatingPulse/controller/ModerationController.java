package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.entity.PhotoStatus;
import magnolia.datingpulse.DatingPulse.service.ContentModerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moderation")
@RequiredArgsConstructor
@Validated
public class ModerationController {

    private final ContentModerationService contentModerationService;

    /**
     * Get photos pending moderation (Admin only)
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Photo>> getPhotosPendingModeration() {
        List<Photo> pendingPhotos = contentModerationService.getPhotosPendingModeration();
        return ResponseEntity.ok(pendingPhotos);
    }

    /**
     * Get flagged photos (Admin only)
     */
    @GetMapping("/flagged")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Photo>> getFlaggedPhotos() {
        List<Photo> flaggedPhotos = contentModerationService.getFlaggedPhotos();
        return ResponseEntity.ok(flaggedPhotos);
    }

    /**
     * Manually approve a photo (Admin only)
     */
    @PutMapping("/photos/{photoId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approvePhoto(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId) {
        try {
            contentModerationService.approvePhoto(photoId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Manually reject a photo (Admin only)
     */
    @PutMapping("/photos/{photoId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectPhoto(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId,
            @RequestParam(value = "reason", defaultValue = "Content policy violation") String reason) {
        try {
            contentModerationService.rejectPhoto(photoId, reason);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Bulk approve photos (Admin only)
     */
    @PutMapping("/photos/approve-bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> bulkApprovePhotos(@RequestBody List<Long> photoIds) {
        try {
            contentModerationService.bulkApprovePhotos(photoIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Bulk reject photos (Admin only)
     */
    @PutMapping("/photos/reject-bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> bulkRejectPhotos(
            @RequestBody List<Long> photoIds,
            @RequestParam(value = "reason", defaultValue = "Content policy violation") String reason) {
        try {
            contentModerationService.bulkRejectPhotos(photoIds, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Trigger moderation for a specific photo (Admin only)
     */
    @PostMapping("/photos/{photoId}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoStatus> moderatePhoto(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId,
            @RequestParam(value = "description", required = false) String description) {
        try {
            PhotoStatus status = contentModerationService.moderatePhoto(photoId, description);
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}