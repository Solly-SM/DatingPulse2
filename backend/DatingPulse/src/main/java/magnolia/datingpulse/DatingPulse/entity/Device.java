package magnolia.datingpulse.DatingPulse.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deviceID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // web, android, ios, desktop

    @Column
    private String pushToken; // For push notifications

    @Column
    private String deviceInfo; // User agent, browser version, etc.

    @Column
    private LocalDateTime lastSeen;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}