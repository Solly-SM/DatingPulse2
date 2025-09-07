package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Set;

@Data
public class AdminDTO {
    private Long adminID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userID;
    
    @NotBlank(message = "Admin role is required")
    @Pattern(regexp = "^(ADMIN|SUPER_ADMIN)$", 
             message = "Role must be one of: ADMIN, SUPER_ADMIN")
    private String role;
    
    private Set<@Positive(message = "Permission ID must be positive") Long> permissionIDs;
}