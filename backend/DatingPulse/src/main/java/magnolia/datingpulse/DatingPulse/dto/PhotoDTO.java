package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PhotoDTO {
    private Long photoID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userID;
    
    @NotBlank(message = "Photo URL is required")
    @Pattern(regexp = "^(https?://.*|/uploads/.*)\\.(jpg|jpeg|png|gif|webp)$", 
             message = "URL must be a valid image file URL (jpg, jpeg, png, gif, webp)")
    private String url;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    private Boolean isProfilePhoto;
    private Boolean isPrivate;
    
    @Pattern(regexp = "^(PUBLIC|PRIVATE|FRIENDS_ONLY)$", 
             message = "Visibility must be one of: PUBLIC, PRIVATE, FRIENDS_ONLY")
    private String visibility;
    
    @Pattern(regexp = "^(ACTIVE|PENDING|FLAGGED|REJECTED|REMOVED)$", 
             message = "Status must be one of: ACTIVE, PENDING, FLAGGED, REJECTED, REMOVED")
    private String status;
    
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
    
    @Min(value = 0, message = "Order index cannot be negative")
    private Integer orderIndex;
}