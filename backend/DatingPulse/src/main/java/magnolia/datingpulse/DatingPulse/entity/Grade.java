package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id")
    private Long gradeID;

    @ManyToOne
    @JoinColumn(name = "userGivenID", nullable = false)
    @NotNull(message = "User who gave the grade is required")
    private User userGiven;

    @ManyToOne
    @JoinColumn(name = "userReceivedID", nullable = false)
    @NotNull(message = "User who received the grade is required")
    private User userReceived;

    @Column(nullable = false)
    @NotNull(message = "Grade value is required")
    @Min(value = 1, message = "Grade must be at least 1")
    @Max(value = 5, message = "Grade must not exceed 5")
    private Integer grade; // Numeric grade (e.g., 1-5 stars)
}