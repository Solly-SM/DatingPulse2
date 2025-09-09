package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_one_id", "user_two_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_one_id", nullable = false)
    @NotNull(message = "User one is required")
    private User userOne;

    @ManyToOne
    @JoinColumn(name = "user_two_id", nullable = false)
    @NotNull(message = "User two is required")
    private User userTwo;

    @Column(name="matched_at")
    @NotNull(message = "Match timestamp is required")
    private LocalDateTime matchedAt;

    @NotBlank(message = "Match source is required")
    @Size(max = 50, message = "Match source must not exceed 50 characters")
    @Pattern(regexp = "^(SWIPE|ALGORITHM|MANUAL|SUPER_LIKE|MUTUAL_LIKE)$", message = "Match source must be SWIPE, ALGORITHM, MANUAL, SUPER_LIKE, or MUTUAL_LIKE")
    @Column(name = "match_source")
    private String matchSource; // How the match occurred (e.g., swipe, algorithm, etc.)

    @NotNull(message = "Active status is required")
    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true; // For unmatched/blocking logic

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}