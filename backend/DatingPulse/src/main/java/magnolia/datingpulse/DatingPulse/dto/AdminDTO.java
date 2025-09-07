package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.util.Set;

@Data
public class AdminDTO {
    private Long adminID;
    private Long userID;
    private String role;
    private Set<Long> permissionIDs;
}