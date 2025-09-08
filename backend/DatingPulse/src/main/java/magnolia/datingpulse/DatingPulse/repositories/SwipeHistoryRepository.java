package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.SwipeHistory;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SwipeHistoryRepository extends JpaRepository<SwipeHistory, Long> {
    List<SwipeHistory> findByUser(User user);
    List<SwipeHistory> findByUserAndSwipeType(User user, String swipeType);
    Optional<SwipeHistory> findTopByUserOrderByCreatedAtDesc(User user);
    Optional<SwipeHistory> findByUserAndTargetUser(User user, User targetUser);
}