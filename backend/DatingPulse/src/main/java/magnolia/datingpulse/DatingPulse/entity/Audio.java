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
    private Long audioID; // Changed to match schema naming

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "UserProfile is required")
    private UserProfile userProfile;

    @Column(nullable = false)
    @NotBlank(message = "Audio URL is required")
    @Pattern(regexp = "^(https?://).*\\.(mp3|wav|m4a|aac|ogg)$", 
             message = "URL must be a valid audio file URL (mp3, wav, m4a, aac, ogg)")
    private String url;

    @Column(name = "title")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Visibility is required")
    private AudioVisibility visibility = AudioVisibility.PUBLIC; // Changed to enum

    @Column(name = "duration")
    @Min(value = 1, message = "Duration must be at least 1 second")
    @Max(value = 300, message = "Duration must not exceed 300 seconds (5 minutes)")
    private Integer duration; // Changed name to match schema

    @Column(name = "uploaded_at", nullable = false)
    @NotNull(message = "Upload date is required")
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Status is required")
    private AudioStatus status = AudioStatus.PENDING; // Changed to enum as per schema
}