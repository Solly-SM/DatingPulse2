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
    @JoinColumn(name = "userID", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(nullable = false)
    @NotBlank(message = "Verification type is required")
    @Pattern(regexp = "^(PHOTO|ID|SOCIAL|PHONE|EMAIL|MANUAL)$", 
             message = "Type must be PHOTO, ID, SOCIAL, PHONE, EMAIL, or MANUAL")
    private String type; // photo, ID, social, etc.

    @Column(nullable = false)
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|APPROVED|REJECTED|EXPIRED)$", 
             message = "Status must be PENDING, APPROVED, REJECTED, or EXPIRED")
    @Builder.Default
    private String status = "PENDING"; // pending, approved, rejected, expired

    @Column(nullable = false)
    @NotNull(message = "Request timestamp is required")
    private LocalDateTime requestedAt;

    @Column
    private LocalDateTime verifiedAt;

    @Column
    private LocalDateTime rejectedAt;

    @Column
    @Size(max = 500, message = "Document URL must not exceed 500 characters")
    @Pattern(regexp = "^https?://.*\\.(jpg|jpeg|png|pdf)$", 
             message = "Document URL must be a valid HTTPS URL ending in jpg, jpeg, png, or pdf")
    private String documentURL;

    @ManyToOne
    @JoinColumn(name = "reviewerID")
    private User reviewer; // Optional: Admin/staff

    @Column(length = 1000)
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes; // Reviewer notes (optional)
}
