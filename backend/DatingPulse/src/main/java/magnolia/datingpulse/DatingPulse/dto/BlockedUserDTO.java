package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BlockedUserDTO {
    private Long blockID;
    private Long blockerID;
    private Long blockedID;
    private LocalDateTime blockedAt;
}