package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AudioDTO {
    private Long id;
    private Long userProfileID;
    private String url;
    private String description;
    private String visibility;
    private String status;
    private Integer duration;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}