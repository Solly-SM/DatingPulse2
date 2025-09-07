package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.ReportDTO;
import magnolia.datingpulse.DatingPulse.entity.Admin;
import magnolia.datingpulse.DatingPulse.entity.Report;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.ReportMapper;
import magnolia.datingpulse.DatingPulse.repositories.AdminRepository;
import magnolia.datingpulse.DatingPulse.repositories.ReportRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final ReportMapper reportMapper;

    @Transactional
    public ReportDTO createReport(ReportDTO reportDTO) {
        // Validate reporter exists
        User reporter = userRepository.findById(reportDTO.getReporterID())
                .orElseThrow(() -> new IllegalArgumentException("Reporter user not found with ID: " + reportDTO.getReporterID()));

        // Validate reported user exists
        User reported = userRepository.findById(reportDTO.getReportedID())
                .orElseThrow(() -> new IllegalArgumentException("Reported user not found with ID: " + reportDTO.getReportedID()));

        // Prevent self-reporting
        if (reportDTO.getReporterID().equals(reportDTO.getReportedID())) {
            throw new IllegalArgumentException("User cannot report themselves");
        }

        // Validate report reason and target type
        if (!isValidReportReason(reportDTO.getReason())) {
            throw new IllegalArgumentException("Invalid report reason: " + reportDTO.getReason());
        }
        if (!isValidTargetType(reportDTO.getTargetType())) {
            throw new IllegalArgumentException("Invalid target type: " + reportDTO.getTargetType());
        }

        // Create report
        Report report = reportMapper.toEntity(reportDTO);
        report.setReporter(reporter);
        report.setReported(reported);
        report.setReportedAt(LocalDateTime.now());
        report.setStatus("PENDING");

        Report saved = reportRepository.save(report);
        return reportMapper.toDTO(saved);
    }

    @Transactional
    public ReportDTO reportUser(Long reporterId, Long reportedId, String reason) {
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setReporterID(reporterId);
        reportDTO.setReportedID(reportedId);
        reportDTO.setTargetType("USER");
        reportDTO.setTargetID(reportedId);
        reportDTO.setReason(reason);

        return createReport(reportDTO);
    }

    @Transactional
    public ReportDTO reportPhoto(Long reporterId, Long reportedUserId, Long photoId, String reason) {
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setReporterID(reporterId);
        reportDTO.setReportedID(reportedUserId);
        reportDTO.setTargetType("PHOTO");
        reportDTO.setTargetID(photoId);
        reportDTO.setReason(reason);

        return createReport(reportDTO);
    }

    @Transactional
    public ReportDTO reportMessage(Long reporterId, Long reportedUserId, Long messageId, String reason) {
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setReporterID(reporterId);
        reportDTO.setReportedID(reportedUserId);
        reportDTO.setTargetType("MESSAGE");
        reportDTO.setTargetID(messageId);
        reportDTO.setReason(reason);

        return createReport(reportDTO);
    }

    @Transactional(readOnly = true)
    public ReportDTO getReportById(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + reportId));
        return reportMapper.toDTO(report);
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getReportsByStatus(String status) {
        if (!isValidReportStatus(status)) {
            throw new IllegalArgumentException("Invalid report status: " + status);
        }

        List<Report> reports = reportRepository.findByStatus(status);
        return reports.stream().map(reportMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getPendingReports() {
        return getReportsByStatus("PENDING");
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getReportsUnderReview() {
        return getReportsByStatus("UNDER_REVIEW");
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getResolvedReports() {
        return getReportsByStatus("RESOLVED");
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getDismissedReports() {
        return getReportsByStatus("DISMISSED");
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getReportsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Report> reports = reportRepository.findByReporter(user);
        return reports.stream().map(reportMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getReportsAgainstUser(Long userId) {
        List<Report> allReports = reportRepository.findAll();
        return allReports.stream()
                .filter(report -> report.getReported().getUserID().equals(userId))
                .map(reportMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        return reports.stream().map(reportMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ReportDTO updateReportStatus(Long reportId, String newStatus, Long adminId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + reportId));

        if (!isValidReportStatus(newStatus)) {
            throw new IllegalArgumentException("Invalid report status: " + newStatus);
        }

        // Set admin reviewer if provided
        if (adminId != null) {
            Admin admin = adminRepository.findById(adminId)
                    .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));
            report.setReviewedBy(admin);
        }

        report.setStatus(newStatus);

        // Set resolved timestamp if status is resolved or dismissed
        if ("RESOLVED".equals(newStatus) || "DISMISSED".equals(newStatus)) {
            report.setResolvedAt(LocalDateTime.now());
        }

        Report updated = reportRepository.save(report);
        return reportMapper.toDTO(updated);
    }

    @Transactional
    public ReportDTO assignReportToAdmin(Long reportId, Long adminId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + reportId));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));

        report.setReviewedBy(admin);
        report.setStatus("UNDER_REVIEW");

        Report updated = reportRepository.save(report);
        return reportMapper.toDTO(updated);
    }

    @Transactional
    public ReportDTO resolveReport(Long reportId, Long adminId) {
        return updateReportStatus(reportId, "RESOLVED", adminId);
    }

    @Transactional
    public ReportDTO dismissReport(Long reportId, Long adminId) {
        return updateReportStatus(reportId, "DISMISSED", adminId);
    }

    @Transactional
    public void deleteReport(Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new IllegalArgumentException("Report not found with ID: " + reportId);
        }
        reportRepository.deleteById(reportId);
    }

    @Transactional(readOnly = true)
    public long countReportsByStatus(String status) {
        return getReportsByStatus(status).size();
    }

    @Transactional(readOnly = true)
    public long countPendingReports() {
        return countReportsByStatus("PENDING");
    }

    @Transactional(readOnly = true)
    public long countReportsAgainstUser(Long userId) {
        return getReportsAgainstUser(userId).size();
    }

    @Transactional(readOnly = true)
    public long countReportsByUser(Long userId) {
        return getReportsByUser(userId).size();
    }

    @Transactional(readOnly = true)
    public boolean hasUserReportedTarget(Long reporterId, String targetType, Long targetId) {
        List<ReportDTO> userReports = getReportsByUser(reporterId);
        return userReports.stream()
                .anyMatch(report -> targetType.equals(report.getTargetType()) && 
                                  targetId.equals(report.getTargetID()));
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getRecentReports(int limit) {
        List<ReportDTO> allReports = getAllReports();
        return allReports.stream()
                .sorted((r1, r2) -> r2.getReportedAt().compareTo(r1.getReportedAt()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cleanupOldReports(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<Report> allReports = reportRepository.findAll();
        
        List<Report> oldReports = allReports.stream()
                .filter(report -> report.getReportedAt().isBefore(cutoffDate))
                .filter(report -> "RESOLVED".equals(report.getStatus()) || "DISMISSED".equals(report.getStatus()))
                .collect(Collectors.toList());

        reportRepository.deleteAll(oldReports);
    }

    private boolean isValidReportReason(String reason) {
        return reason != null && reason.matches("^(INAPPROPRIATE_CONTENT|HARASSMENT|SPAM|FAKE_PROFILE|UNDERAGE|VIOLENCE|HATE_SPEECH|OTHER)$");
    }

    private boolean isValidTargetType(String targetType) {
        return targetType != null && targetType.matches("^(USER|PHOTO|MESSAGE|AUDIO|PROFILE)$");
    }

    private boolean isValidReportStatus(String status) {
        return status != null && status.matches("^(PENDING|UNDER_REVIEW|RESOLVED|DISMISSED)$");
    }
}