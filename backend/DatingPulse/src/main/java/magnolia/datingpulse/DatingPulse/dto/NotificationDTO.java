package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "Notification data transfer object")
public class NotificationDTO {
    @Schema(description = "Unique identifier for the notification", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long notificationID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    @Schema(description = "ID of the user receiving the notification", example = "1")
    private Long userID;
    
    @NotBlank(message = "Notification type is required")
    @Pattern(regexp = "^(MATCH|MESSAGE|LIKE|SUPER_LIKE|PROFILE_VIEW|VERIFICATION|SYSTEM|PROMOTION)$", 
             message = "Type must be MATCH, MESSAGE, LIKE, SUPER_LIKE, PROFILE_VIEW, VERIFICATION, SYSTEM, or PROMOTION")
    @Schema(description = "Type of notification", example = "MATCH", 
            allowableValues = {"MATCH", "MESSAGE", "LIKE", "SUPER_LIKE", "PROFILE_VIEW", "VERIFICATION", "SYSTEM", "PROMOTION"})
    private String type;
    
    @Positive(message = "Related ID must be positive when provided")
    @Schema(description = "ID of related entity (match, message, etc.)", example = "1")
    private Long relatedID;
    
    @NotBlank(message = "Notification title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    @Schema(description = "Notification title", example = "New Match!", maxLength = 100)
    private String title;
    
    @NotBlank(message = "Notification content is required")
    @Size(max = 1000, message = "Content must not exceed 1000 characters")
    @Schema(description = "Notification content", example = "You have a new match with John!", maxLength = 1000)
    private String content;
    
    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|URGENT)$", 
             message = "Priority must be LOW, MEDIUM, HIGH, or URGENT")
    @Schema(description = "Notification priority", example = "HIGH", 
            allowableValues = {"LOW", "MEDIUM", "HIGH", "URGENT"})
    private String priority;
    
    @NotNull(message = "Read status is required")
    @Schema(description = "Whether the notification has been read", example = "false")
    private Boolean isRead;
    
    @Schema(description = "When the notification was created", example = "2024-01-15T10:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
}