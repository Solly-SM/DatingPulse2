package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Column(nullable = false, length = 255)
    @NotBlank(message = "Password is required")
    @Size(min = 60, max = 255, message = "Password hash must be between 60 and 255 characters")
    private String password; // Store as BCrypt hash

    @Column(unique = true, length = 20)
    @Pattern(regexp = "^(0[1-9][0-9]{8}|\\+27[1-9][0-9]{8})$", message = "Phone number must be in South African format (e.g., 0821234567 or +27821234567)")
    private String phone;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ADMIN|USER)$", message = "Role must be either ADMIN or USER")
    private String role; // admin, user

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|SUSPENDED|BANNED)$", message = "Status must be ACTIVE, SUSPENDED, or BANNED")
    private String status; // active, suspended, banned

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastLogin;

    @Column(nullable = false)
    @NotNull(message = "Verification status is required")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(nullable = false)
    @NotNull(message = "Login attempt count is required")
    @Min(value = 0, message = "Login attempts cannot be negative")
    @Max(value = 10, message = "Maximum login attempts exceeded")
    @Builder.Default
    private Integer loginAttempt = 0;
}
