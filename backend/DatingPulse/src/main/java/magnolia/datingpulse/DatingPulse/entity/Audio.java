package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Audio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_profile_id", nullable = false)
    @NotNull(message = "User profile is required")
    private UserProfile userProfile;

    @Column(nullable = false)
    @NotBlank(message = "Audio URL is required")
    @Pattern(regexp = "^(https?://).*\\.(mp3|wav|m4a|aac|ogg)$", 
             message = "URL must be a valid audio file URL (mp3, wav, m4a, aac, ogg)")
    private String url;

    @Column(name = "title")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Column(nullable = false)
    @NotBlank(message = "Visibility is required")
    @Pattern(regexp = "^(PUBLIC|PRIVATE|MATCHES_ONLY)$", 
             message = "Visibility must be PUBLIC, PRIVATE, or MATCHES_ONLY")
    @Builder.Default
    private String visibility = "PUBLIC";

    @Column(nullable = false)
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|APPROVED|REJECTED)$", 
             message = "Status must be PENDING, APPROVED, or REJECTED")
    @Builder.Default
    private String status = "PENDING"; // Moderation status

    @Column(name = "duration_seconds")
    @Min(value = 1, message = "Duration must be at least 1 second")
    @Max(value = 300, message = "Duration must not exceed 300 seconds (5 minutes)")
    private Integer duration;

    @Column(name = "uploaded_at", nullable = false)
    @NotNull(message = "Upload date is required")
    private LocalDateTime uploadedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt; // Audit timestamp
}