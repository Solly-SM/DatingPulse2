package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Otp;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    List<Otp> findByUserAndIsUsedFalse(User user);
    Optional<Otp> findByCodeAndType(String code, String type);
    Optional<Otp> findByUserAndCodeAndTypeAndIsUsedFalse(User user, String code, String type);
    List<Otp> findByUserOrderByCreatedAtDesc(User user);
    List<Otp> findByUserAndTypeOrderByCreatedAtDesc(User user, String type);
    List<Otp> findByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);
    List<Otp> findByUserAndTypeAndIsUsedFalse(User user, String type);
    List<Otp> findByExpiresAtBeforeAndIsUsedFalse(LocalDateTime dateTime);
    List<Otp> findByCreatedAtBefore(LocalDateTime dateTime);
    Optional<Otp> findByUserAndTypeAndIsUsedFalseAndExpiresAtAfter(User user, String type, LocalDateTime dateTime);
    long countByIsUsedFalseAndExpiresAtAfter(LocalDateTime dateTime);
}