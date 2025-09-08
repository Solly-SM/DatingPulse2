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
    @Column(length = 64)
    @NotBlank(message = "Session ID is required")
    @Size(min = 32, max = 64, message = "Session ID must be between 32 and 64 characters")
    private String sessionID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(nullable = false, unique = true, length = 256)
    @NotBlank(message = "Token is required")
    @Size(min = 10, max = 256, message = "Token must be between 10 and 256 characters")
    private String token; // JWT or random string

    @Column
    @Size(max = 500, message = "Device info must not exceed 500 characters")
    private String deviceInfo; // Optional user agent/device details

    @Column(nullable = false)
    @NotNull(message = "Expiry timestamp is required")
    @Future(message = "Expiry time must be in the future")
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @NotNull(message = "Created timestamp is required")
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime revokedAt; // Optional
}