package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.dto.PhotoReportDTO;
import magnolia.datingpulse.DatingPulse.entity.*;
import magnolia.datingpulse.DatingPulse.mapper.PhotoReportMapper;
import magnolia.datingpulse.DatingPulse.repositories.PhotoRepository;
import magnolia.datingpulse.DatingPulse.repositories.PhotoReportRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
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
class PhotoReportServiceTest {

    @Mock
    private PhotoReportRepository photoReportRepository;

    @Mock
    private PhotoRepository photoRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PhotoReportMapper photoReportMapper;

    @Mock
    private ContentModerationService contentModerationService;

    @InjectMocks
    private PhotoReportService photoReportService;

    private Photo testPhoto;
    private User testReporter;
    private User testReviewer;
    private PhotoReportDTO testReportDTO;
    private PhotoReport testReport;

    @BeforeEach
    void setUp() {
        testReporter = User.builder()
                .userID(1L)
                .username("reporter")
                .email("reporter@example.com")
                .password("hashedpassword")
                .role("USER")
                .status("ACTIVE")
                .build();

        testReviewer = User.builder()
                .userID(2L)
                .username("reviewer")
                .email("reviewer@example.com")
                .password("hashedpassword")
                .role("ADMIN")
                .status("ACTIVE")
                .build();

        testPhoto = Photo.builder()
                .photoID(1L)
                .user(testReporter)
                .url("https://example.com/photo.jpg")
                .description("Test photo")
                .status(PhotoStatus.ACTIVE)
                .uploadedAt(LocalDateTime.now())
                .build();

        testReportDTO = new PhotoReportDTO();
        testReportDTO.setPhotoId(1L);
        testReportDTO.setReporterId(1L);
        testReportDTO.setReportType("INAPPROPRIATE_CONTENT");
        testReportDTO.setAdditionalDetails("This photo contains inappropriate content");

        testReport = PhotoReport.builder()
                .reportId(1L)
                .photo(testPhoto)
                .reporter(testReporter)
                .reportType(ReportType.INAPPROPRIATE_CONTENT)
                .additionalDetails("This photo contains inappropriate content")
                .status(ReportStatus.PENDING)
                .reportedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createReport_WithValidData_ShouldCreateReport() {
        // Given
        when(photoRepository.findById(1L)).thenReturn(Optional.of(testPhoto));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testReporter));
        when(photoReportRepository.existsByPhoto_PhotoIDAndReporter(1L, testReporter)).thenReturn(false);
        when(photoReportRepository.save(any(PhotoReport.class))).thenReturn(testReport);
        when(photoReportMapper.toDTO(testReport)).thenReturn(testReportDTO);

        // When
        PhotoReportDTO result = photoReportService.createReport(testReportDTO);

        // Then
        assertNotNull(result);
        verify(photoReportRepository).save(any(PhotoReport.class));
        verify(contentModerationService).flagPhoto(eq(1L), eq(1L), anyString());
    }

    @Test
    void createReport_WithNonExistentPhoto_ShouldThrowException() {
        // Given
        when(photoRepository.findById(999L)).thenReturn(Optional.empty());
        testReportDTO.setPhotoId(999L);

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> photoReportService.createReport(testReportDTO));
    }

    @Test
    void createReport_WithDuplicateReport_ShouldThrowException() {
        // Given
        when(photoRepository.findById(1L)).thenReturn(Optional.of(testPhoto));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testReporter));
        when(photoReportRepository.existsByPhoto_PhotoIDAndReporter(1L, testReporter)).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> photoReportService.createReport(testReportDTO));
    }

    @Test
    void resolveReport_WithValidData_ShouldResolveReport() {
        // Given
        when(photoReportRepository.findById(1L)).thenReturn(Optional.of(testReport));
        when(userRepository.findById(2L)).thenReturn(Optional.of(testReviewer));
        when(photoReportRepository.save(any(PhotoReport.class))).thenReturn(testReport);
        when(photoReportMapper.toDTO(testReport)).thenReturn(testReportDTO);

        // When
        PhotoReportDTO result = photoReportService.resolveReport(1L, 2L, "Resolved after review");

        // Then
        assertNotNull(result);
        assertEquals(ReportStatus.RESOLVED, testReport.getStatus());
        assertEquals(testReviewer, testReport.getReviewedBy());
        assertNotNull(testReport.getReviewedAt());
        verify(photoReportRepository).save(testReport);
    }

    @Test
    void dismissReport_WithValidData_ShouldDismissReport() {
        // Given
        when(photoReportRepository.findById(1L)).thenReturn(Optional.of(testReport));
        when(userRepository.findById(2L)).thenReturn(Optional.of(testReviewer));
        when(photoReportRepository.save(any(PhotoReport.class))).thenReturn(testReport);
        when(photoReportMapper.toDTO(testReport)).thenReturn(testReportDTO);

        // When
        PhotoReportDTO result = photoReportService.dismissReport(1L, 2L, "No violation found");

        // Then
        assertNotNull(result);
        assertEquals(ReportStatus.DISMISSED, testReport.getStatus());
        assertEquals(testReviewer, testReport.getReviewedBy());
        assertNotNull(testReport.getReviewedAt());
        verify(photoReportRepository).save(testReport);
    }
}