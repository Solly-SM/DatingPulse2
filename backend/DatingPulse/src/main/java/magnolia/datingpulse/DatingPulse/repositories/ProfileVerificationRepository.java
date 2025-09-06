package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.ProfileVerification;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfileVerificationRepository extends JpaRepository<ProfileVerification, Long> {
    List<ProfileVerification> findByUser(User user);
    List<ProfileVerification> findByStatus(String status);
}