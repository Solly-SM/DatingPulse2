package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversationDTO {
    private Long conversationID;
    
    @NotNull(message = "Match ID is required")
    @Positive(message = "Match ID must be positive")
    private Long matchID;
    
    private LocalDateTime startedAt;
    
    @Positive(message = "Last message ID must be positive")
    private Long lastMessageID;
    
    private Boolean deletedForUser1;
    private Boolean deletedForUser2;
}