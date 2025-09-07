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
    private String url;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AudioVisibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AudioStatus status; // Moderation status

    @Column
    private Integer duration;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column
    private LocalDateTime updatedAt; // Audit timestamp
}