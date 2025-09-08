package magnolia.datingpulse.DatingPulse.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Registration request for creating a new user account")
public class RegisterRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    @Schema(description = "Desired username", example = "john_doe", minLength = 3, maxLength = 50)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Schema(description = "Email address", example = "john.doe@example.com", format = "email")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$", 
             message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
    @Schema(description = "Account password (minimum 8 characters with complexity requirements)", example = "MyPassword123!")
    private String password;
    
    @Pattern(regexp = "^$|^(0[1-9][0-9]{8}|\\+27[1-9][0-9]{8})$", 
             message = "Phone number must be in South African format (e.g., 0821234567 or +27821234567)")
    @Schema(description = "Phone number in South African format (optional)", example = "0821234567")
    private String phone;
}