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
@Schema(description = "Login request containing user credentials")
public class LoginRequest {
    
    @NotBlank(message = "Username or email is required")
    @Size(min = 3, max = 255, message = "Username or email must be between 3 and 255 characters")
    @Schema(description = "Username or email address", example = "john_doe")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 1, max = 128, message = "Password must not exceed 128 characters")
    @Schema(description = "User password", example = "MyPassword123!")
    private String password;
}