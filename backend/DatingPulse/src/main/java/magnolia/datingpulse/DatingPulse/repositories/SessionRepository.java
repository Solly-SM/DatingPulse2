package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Session;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUser(User user);
    Optional<Session> findByToken(String token);
    List<Session> findByUserAndIsActiveAndExpiresAtAfter(User user, Boolean isActive, LocalDateTime dateTime);
    List<Session> findByUserAndIsActive(User user, Boolean isActive);
    List<Session> findByExpiresAtBeforeAndIsActive(LocalDateTime dateTime, Boolean isActive);
    List<Session> findByIsActive(Boolean isActive);
    List<Session> findByCreatedAtBefore(LocalDateTime dateTime);
    boolean existsByUserAndIsActiveAndExpiresAtAfter(User user, Boolean isActive, LocalDateTime dateTime);
    long countByIsActiveAndExpiresAtAfter(Boolean isActive, LocalDateTime dateTime);
    long countByUser(User user);
    long countByUserAndIsActiveAndExpiresAtAfter(User user, Boolean isActive, LocalDateTime dateTime);
}