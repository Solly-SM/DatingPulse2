package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    private UserProfileDTO profile;
    private Boolean isVerified;
    private Double completionPercentage;
    private List<String> verifiedTypes; // List of verified types (PHOTO, ID, etc.)
    private List<String> missingFields; // Fields needed for completion
}