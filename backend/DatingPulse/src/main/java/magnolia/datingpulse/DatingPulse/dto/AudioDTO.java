package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AudioDTO {
    private Long id;
    
    @NotNull(message = "User profile ID is required")
    @Positive(message = "User profile ID must be positive")
    private Long userProfileID;
    
    @NotBlank(message = "Audio URL is required")
    @Pattern(regexp = "^(https?://).*\\.(mp3|wav|m4a|aac|ogg)$", 
             message = "URL must be a valid audio file URL (mp3, wav, m4a, aac, ogg)")
    private String url;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @NotBlank(message = "Visibility is required")
    @Pattern(regexp = "^(PUBLIC|PRIVATE|FRIENDS_ONLY)$", 
             message = "Visibility must be one of: PUBLIC, PRIVATE, FRIENDS_ONLY")
    private String visibility;
    
    @Pattern(regexp = "^(ACTIVE|FLAGGED|REMOVED|PENDING)$", 
             message = "Status must be one of: ACTIVE, FLAGGED, REMOVED, PENDING")
    private String status;
    
    @Min(value = 1, message = "Duration must be at least 1 second")
    @Max(value = 300, message = "Duration must not exceed 300 seconds (5 minutes)")
    private Integer duration;
    
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}