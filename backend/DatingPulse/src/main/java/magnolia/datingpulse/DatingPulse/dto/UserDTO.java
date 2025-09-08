package magnolia.datingpulse.DatingPulse.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "User data transfer object containing user information")
public class UserDTO {
    @Schema(description = "Unique identifier for the user", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long userID;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    @Schema(description = "Unique username for the user", example = "john_doe", minLength = 3, maxLength = 50)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Schema(description = "User's email address", example = "john.doe@example.com", format = "email")
    private String email;

    @Pattern(regexp = "^$|^(0[1-9][0-9]{8}|\\+27[1-9][0-9]{8})$", message = "Phone number must be in South African format (e.g., 0821234567 or +27821234567)")
    @Schema(description = "User's phone number in South African format", example = "0821234567")
    private String phone;
    
    @Schema(description = "User's role in the system", example = "USER", allowableValues = {"USER", "ADMIN", "MODERATOR"})
    private String role;
    
    @Schema(description = "Current status of the user account", example = "ACTIVE", allowableValues = {"ACTIVE", "SUSPENDED", "BANNED", "PENDING"})
    private String status;
    
    @Schema(description = "Timestamp when the user account was created", example = "2024-01-15T10:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    
    @Schema(description = "Timestamp when the user account was last updated", example = "2024-01-20T14:45:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;
    
    @Schema(description = "Timestamp of the user's last login", example = "2024-01-25T09:15:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime lastLogin;
    
    @Schema(description = "Whether the user's email has been verified", example = "true", accessMode = Schema.AccessMode.READ_ONLY)
    private Boolean isVerified;
    
    // Note: Removed loginAttempt for security - this should not be exposed to clients
    // Note: Password is never included in DTOs for security
}