package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Typing indicator for real-time chat features")
public class TypingIndicatorDTO {
    
    @NotNull(message = "Conversation ID is required")
    @Positive(message = "Conversation ID must be positive")
    @Schema(description = "ID of the conversation", example = "1")
    private Long conversationId;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    @Schema(description = "ID of the user typing", example = "1")
    private Long userId;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Schema(description = "Username of the typing user", example = "john_doe")
    private String username;
    
    @NotNull(message = "Typing status is required")
    @Schema(description = "Whether the user is currently typing", example = "true")
    private boolean isTyping;
    
    @NotNull(message = "Timestamp is required")
    @Schema(description = "Timestamp of the typing event (Unix epoch)", example = "1640995200000")
    private Long timestamp;
}