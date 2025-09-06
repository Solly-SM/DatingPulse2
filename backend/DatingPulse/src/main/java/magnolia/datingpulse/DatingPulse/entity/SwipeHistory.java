package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "swipe_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwipeHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long swipeID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "targetUserID", nullable = false)
    private User targetUser;

    @Column(nullable = false)
    private String swipeType; // like, dislike, superlike, etc.

    @Column(nullable = false)
    private Boolean isRewind;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "deviceID", nullable = false)
    private Device device;

    @Column(nullable = false)
    private String appVersion;

    @ManyToOne
    @JoinColumn(name = "sessionID")
    private Session session;
}