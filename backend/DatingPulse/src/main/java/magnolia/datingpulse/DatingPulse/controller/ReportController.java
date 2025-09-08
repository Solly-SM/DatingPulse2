package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.ReportDTO;
import magnolia.datingpulse.DatingPulse.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Validated
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportDTO> createReport(@Valid @RequestBody ReportDTO reportDTO) {
        try {
            ReportDTO createdReport = reportService.createReport(reportDTO);
            return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/user")
    public ResponseEntity<ReportDTO> reportUser(
            @RequestParam @Positive(message = "Reporter ID must be positive") Long reporterId,
            @RequestParam @Positive(message = "Reported ID must be positive") Long reportedId,
            @RequestParam @NotBlank(message = "Reason is required") String reason) {
        try {
            ReportDTO report = reportService.reportUser(reporterId, reportedId, reason);
            return new ResponseEntity<>(report, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/photo")
    public ResponseEntity<ReportDTO> reportPhoto(
            @RequestParam @Positive(message = "Reporter ID must be positive") Long reporterId,
            @RequestParam @Positive(message = "Reported user ID must be positive") Long reportedUserId,
            @RequestParam @Positive(message = "Photo ID must be positive") Long photoId,
            @RequestParam @NotBlank(message = "Reason is required") String reason) {
        try {
            ReportDTO report = reportService.reportPhoto(reporterId, reportedUserId, photoId, reason);
            return new ResponseEntity<>(report, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/message")
    public ResponseEntity<ReportDTO> reportMessage(
            @RequestParam @Positive(message = "Reporter ID must be positive") Long reporterId,
            @RequestParam @Positive(message = "Reported user ID must be positive") Long reportedUserId,
            @RequestParam @Positive(message = "Message ID must be positive") Long messageId,
            @RequestParam @NotBlank(message = "Reason is required") String reason) {
        try {
            ReportDTO report = reportService.reportMessage(reporterId, reportedUserId, messageId, reason);
            return new ResponseEntity<>(report, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportDTO> getReportById(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId) {
        try {
            ReportDTO report = reportService.getReportById(reportId);
            return ResponseEntity.ok(report);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReportDTO>> getReportsByStatus(
            @PathVariable @NotBlank(message = "Status cannot be blank") String status) {
        List<ReportDTO> reports = reportService.getReportsByStatus(status);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ReportDTO>> getPendingReports() {
        List<ReportDTO> reports = reportService.getPendingReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/under-review")
    public ResponseEntity<List<ReportDTO>> getReportsUnderReview() {
        List<ReportDTO> reports = reportService.getReportsUnderReview();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/resolved")
    public ResponseEntity<List<ReportDTO>> getResolvedReports() {
        List<ReportDTO> reports = reportService.getResolvedReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/dismissed")
    public ResponseEntity<List<ReportDTO>> getDismissedReports() {
        List<ReportDTO> reports = reportService.getDismissedReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<ReportDTO>> getReportsByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<ReportDTO> reports = reportService.getReportsByUser(userId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/against-user/{userId}")
    public ResponseEntity<List<ReportDTO>> getReportsAgainstUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<ReportDTO> reports = reportService.getReportsAgainstUser(userId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping
    public ResponseEntity<List<ReportDTO>> getAllReports() {
        List<ReportDTO> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{reportId}/status")
    public ResponseEntity<ReportDTO> updateReportStatus(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId,
            @RequestParam @NotBlank(message = "Status is required") String newStatus,
            @RequestParam @Positive(message = "Admin ID must be positive") Long adminId) {
        try {
            ReportDTO updatedReport = reportService.updateReportStatus(reportId, newStatus, adminId);
            return ResponseEntity.ok(updatedReport);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{reportId}/assign")
    public ResponseEntity<ReportDTO> assignReportToAdmin(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId,
            @RequestParam @Positive(message = "Admin ID must be positive") Long adminId) {
        try {
            ReportDTO updatedReport = reportService.assignReportToAdmin(reportId, adminId);
            return ResponseEntity.ok(updatedReport);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{reportId}/resolve")
    public ResponseEntity<ReportDTO> resolveReport(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId,
            @RequestParam @Positive(message = "Admin ID must be positive") Long adminId) {
        try {
            ReportDTO resolvedReport = reportService.resolveReport(reportId, adminId);
            return ResponseEntity.ok(resolvedReport);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{reportId}/dismiss")
    public ResponseEntity<ReportDTO> dismissReport(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId,
            @RequestParam @Positive(message = "Admin ID must be positive") Long adminId) {
        try {
            ReportDTO dismissedReport = reportService.dismissReport(reportId, adminId);
            return ResponseEntity.ok(dismissedReport);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(
            @PathVariable @Positive(message = "Report ID must be positive") Long reportId) {
        try {
            reportService.deleteReport(reportId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countReportsByStatus(
            @PathVariable @NotBlank(message = "Status cannot be blank") String status) {
        long count = reportService.countReportsByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/pending")
    public ResponseEntity<Long> countPendingReports() {
        long count = reportService.countPendingReports();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/against-user/{userId}")
    public ResponseEntity<Long> countReportsAgainstUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = reportService.countReportsAgainstUser(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/by-user/{userId}")
    public ResponseEntity<Long> countReportsByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = reportService.countReportsByUser(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/check-reported")
    public ResponseEntity<Boolean> hasUserReportedTarget(
            @RequestParam @Positive(message = "Reporter ID must be positive") Long reporterId,
            @RequestParam @NotBlank(message = "Target type is required") String targetType,
            @RequestParam @Positive(message = "Target ID must be positive") Long targetId) {
        boolean hasReported = reportService.hasUserReportedTarget(reporterId, targetType, targetId);
        return ResponseEntity.ok(hasReported);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ReportDTO>> getRecentReports(
            @RequestParam(defaultValue = "20") int limit) {
        List<ReportDTO> reports = reportService.getRecentReports(limit);
        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> cleanupOldReports(
            @RequestParam(defaultValue = "365") int daysOld) {
        reportService.cleanupOldReports(daysOld);
        return ResponseEntity.ok().build();
    }
}