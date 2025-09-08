package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "Swipe history data transfer object")
public class SwipeHistoryDTO {
    @Schema(description = "Unique identifier for the swipe", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long swipeID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    @Schema(description = "ID of the user who swiped", example = "1")
    private Long userID;
    
    @NotNull(message = "Target user ID is required")
    @Positive(message = "Target user ID must be positive")
    @Schema(description = "ID of the user who was swiped on", example = "2")
    private Long targetUserID;
    
    @NotBlank(message = "Swipe type is required")
    @Pattern(regexp = "^(LIKE|DISLIKE|SUPER_LIKE|PASS)$", 
             message = "Swipe type must be LIKE, DISLIKE, SUPER_LIKE, or PASS")
    @Schema(description = "Type of swipe action", example = "LIKE", 
            allowableValues = {"LIKE", "DISLIKE", "SUPER_LIKE", "PASS"})
    private String swipeType;
    
    @NotNull(message = "Rewind status is required")
    @Schema(description = "Whether this swipe was a rewind action", example = "false")
    private Boolean isRewind;
    
    @Schema(description = "When the swipe was performed", example = "2024-01-15T10:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    
    @NotNull(message = "Device ID is required")
    @Positive(message = "Device ID must be positive")
    @Schema(description = "ID of the device used for swiping", example = "1")
    private Long deviceID;
    
    @Size(max = 20, message = "App version must not exceed 20 characters")
    @Schema(description = "Version of the app when swipe was performed", example = "1.0.5", maxLength = 20)
    private String appVersion;
    
    @Size(min = 10, max = 255, message = "Session ID must be between 10 and 255 characters")
    @Schema(description = "Session ID when swipe was performed", example = "sess_abc123def456")
    private String sessionID;
}