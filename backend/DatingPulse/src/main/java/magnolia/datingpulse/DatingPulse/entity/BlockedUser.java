package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockedUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blockID;

    @ManyToOne
    @JoinColumn(name = "blockerID", nullable = false)
    private User blocker;

    @ManyToOne
    @JoinColumn(name = "blockedID", nullable = false)
    private User blocked;


    @Column(nullable = false)
    private LocalDateTime blockedAt;
}