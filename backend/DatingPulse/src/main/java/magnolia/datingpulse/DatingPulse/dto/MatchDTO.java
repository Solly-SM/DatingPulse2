package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MatchDTO {
    private Long id;
    private Long userOneID;
    private Long userTwoID;
    private LocalDateTime matchedAt;
    private String matchSource;
    private Boolean isActive;
    private LocalDateTime expiresAt;
}