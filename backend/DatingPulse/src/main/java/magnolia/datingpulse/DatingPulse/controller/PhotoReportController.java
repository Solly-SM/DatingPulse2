package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PhotoReportDTO;
import magnolia.datingpulse.DatingPulse.entity.ReportStatus;
import magnolia.datingpulse.DatingPulse.service.PhotoReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Validated
public class PhotoReportController {

    private final PhotoReportService photoReportService;

    /**
     * Report inappropriate photo content
     */
    @PostMapping
    public ResponseEntity<PhotoReportDTO> reportPhoto(@Valid @RequestBody PhotoReportDTO reportDTO) {
        try {
            PhotoReportDTO createdReport = photoReportService.createReport(reportDTO);
            return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get reports for a specific photo (Admin only)
     */
    @GetMapping("/photo/{photoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PhotoReportDTO>> getReportsForPhoto(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId) {
        List<PhotoReportDTO> reports = photoReportService.getReportsForPhoto(photoId);
        return ResponseEntity.ok(reports);
    }

    /**
     * Get all pending reports (Admin only)
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PhotoReportDTO>> getPendingReports() {
        List<PhotoReportDTO> reports = photoReportService.getPendingReports();
        return ResponseEntity.ok(reports);
    }

    /**
     * Get reports by status (Admin only)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PhotoReportDTO>> getReportsByStatus(@PathVariable String status) {
        try {
            ReportStatus reportStatus = ReportStatus.valueOf(status.toUpperCase());
            List<PhotoReportDTO> reports = photoReportService.getReportsByStatus(reportStatus);
            return ResponseEntity.ok(reports);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get reports by a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PhotoReportDTO>> getReportsByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<PhotoReportDTO> reports = photoReportService.getReportsByUser(userId);
        return ResponseEntity.ok(reports);
    }

    /**
     * Resolve a report (Admin only)
     */
    @PutMapping("/{reportId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoReportDTO> resolveReport(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId,
            @RequestParam("reviewerId") @Positive(message = "Reviewer ID must be positive") Long reviewerId,
            @RequestParam(value = "notes", defaultValue = "Report resolved") String resolutionNotes) {
        try {
            PhotoReportDTO resolvedReport = photoReportService.resolveReport(reportId, reviewerId, resolutionNotes);
            return ResponseEntity.ok(resolvedReport);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Dismiss a report (Admin only)
     */
    @PutMapping("/{reportId}/dismiss")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoReportDTO> dismissReport(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId,
            @RequestParam("reviewerId") @Positive(message = "Reviewer ID must be positive") Long reviewerId,
            @RequestParam(value = "reason", defaultValue = "No violation found") String dismissalReason) {
        try {
            PhotoReportDTO dismissedReport = photoReportService.dismissReport(reportId, reviewerId, dismissalReason);
            return ResponseEntity.ok(dismissedReport);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}