package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReportDTO {
    private Long reportID;
    
    @NotNull(message = "Reporter ID is required")
    @Positive(message = "Reporter ID must be positive")
    private Long reporterID;
    
    @NotNull(message = "Reported user ID is required")
    @Positive(message = "Reported user ID must be positive")
    private Long reportedID;
    
    @NotBlank(message = "Target type is required")
    @Pattern(regexp = "^(USER|PHOTO|MESSAGE|AUDIO|PROFILE)$", 
             message = "Target type must be one of: USER, PHOTO, MESSAGE, AUDIO, PROFILE")
    private String targetType;
    
    @Positive(message = "Target ID must be positive")
    private Long targetID;
    
    @NotBlank(message = "Reason is required")
    @Size(min = 10, max = 1000, message = "Reason must be between 10 and 1000 characters")
    private String reason;
    
    @Pattern(regexp = "^(PENDING|UNDER_REVIEW|RESOLVED|DISMISSED)$", 
             message = "Status must be one of: PENDING, UNDER_REVIEW, RESOLVED, DISMISSED")
    private String status;
    
    private LocalDateTime reportedAt;
    
    @Positive(message = "Reviewer ID must be positive")
    private Long reviewedByID;
    
    private LocalDateTime resolvedAt;
}