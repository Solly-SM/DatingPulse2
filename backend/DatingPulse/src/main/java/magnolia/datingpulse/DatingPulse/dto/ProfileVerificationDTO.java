package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProfileVerificationDTO {
    private Long verificationID;
    private Long userID;
    private String type;
    private String status;
    private LocalDateTime requestedAt;
    private LocalDateTime verifiedAt;
    private LocalDateTime rejectedAt;
    private String documentURL;
    private Long reviewerID;
    private String notes;
}