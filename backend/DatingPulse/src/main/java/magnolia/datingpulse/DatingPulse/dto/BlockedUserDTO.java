package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "Blocked user relationship data transfer object")
public class BlockedUserDTO {
    @Schema(description = "Unique identifier for the block record", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long blockID;
    
    @NotNull(message = "Blocker ID is required")
    @Positive(message = "Blocker ID must be positive")
    @Schema(description = "ID of the user who initiated the block", example = "1")
    private Long blockerID;
    
    @NotNull(message = "Blocked user ID is required")
    @Positive(message = "Blocked user ID must be positive")
    @Schema(description = "ID of the user who was blocked", example = "2")
    private Long blockedID;
    
    @Schema(description = "When the block was created", example = "2024-01-15T10:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime blockedAt;
}