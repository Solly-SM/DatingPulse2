package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeviceDTO {
    private Long deviceID;
    private Long userID;
    private String type;
    private String pushToken;
    private String deviceInfo;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
}