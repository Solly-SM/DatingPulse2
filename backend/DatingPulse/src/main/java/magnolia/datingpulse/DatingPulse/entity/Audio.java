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

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Visibility is required")
    private AudioVisibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Status is required")
    private AudioStatus status; // Moderation status

    @Column
    @Min(value = 1, message = "Duration must be at least 1 second")
    @Max(value = 300, message = "Duration must not exceed 300 seconds (5 minutes)")
    private Integer duration;

    @Column(nullable = false)
    @NotNull(message = "Upload date is required")
    private LocalDateTime uploadedAt;

    @Column
    private LocalDateTime updatedAt; // Audit timestamp
}