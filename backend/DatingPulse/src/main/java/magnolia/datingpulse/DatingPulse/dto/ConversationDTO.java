package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversationDTO {
    private Long conversationID;
    private Long matchID;
    private LocalDateTime startedAt;
    private Long lastMessageID;
    private Boolean deletedForUser1;
    private Boolean deletedForUser2;
}