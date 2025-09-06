package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
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
    private Long gradeID;

    @ManyToOne
    @JoinColumn(name = "userGivenID", nullable = false)
    private User userGiven;

    @ManyToOne
    @JoinColumn(name = "userReceivedID", nullable = false)
    private User userReceived;

    @Column(nullable = false)
    private Integer grade; // Numeric grade (e.g., 1-5 stars)
}