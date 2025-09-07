package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PermissionDTO {
    private Long id;
    
    @NotBlank(message = "Permission name is required")
    @Size(min = 3, max = 50, message = "Permission name must be between 3 and 50 characters")
    @Pattern(regexp = "^[A-Z_]+$", 
             message = "Permission name must contain only uppercase letters and underscores")
    private String name;
}