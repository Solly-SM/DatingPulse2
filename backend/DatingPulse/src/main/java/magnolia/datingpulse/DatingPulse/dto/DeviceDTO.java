package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeviceDTO {
    private Long deviceID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userID;
    
    @NotBlank(message = "Device type is required")
    @Pattern(regexp = "^(ANDROID|IOS|WEB|DESKTOP)$", 
             message = "Type must be one of: ANDROID, IOS, WEB, DESKTOP")
    private String type;
    
    @Size(max = 255, message = "Push token must not exceed 255 characters")
    private String pushToken;
    
    @Size(max = 500, message = "Device info must not exceed 500 characters")
    private String deviceInfo;
    
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
}