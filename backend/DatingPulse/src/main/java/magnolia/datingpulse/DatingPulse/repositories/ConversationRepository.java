package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Conversation;
import magnolia.datingpulse.DatingPulse.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long>
{
    Optional<Conversation> findByMatch(Match match);


    // Find all conversations where the match involves a specific user (by userOne or userTwo)
    // You need a custom JPQL or @Query for this, since Conversation -> Match -> User
    // Example using @Query (if you want to fetch all conversations involving a user):

    @Query("SELECT c FROM Conversation c WHERE c.match.userOne.userID = :userId OR c.match.userTwo.userID = :userId")
    List<Conversation> findAllByUserId(@Param("userId") Long userId);


}
