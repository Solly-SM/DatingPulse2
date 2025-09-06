package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user; // Who receives the notification

    @Column(nullable = false)
    private String type; // Notification type (new like, match, message, system alert)

    private Long relatedID; // Linked entity (like, match, message, etc.)

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // Notification content/message

    private String priority;

    @Column(nullable = false)
    private Boolean isRead;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}