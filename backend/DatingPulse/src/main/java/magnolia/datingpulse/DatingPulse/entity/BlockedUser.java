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
    @Column(name = "id")
    private Long blockID;

    @ManyToOne
    @JoinColumn(name = "blocker_id", nullable = false)
    @NotNull(message = "Blocker is required")
    private User blocker;

    @ManyToOne
    @JoinColumn(name = "blocked_id", nullable = false)
    @NotNull(message = "Blocked user is required")
    private User blocked;

    @Column(name = "reason")
    @Size(max = 200, message = "Reason must not exceed 200 characters")
    private String reason;

    @Column(name = "blocked_at", nullable = false)
    @NotNull(message = "Block timestamp is required")
    private LocalDateTime blockedAt;
}