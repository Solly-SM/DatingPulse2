package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Message;
import magnolia.datingpulse.DatingPulse.entity.Conversation;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
    List<Message> findBySender(User sender);
    List<Message> findByReceiverAndIsReadFalse(User receiver);
}