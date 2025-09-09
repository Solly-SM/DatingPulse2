package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {
    @Id
    @Column(name = "session_id")
    private String sessionID; // Changed to String to match schema and tests

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(name = "session_token", nullable = false, unique = true, length = 500)
    @NotBlank(message = "Token is required")
    @Size(min = 10, max = 500, message = "Token must be between 10 and 500 characters")
    private String token; // JWT or random string

    @Column(name = "ip_address")
    @Size(max = 45, message = "IP address must not exceed 45 characters")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "created_at", nullable = false)
    @NotNull(message = "Created timestamp is required")
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    @NotNull(message = "Expiry timestamp is required")
    private LocalDateTime expiresAt;

    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "device_info", length = 500)
    @Size(max = 500, message = "Device info must not exceed 500 characters")
    private String deviceInfo; // Device information for session
    
    @Column(name = "revoked_at")
    private LocalDateTime revokedAt; // When session was revoked
}