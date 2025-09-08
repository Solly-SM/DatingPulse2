package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "WebSocket chat message for real-time communication")
public class ChatMessageDTO {
    
    @NotBlank(message = "Message type is required")
    @Pattern(regexp = "^(MESSAGE|TYPING_START|TYPING_STOP|USER_ONLINE|USER_OFFLINE|MESSAGE_READ)$", 
             message = "Type must be MESSAGE, TYPING_START, TYPING_STOP, USER_ONLINE, USER_OFFLINE, or MESSAGE_READ")
    @Schema(description = "WebSocket message type", example = "MESSAGE", 
            allowableValues = {"MESSAGE", "TYPING_START", "TYPING_STOP", "USER_ONLINE", "USER_OFFLINE", "MESSAGE_READ"})
    private String type;
    
    @NotNull(message = "Conversation ID is required")
    @Positive(message = "Conversation ID must be positive")
    @Schema(description = "ID of the conversation", example = "1")
    private Long conversationId;
    
    @NotNull(message = "Sender ID is required") 
    @Positive(message = "Sender ID must be positive")
    @Schema(description = "ID of the message sender", example = "1")
    private Long senderId;
    
    @NotBlank(message = "Sender username is required")
    @Size(min = 3, max = 50, message = "Sender username must be between 3 and 50 characters")
    @Schema(description = "Username of the sender", example = "john_doe")
    private String senderUsername;
    
    @NotNull(message = "Receiver ID is required")
    @Positive(message = "Receiver ID must be positive")
    @Schema(description = "ID of the message receiver", example = "2")
    private Long receiverId;
    
    @Size(max = 2000, message = "Content must not exceed 2000 characters")
    @Schema(description = "Message content", example = "Hello! How are you?", maxLength = 2000)
    private String content;
    
    @Pattern(regexp = "^(TEXT|IMAGE|AUDIO|VIDEO|SYSTEM|FILE)$", 
             message = "Message type must be TEXT, IMAGE, AUDIO, VIDEO, SYSTEM, or FILE")
    @Schema(description = "Type of message content", example = "TEXT", 
            allowableValues = {"TEXT", "IMAGE", "AUDIO", "VIDEO", "SYSTEM", "FILE"})
    private String messageType;
    
    @NotNull(message = "Timestamp is required")
    @Schema(description = "Message timestamp (Unix epoch)", example = "1640995200000")
    private Long timestamp;
    
    @Positive(message = "Message ID must be positive when provided")
    @Schema(description = "Message ID for read receipts", example = "1")
    private Long messageId; // For read receipts
}