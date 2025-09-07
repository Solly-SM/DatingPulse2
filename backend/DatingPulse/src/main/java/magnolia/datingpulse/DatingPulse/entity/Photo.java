package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long photoID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @Column(nullable = false)
    private String url;

    @Column
    private String description;

    @Column(nullable = false)
    private Boolean isProfilePhoto;

    @Column(nullable = false)
    private Boolean isPrivate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PhotoVisibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PhotoStatus status; // Moderation status

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column
    private LocalDateTime updatedAt; // Audit timestamp

    @Column
    private Integer orderIndex; // For manual gallery ordering
}