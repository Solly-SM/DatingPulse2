package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @NotNull(message = "Blocker is required")
    private User blocker;

    @ManyToOne
    @JoinColumn(name = "blockedID", nullable = false)
    @NotNull(message = "Blocked user is required")
    private User blocked;

    @Column(nullable = false)
    @NotNull(message = "Block timestamp is required")
    private LocalDateTime blockedAt;
}