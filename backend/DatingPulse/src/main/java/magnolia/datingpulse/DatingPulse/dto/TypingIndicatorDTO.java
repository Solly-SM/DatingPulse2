package magnolia.datingpulse.DatingPulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for typing indicator events
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypingIndicatorDTO {
    private Long conversationId;
    private Long userId;
    private String username;
    private boolean isTyping;
    private Long timestamp;
}