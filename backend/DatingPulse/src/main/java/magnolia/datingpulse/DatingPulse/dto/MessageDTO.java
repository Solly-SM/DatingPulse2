package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long messageID;
    
    @NotNull(message = "Conversation ID is required")
    @Positive(message = "Conversation ID must be positive")
    private Long conversationID;
    
    @NotNull(message = "Sender ID is required")
    @Positive(message = "Sender ID must be positive")
    private Long senderID;
    
    @NotNull(message = "Receiver ID is required")
    @Positive(message = "Receiver ID must be positive")
    private Long receiverID;
    
    @NotBlank(message = "Message content is required")
    @Size(max = 2000, message = "Message content must not exceed 2000 characters")
    private String content;
    
    @NotBlank(message = "Message type is required")
    @Pattern(regexp = "^(TEXT|IMAGE|AUDIO|VIDEO|FILE)$", 
             message = "Type must be one of: TEXT, IMAGE, AUDIO, VIDEO, FILE")
    private String type;
    
    private LocalDateTime sentAt;
    
    @Pattern(regexp = "^(SENT|DELIVERED|READ|FAILED)$", 
             message = "Status must be one of: SENT, DELIVERED, READ, FAILED")
    private String status;
    
    private Boolean isEdited;
    private Boolean isRead;
    private Boolean deletedForSender;
    private Boolean deletedForReceiver;
}