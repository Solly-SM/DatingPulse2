package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "photo_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "photo_id", nullable = false)
    @NotNull(message = "Photo is required")
    private Photo photo;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    @NotNull(message = "Reporter is required")
    private User reporter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Report type is required")
    private ReportType reportType;

    @Column(length = 1000)
    @Size(max = 1000, message = "Additional details must not exceed 1000 characters")
    private String additionalDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime reportedAt = LocalDateTime.now();

    @Column
    private LocalDateTime reviewedAt;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(length = 500)
    @Size(max = 500, message = "Resolution notes must not exceed 500 characters")
    private String resolutionNotes;
}