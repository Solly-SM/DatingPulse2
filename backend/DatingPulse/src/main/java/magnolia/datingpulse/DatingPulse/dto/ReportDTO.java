package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReportDTO {
    private Long reportID;
    private Long reporterID;
    private Long reportedID;
    private String targetType;
    private Long targetID;
    private String reason;
    private String status;
    private LocalDateTime reportedAt;
    private Long reviewedByID;
    private LocalDateTime resolvedAt;
}