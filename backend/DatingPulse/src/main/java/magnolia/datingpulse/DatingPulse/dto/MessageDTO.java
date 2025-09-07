package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long messageID;
    private Long conversationID;
    private Long senderID;
    private Long receiverID;
    private String content;
    private String type;
    private LocalDateTime sentAt;
    private String status;
    private Boolean isEdited;
    private Boolean isRead;
    private Boolean deletedForSender;
    private Boolean deletedForReceiver;
}