package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @NotNull(message = "User is required")
    private User user;

    @ManyToOne
    @JoinColumn(name = "likedUserID", nullable = false)
    @NotNull(message = "Liked user is required")
    private User likedUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Like type is required")
    private LikeType type; // NEW FIELD

    @Column(nullable = false)
    @NotNull(message = "Liked timestamp is required")
    private LocalDateTime likedAt;
}