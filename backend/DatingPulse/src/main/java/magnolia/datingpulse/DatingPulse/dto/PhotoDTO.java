package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PhotoDTO {
    private Long photoID;
    private Long userID;
    private String url;
    private String description;
    private Boolean isProfilePhoto;
    private Boolean isPrivate;
    private String visibility;
    private String status;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
    private Integer orderIndex;
}