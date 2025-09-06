package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
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
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "reportedID", nullable = false)
    private User reported;

    @Column(nullable = false)
    private String targetType; // user, photo, audio, message

    @Column(nullable = false)
    private Long targetID; // ID of the reported entity

    @Column(nullable = false)
    private String reason; // Reason for report

    @Column(nullable = false)
    private String status; // pending, under review, resolved, dismissed

    @Column(nullable = false)
    private LocalDateTime reportedAt;

    @ManyToOne
    @JoinColumn(name = "reviewedBy")
    private Admin reviewedBy; // Admin reviewing (nullable)

    private LocalDateTime resolvedAt;
}