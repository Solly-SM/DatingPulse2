package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Match;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    Optional<Match> findByUserOneAndUserTwo(User userOne, User userTwo);
    List<Match> findByUserOneOrUserTwo(User userOne, User userTwo);
    List<Match> findByIsActiveTrueAndExpiresAtAfter(java.time.LocalDateTime now);
}