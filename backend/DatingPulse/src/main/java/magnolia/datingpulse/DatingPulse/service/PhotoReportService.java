package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import magnolia.datingpulse.DatingPulse.dto.PhotoReportDTO;
import magnolia.datingpulse.DatingPulse.entity.*;
import magnolia.datingpulse.DatingPulse.mapper.PhotoReportMapper;
import magnolia.datingpulse.DatingPulse.repositories.PhotoRepository;
import magnolia.datingpulse.DatingPulse.repositories.PhotoReportRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoReportService {

    private final PhotoReportRepository photoReportRepository;
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;
    private final PhotoReportMapper photoReportMapper;
    private final ContentModerationService contentModerationService;

    /**
     * Create a new photo report
     */
    @Transactional
    public PhotoReportDTO createReport(PhotoReportDTO reportDTO) {
        // Validate photo exists
        Photo photo = photoRepository.findById(reportDTO.getPhotoId())
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with ID: " + reportDTO.getPhotoId()));

        // Validate reporter exists
        User reporter = userRepository.findById(reportDTO.getReporterId())
                .orElseThrow(() -> new IllegalArgumentException("Reporter not found with ID: " + reportDTO.getReporterId()));

        // Check if user has already reported this photo
        if (photoReportRepository.existsByPhoto_PhotoIDAndReporter(reportDTO.getPhotoId(), reporter)) {
            throw new IllegalArgumentException("You have already reported this photo");
        }

        // Create the report
        PhotoReport report = PhotoReport.builder()
                .photo(photo)
                .reporter(reporter)
                .reportType(ReportType.valueOf(reportDTO.getReportType()))
                .additionalDetails(reportDTO.getAdditionalDetails())
                .status(ReportStatus.PENDING)
                .reportedAt(LocalDateTime.now())
                .build();

        PhotoReport savedReport = photoReportRepository.save(report);

        // Automatically flag the photo for review
        contentModerationService.flagPhoto(photo.getPhotoID(), reporter.getUserID(), 
                                          reportDTO.getReportType() + ": " + reportDTO.getAdditionalDetails());

        log.info("Photo report created: {} for photo {} by user {}", 
                savedReport.getReportId(), photo.getPhotoID(), reporter.getUserID());

        return photoReportMapper.toDTO(savedReport);
    }

    /**
     * Get all reports for a specific photo
     */
    @Transactional(readOnly = true)
    public List<PhotoReportDTO> getReportsForPhoto(Long photoId) {
        List<PhotoReport> reports = photoReportRepository.findByPhoto_PhotoID(photoId);
        return reports.stream()
                .map(photoReportMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all pending reports
     */
    @Transactional(readOnly = true)
    public List<PhotoReportDTO> getPendingReports() {
        List<PhotoReport> reports = photoReportRepository.findByStatus(ReportStatus.PENDING);
        return reports.stream()
                .map(photoReportMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Resolve a report
     */
    @Transactional
    public PhotoReportDTO resolveReport(Long reportId, Long reviewerId, String resolutionNotes) {
        PhotoReport report = photoReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + reportId));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer not found with ID: " + reviewerId));

        report.setStatus(ReportStatus.RESOLVED);
        report.setReviewedAt(LocalDateTime.now());
        report.setReviewedBy(reviewer);
        report.setResolutionNotes(resolutionNotes);

        PhotoReport savedReport = photoReportRepository.save(report);

        log.info("Photo report {} resolved by user {} with notes: {}", 
                reportId, reviewerId, resolutionNotes);

        return photoReportMapper.toDTO(savedReport);
    }

    /**
     * Dismiss a report
     */
    @Transactional
    public PhotoReportDTO dismissReport(Long reportId, Long reviewerId, String dismissalReason) {
        PhotoReport report = photoReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + reportId));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer not found with ID: " + reviewerId));

        report.setStatus(ReportStatus.DISMISSED);
        report.setReviewedAt(LocalDateTime.now());
        report.setReviewedBy(reviewer);
        report.setResolutionNotes(dismissalReason);

        PhotoReport savedReport = photoReportRepository.save(report);

        log.info("Photo report {} dismissed by user {} with reason: {}", 
                reportId, reviewerId, dismissalReason);

        return photoReportMapper.toDTO(savedReport);
    }

    /**
     * Get reports by a specific user
     */
    @Transactional(readOnly = true)
    public List<PhotoReportDTO> getReportsByUser(Long userId) {
        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<PhotoReport> reports = photoReportRepository.findByReporter(reporter);
        return reports.stream()
                .map(photoReportMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all reports with a specific status
     */
    @Transactional(readOnly = true)
    public List<PhotoReportDTO> getReportsByStatus(ReportStatus status) {
        List<PhotoReport> reports = photoReportRepository.findByStatus(status);
        return reports.stream()
                .map(photoReportMapper::toDTO)
                .collect(Collectors.toList());
    }
}