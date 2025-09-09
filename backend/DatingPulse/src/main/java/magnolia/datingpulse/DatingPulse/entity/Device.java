package magnolia.datingpulse.DatingPulse.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @Column(name = "device_id")
    private Long deviceID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(nullable = false)
    @NotBlank(message = "Device type is required")
    @Pattern(regexp = "^(ANDROID|IOS|WEB|DESKTOP)$", 
             message = "Type must be one of: ANDROID, IOS, WEB, DESKTOP")
    private String type; // web, android, ios, desktop

    @Column
    @Size(max = 255, message = "Push token must not exceed 255 characters")
    private String pushToken; // For push notifications

    @Column
    @Size(max = 500, message = "Device info must not exceed 500 characters")
    private String deviceInfo; // User agent, browser version, etc.

    @Column
    private LocalDateTime lastSeen;

    @Column(nullable = false)
    @NotNull(message = "Created date is required")
    private LocalDateTime createdAt;
}