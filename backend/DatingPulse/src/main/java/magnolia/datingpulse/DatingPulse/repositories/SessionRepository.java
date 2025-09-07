package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Session;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, String> {
    List<Session> findByUser(User user);
    Optional<Session> findByToken(String token);
    List<Session> findByUserAndRevokedAtIsNullAndExpiresAtAfter(User user, LocalDateTime dateTime);
    List<Session> findByUserAndRevokedAtIsNull(User user);
    List<Session> findByExpiresAtBeforeAndRevokedAtIsNull(LocalDateTime dateTime);
    List<Session> findByRevokedAtIsNotNull();
    List<Session> findByCreatedAtBefore(LocalDateTime dateTime);
    boolean existsByUserAndRevokedAtIsNullAndExpiresAtAfter(User user, LocalDateTime dateTime);
    long countByRevokedAtIsNullAndExpiresAtAfter(LocalDateTime dateTime);
    long countByUser(User user);
    long countByUserAndRevokedAtIsNullAndExpiresAtAfter(User user, LocalDateTime dateTime);
}