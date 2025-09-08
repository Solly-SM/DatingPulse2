package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "One-time password (OTP) data transfer object")
public class OtpDTO {
    @Schema(description = "Unique identifier for the OTP", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long otpID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    @Schema(description = "ID of the user this OTP belongs to", example = "1")
    private Long userID;
    
    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^\\d{6}$", message = "OTP code must be exactly 6 digits")
    @Schema(description = "6-digit OTP code", example = "123456", minLength = 6, maxLength = 6)
    private String code;
    
    @NotBlank(message = "OTP type is required")
    @Pattern(regexp = "^(LOGIN|SIGNUP|RESET|VERIFICATION)$", 
             message = "OTP type must be LOGIN, SIGNUP, RESET, or VERIFICATION")
    @Schema(description = "Purpose of the OTP", example = "VERIFICATION", 
            allowableValues = {"LOGIN", "SIGNUP", "RESET", "VERIFICATION"})
    private String type;
    
    @NotNull(message = "Expiry date is required")
    @Future(message = "OTP expiry must be in the future")
    @Schema(description = "When the OTP expires", example = "2024-01-15T10:30:00")
    private LocalDateTime expiresAt;
    
    @NotNull(message = "Usage status is required")
    @Schema(description = "Whether the OTP has been used", example = "false")
    private Boolean isUsed;
    
    @Schema(description = "When the OTP was created", example = "2024-01-15T10:00:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
}