package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.ProfileVerification;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProfileVerificationRepository extends JpaRepository<ProfileVerification, Long> {
    List<ProfileVerification> findByUser(User user);
    List<ProfileVerification> findByStatus(String status);
    List<ProfileVerification> findByUserAndType(User user, String type);
    List<ProfileVerification> findByUserAndTypeAndStatus(User user, String type, String status);
    List<ProfileVerification> findByStatusAndRequestedAtBefore(String status, LocalDateTime cutoffDate);
}