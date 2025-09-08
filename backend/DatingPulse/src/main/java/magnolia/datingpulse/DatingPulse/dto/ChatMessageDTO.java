package magnolia.datingpulse.DatingPulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for WebSocket chat messages including real-time features
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private String type; // MESSAGE, TYPING_START, TYPING_STOP, USER_ONLINE, USER_OFFLINE, MESSAGE_READ
    private Long conversationId;
    private Long senderId;
    private String senderUsername;
    private Long receiverId;
    private String content;
    private String messageType; // TEXT, IMAGE, AUDIO, VIDEO, SYSTEM, FILE
    private Long timestamp;
    private Long messageId; // For read receipts
}