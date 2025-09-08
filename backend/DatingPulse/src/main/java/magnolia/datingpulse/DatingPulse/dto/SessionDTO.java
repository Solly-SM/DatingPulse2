package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "User session data transfer object")
public class SessionDTO {
    @NotBlank(message = "Session ID is required")
    @Size(min = 10, max = 255, message = "Session ID must be between 10 and 255 characters")
    @Schema(description = "Unique session identifier", example = "sess_abc123def456", minLength = 10, maxLength = 255)
    private String sessionID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    @Schema(description = "ID of the authenticated user", example = "1")
    private Long userID;
    
    @NotBlank(message = "Token is required")
    @Size(min = 50, message = "Token must be at least 50 characters")
    @Schema(description = "JWT or session token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", minLength = 50)
    private String token;
    
    @Size(max = 500, message = "Device info must not exceed 500 characters")
    @Schema(description = "Information about the user's device", example = "iPhone 12 Pro, iOS 15.1", maxLength = 500)
    private String deviceInfo;
    
    @NotNull(message = "Expiry date is required")
    @Future(message = "Session expiry must be in the future")
    @Schema(description = "When the session expires", example = "2024-01-15T22:30:00")
    private LocalDateTime expiresAt;
    
    @Schema(description = "When the session was created", example = "2024-01-15T10:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    
    @Schema(description = "When the session was revoked", example = "2024-01-15T18:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime revokedAt;
}