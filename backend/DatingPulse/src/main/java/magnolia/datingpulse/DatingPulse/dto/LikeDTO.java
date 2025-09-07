package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LikeDTO {
    private Long likeID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userID;
    
    @NotNull(message = "Liked user ID is required")
    @Positive(message = "Liked user ID must be positive")
    private Long likedUserID;
    
    @NotBlank(message = "Like type is required")
    @Pattern(regexp = "^(LIKE|SUPER_LIKE|PASS)$", 
             message = "Type must be one of: LIKE, SUPER_LIKE, PASS")
    private String type;
    
    private LocalDateTime likedAt;
}