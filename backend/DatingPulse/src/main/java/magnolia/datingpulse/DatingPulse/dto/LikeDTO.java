package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LikeDTO {
    private Long likeID;
    private Long userID;
    private Long likedUserID;
    private String type;
    private LocalDateTime likedAt;
}