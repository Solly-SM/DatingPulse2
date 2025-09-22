package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.entity.PhotoStatus;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.PhotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContentModerationServiceTest {

    @Mock
    private PhotoRepository photoRepository;

    @InjectMocks
    private ContentModerationService contentModerationService;

    private Photo testPhoto;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Set up test values for private fields using reflection
        setField(contentModerationService, "autoApprove", false);
        setField(contentModerationService, "blockedKeywords", "nude,explicit,inappropriate");

        testUser = User.builder()
                .userID(1L)
                .username("testuser")
                .email("test@example.com")
                
                .role("USER")
                .status("ACTIVE")
                .build();

        testPhoto = Photo.builder()
                .photoID(1L)
                .user(testUser)
                .url("https://example.com/photo.jpg")
                .description("A nice photo")
                .status(PhotoStatus.PENDING)
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void moderatePhoto_WithCleanDescription_ShouldSetToPending() {
        // Given
        when(photoRepository.findById(1L)).thenReturn(Optional.of(testPhoto));
        when(photoRepository.save(any(Photo.class))).thenReturn(testPhoto);

        // When
        PhotoStatus result = contentModerationService.moderatePhoto(1L, "A beautiful sunset");

        // Then
        assertEquals(PhotoStatus.PENDING, result);
        verify(photoRepository).save(testPhoto);
    }

    @Test
    void moderatePhoto_WithInappropriateDescription_ShouldReject() {
        // Given
        when(photoRepository.findById(1L)).thenReturn(Optional.of(testPhoto));
        when(photoRepository.save(any(Photo.class))).thenReturn(testPhoto);

        // When
        PhotoStatus result = contentModerationService.moderatePhoto(1L, "This is nude content");

        // Then
        assertEquals(PhotoStatus.REJECTED, result);
        verify(photoRepository).save(testPhoto);
    }

    @Test
    void moderatePhoto_WithNonExistentPhoto_ShouldThrowException() {
        // Given
        when(photoRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> contentModerationService.moderatePhoto(999L, "description"));
    }

    @Test
    void approvePhoto_ShouldSetStatusToActive() {
        // Given
        when(photoRepository.findById(1L)).thenReturn(Optional.of(testPhoto));
        when(photoRepository.save(any(Photo.class))).thenReturn(testPhoto);

        // When
        contentModerationService.approvePhoto(1L);

        // Then
        assertEquals(PhotoStatus.ACTIVE, testPhoto.getStatus());
        assertNotNull(testPhoto.getUpdatedAt());
        verify(photoRepository).save(testPhoto);
    }

    @Test
    void rejectPhoto_ShouldSetStatusToRejected() {
        // Given
        when(photoRepository.findById(1L)).thenReturn(Optional.of(testPhoto));
        when(photoRepository.save(any(Photo.class))).thenReturn(testPhoto);

        // When
        contentModerationService.rejectPhoto(1L, "Inappropriate content");

        // Then
        assertEquals(PhotoStatus.REJECTED, testPhoto.getStatus());
        assertNotNull(testPhoto.getUpdatedAt());
        verify(photoRepository).save(testPhoto);
    }

    @Test
    void flagPhoto_ShouldSetStatusToFlagged() {
        // Given
        when(photoRepository.findById(1L)).thenReturn(Optional.of(testPhoto));
        when(photoRepository.save(any(Photo.class))).thenReturn(testPhoto);

        // When
        contentModerationService.flagPhoto(1L, 2L, "Reported as inappropriate");

        // Then
        assertEquals(PhotoStatus.FLAGGED, testPhoto.getStatus());
        assertNotNull(testPhoto.getUpdatedAt());
        verify(photoRepository).save(testPhoto);
    }
}