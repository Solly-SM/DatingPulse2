package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long notificationID;
    private Long userID;
    private String type;
    private Long relatedID;
    private String title;
    private String content;
    private String priority;
    private Boolean isRead;
    private LocalDateTime createdAt;
}