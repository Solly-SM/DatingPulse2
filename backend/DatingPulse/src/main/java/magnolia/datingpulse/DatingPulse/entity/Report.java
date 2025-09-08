package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportID;

    @ManyToOne
    @JoinColumn(name = "reporterID", nullable = false)
    @NotNull(message = "Reporter is required")
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "reportedID", nullable = false)
    @NotNull(message = "Reported user is required")
    private User reported;

    @Column(nullable = false)
    @NotBlank(message = "Target type is required")
    @Pattern(regexp = "^(USER|PHOTO|AUDIO|MESSAGE|PROFILE)$", 
             message = "Target type must be USER, PHOTO, AUDIO, MESSAGE, or PROFILE")
    private String targetType; // user, photo, audio, message

    @Column(nullable = false)
    @NotNull(message = "Target ID is required")
    @Positive(message = "Target ID must be positive")
    private Long targetID; // ID of the reported entity

    @Column(nullable = false)
    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason; // Reason for report

    @Column(nullable = false)
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|UNDER_REVIEW|RESOLVED|DISMISSED)$", 
             message = "Status must be PENDING, UNDER_REVIEW, RESOLVED, or DISMISSED")
    @Builder.Default
    private String status = "PENDING"; // pending, under review, resolved, dismissed

    @Column(nullable = false)
    @NotNull(message = "Report timestamp is required")
    private LocalDateTime reportedAt;

    @ManyToOne
    @JoinColumn(name = "reviewedBy")
    private Admin reviewedBy; // Admin reviewing (nullable)

    private LocalDateTime resolvedAt;
}