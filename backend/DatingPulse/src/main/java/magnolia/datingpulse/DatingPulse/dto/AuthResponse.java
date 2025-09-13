package magnolia.datingpulse.DatingPulse.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response containing JWT token and user information")
public class AuthResponse {
    
    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;
    
    @Schema(description = "Token type", example = "Bearer")
    @Builder.Default
    private String type = "Bearer";
    
    @Schema(description = "User information")
    private UserDTO user;
    
    @Schema(description = "Token expiration time", example = "2024-01-01T23:59:59Z")
    private String expiresAt;
    
    @Schema(description = "Authentication success message", example = "Login successful")
    private String message;
}