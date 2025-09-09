package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Long otpID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(nullable = false)
    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP code must be exactly 6 digits")
    private String code;

    @Column(nullable = false)
    @NotBlank(message = "OTP type is required")
    @Pattern(regexp = "^(LOGIN|SIGNUP|RESET|VERIFICATION)$", 
             message = "Type must be LOGIN, SIGNUP, RESET, or VERIFICATION")
    private String type; // Purpose (login, signup, reset)

    @Column(nullable = false)
    @NotNull(message = "Expiry timestamp is required")
    @Future(message = "Expiry time must be in the future")
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @NotNull(message = "Used status is required")
    @Builder.Default
    private Boolean isUsed = false;

    @Column(nullable = false)
    @NotNull(message = "Created timestamp is required")
    private LocalDateTime createdAt;
}