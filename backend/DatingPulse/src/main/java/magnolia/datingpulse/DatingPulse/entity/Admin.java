package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminID;

    @OneToOne
    @JoinColumn(name = "user_id")
    @NotNull(message = "User is required")
    private User user;

    @Column
    private String[] permissions; // Using array to match DB TEXT[]

}