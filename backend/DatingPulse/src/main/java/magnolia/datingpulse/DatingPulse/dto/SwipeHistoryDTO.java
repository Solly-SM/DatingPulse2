package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SwipeHistoryDTO {
    private Long swipeID;
    private Long userID;
    private Long targetUserID;
    private String swipeType;
    private Boolean isRewind;
    private LocalDateTime createdAt;
    private Long deviceID;
    private String appVersion;
    private String sessionID;
}