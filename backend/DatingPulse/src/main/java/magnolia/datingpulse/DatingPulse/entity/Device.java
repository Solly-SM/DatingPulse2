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
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(name = "device_type", nullable = false)
    @NotBlank(message = "Device type is required")
    @Pattern(regexp = "^(ANDROID|IOS|WEB|DESKTOP)$", 
             message = "Type must be one of: ANDROID, IOS, WEB, DESKTOP")
    private String type; // web, android, ios, desktop

    @Column(name = "device_token", nullable = false)
    @NotBlank(message = "Push token is required")
    @Size(max = 500, message = "Push token must not exceed 500 characters")
    private String pushToken; // For push notifications - maps to device_token column
    
    @Column(name = "device_name")
    @Size(max = 100, message = "Device name must not exceed 100 characters")
    private String deviceName; // Human readable device name

    @Column(name = "device_info")
    @Size(max = 500, message = "Device info must not exceed 500 characters")
    private String deviceInfo; // User agent, browser version, etc.

    @Column(name = "last_used_at")
    private LocalDateTime lastSeen;

    @Column(name = "created_at", nullable = false)
    @NotNull(message = "Created date is required")
    private LocalDateTime createdAt;
}