package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user; // The user who liked

    @ManyToOne
    @JoinColumn(name = "likedUserID", nullable = false)
    private User likedUser; // The user who was liked

    @Column(nullable = false)
    private LocalDateTime likedAt;
}