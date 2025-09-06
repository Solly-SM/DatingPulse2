package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_one_id", "user_two_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_one_id", nullable = false)
    private User userOne;

    @ManyToOne
    @JoinColumn(name = "user_two_id", nullable = false)
    private User userTwo;

    private LocalDateTime matchedAt;


    private String matchSource; // How the match occurred (e.g., swipe, algorithm, etc.)


    private Boolean isActive; // For unmatched/blocking logic

    @Column
    private LocalDateTime expiresAt;
}