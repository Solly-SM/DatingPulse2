package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profile_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "verification_id")
    private Long verificationID;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(name = "verification_type", nullable = false)
    @NotBlank(message = "Verification type is required")
    @Pattern(regexp = "^(PHOTO|ID|SOCIAL|PHONE|EMAIL|MANUAL)$", 
             message = "Type must be PHOTO, ID, SOCIAL, PHONE, EMAIL, or MANUAL")
    private String type; // photo, ID, social, etc.

    @Column(nullable = false)
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|VERIFIED|REJECTED)$", 
             message = "Status must be PENDING, VERIFIED, or REJECTED")
    @Builder.Default
    private String status = "PENDING"; // pending, verified, rejected

    @Column(name = "submitted_at", nullable = false)
    @NotNull(message = "Request timestamp is required")
    private LocalDateTime requestedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime verifiedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer; // Optional: Admin/staff

    @Column(length = 1000)
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes; // Reviewer notes (optional)
}
