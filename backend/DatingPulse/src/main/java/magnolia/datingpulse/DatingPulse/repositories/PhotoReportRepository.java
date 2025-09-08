package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.PhotoReport;
import magnolia.datingpulse.DatingPulse.entity.ReportStatus;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoReportRepository extends JpaRepository<PhotoReport, Long> {
    List<PhotoReport> findByStatus(ReportStatus status);
    List<PhotoReport> findByReporter(User reporter);
    List<PhotoReport> findByPhoto_PhotoID(Long photoId);
    boolean existsByPhoto_PhotoIDAndReporter(Long photoId, User reporter);
}