package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @Column(name = "swipe_id")
    private Long swipeID;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @ManyToOne
    @JoinColumn(name = "target_user_id", nullable = false)
    @NotNull(message = "Target user is required")
    private User targetUser;

    @Column(nullable = false)
    @NotBlank(message = "Swipe type is required")
    @Pattern(regexp = "^(LIKE|DISLIKE|SUPER_LIKE|PASS)$", 
             message = "Swipe type must be LIKE, DISLIKE, SUPER_LIKE, or PASS")
    private String swipeType; // like, dislike, superlike, etc.

    @Column(nullable = false)
    @NotNull(message = "Rewind status is required")
    @Builder.Default
    private Boolean isRewind = false;

    @Column(nullable = false)
    @NotNull(message = "Created timestamp is required")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "deviceID", nullable = false)
    @NotNull(message = "Device is required")
    private Device device;

    @Column(nullable = false)
    @NotBlank(message = "App version is required")
    @Size(max = 20, message = "App version must not exceed 20 characters")
    private String appVersion;

    @ManyToOne
    @JoinColumn(name = "sessionID")
    private Session session;
}