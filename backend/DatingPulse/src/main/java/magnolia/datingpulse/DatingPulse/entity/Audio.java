package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
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
    private UserProfile userProfile;

    @Column(nullable = false)
    private String url; // Link to audio file

    private String description; // Optional caption or context for the audio

    @Column(nullable = false)
    private Boolean isPublic; // Whether audio is public or private

    @Column(nullable = false)
    private LocalDateTime uploadedAt;
}