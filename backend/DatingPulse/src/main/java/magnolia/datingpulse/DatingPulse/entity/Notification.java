package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @Column(name = "notification_id")
    private Long notificationID;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user; // Who receives the notification

    @Column(nullable = false)
    @NotBlank(message = "Notification type is required")
    @Pattern(regexp = "^(LIKE|MATCH|MESSAGE|SYSTEM|VERIFICATION|REPORT|ADMIN)$", 
             message = "Type must be LIKE, MATCH, MESSAGE, SYSTEM, VERIFICATION, REPORT, or ADMIN")
    private String type; // Notification type (new like, match, message, system alert)

    @Column(name = "related_id")
    @Positive(message = "Related ID must be positive")
    private Long relatedID; // Linked entity (like, match, message, etc.)

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Content must not exceed 1000 characters")
    private String content; // Notification content/message
    
    @Column(columnDefinition = "TEXT")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String message; // Legacy message field for backwards compatibility
    
    @Column(columnDefinition = "JSONB")
    private String data; // Additional notification data as JSON

    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|CRITICAL)$", 
             message = "Priority must be LOW, MEDIUM, HIGH, or CRITICAL")
    private String priority;

    @Column(nullable = false)
    @NotNull(message = "Read status is required")
    @Builder.Default
    private Boolean isRead = false;

    @Column(nullable = false)
    @NotNull(message = "Created timestamp is required")
    private LocalDateTime createdAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt; // Added to match database schema
}