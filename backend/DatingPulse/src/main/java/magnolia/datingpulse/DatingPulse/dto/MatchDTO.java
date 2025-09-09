package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MatchDTO {
    private Long id;
    
    @NotNull(message = "User one ID is required")
    @Positive(message = "User one ID must be positive")
    private Long userOneID;
    
    @NotNull(message = "User two ID is required")
    @Positive(message = "User two ID must be positive")
    private Long userTwoID;
    
    private LocalDateTime matchedAt;
    
    @Pattern(regexp = "^(SWIPE|ALGORITHM|MANUAL|SUPER_LIKE|MUTUAL_LIKE)$", 
             message = "Match source must be one of: SWIPE, ALGORITHM, MANUAL, SUPER_LIKE, MUTUAL_LIKE")
    private String matchSource;
    
    private Boolean isActive;
    private LocalDateTime expiresAt;
}