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
    @Column(name = "like_id")
    private Long likeID;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @ManyToOne
    @JoinColumn(name = "liked_user_id", nullable = false)
    @NotNull(message = "Liked user is required")
    private User likedUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "like_type", nullable = false)
    @NotNull(message = "Like type is required")
    private LikeType type; // NEW FIELD

    @Column(name = "created_at", nullable = false)
    @NotNull(message = "Liked timestamp is required")
    private LocalDateTime likedAt;
}