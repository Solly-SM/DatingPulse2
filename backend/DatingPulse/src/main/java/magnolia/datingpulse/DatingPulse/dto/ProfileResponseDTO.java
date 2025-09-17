package magnolia.datingpulse.DatingPulse.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Enhanced profile response with verification status and completion tracking")
public class ProfileResponseDTO {
    
    @Schema(description = "User profile data")
    private UserProfileDTO profile;
    
    @Schema(description = "Whether the user is verified", example = "true")
    private Boolean isVerified;
    
    @Schema(description = "Profile completion percentage", example = "85.0", minimum = "0", maximum = "100")
    private Double completionPercentage;
    
    @Schema(description = "List of verified types", example = "[\"PHOTO\", \"ID\"]")
    private List<String> verifiedTypes;
    
    @Schema(description = "List of missing required fields", example = "[\"bio\", \"education\"]")
    private List<String> missingFields;
}