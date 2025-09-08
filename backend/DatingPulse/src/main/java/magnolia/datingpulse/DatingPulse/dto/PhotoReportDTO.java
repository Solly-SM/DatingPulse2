package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PhotoReportDTO {
    private Long reportId;
    
    @NotNull(message = "Photo ID is required")
    @Positive(message = "Photo ID must be positive")
    private Long photoId;
    
    @NotNull(message = "Reporter ID is required")
    @Positive(message = "Reporter ID must be positive")
    private Long reporterId;
    
    @Pattern(regexp = "^(INAPPROPRIATE_CONTENT|NUDITY|SPAM|FAKE_PROFILE|HARASSMENT|COPYRIGHT_VIOLATION|OTHER)$",
             message = "Report type must be one of: INAPPROPRIATE_CONTENT, NUDITY, SPAM, FAKE_PROFILE, HARASSMENT, COPYRIGHT_VIOLATION, OTHER")
    private String reportType;
    
    @Size(max = 1000, message = "Additional details must not exceed 1000 characters")
    private String additionalDetails;
    
    @Pattern(regexp = "^(PENDING|REVIEWING|RESOLVED|DISMISSED)$",
             message = "Status must be one of: PENDING, REVIEWING, RESOLVED, DISMISSED")
    private String status;
    
    private LocalDateTime reportedAt;
    private LocalDateTime reviewedAt;
    private Long reviewedBy;
    
    @Size(max = 500, message = "Resolution notes must not exceed 500 characters")
    private String resolutionNotes;
}