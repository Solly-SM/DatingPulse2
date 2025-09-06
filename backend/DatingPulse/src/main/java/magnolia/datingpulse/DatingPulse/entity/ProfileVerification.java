package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
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
    private Long verificationID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // photo, ID, social, etc.

    @Column(nullable = false)
    private String status; // pending, approved, rejected, expired

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    @Column
    private LocalDateTime verifiedAt;

    @Column
    private LocalDateTime rejectedAt;

    @Column
    private String documentURL;

    @ManyToOne
    @JoinColumn(name = "reviewerID")
    private User reviewer; // Optional: Admin/staff

    @Column(length = 1000)
    private String notes; // Reviewer notes (optional)
}
