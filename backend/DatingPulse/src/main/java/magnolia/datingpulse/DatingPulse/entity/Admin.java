package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminID;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userID")
    private User user;

    @Column(nullable = false)
    private String role; // superAdmin, moderator


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "admin_permissions",
            joinColumns = @JoinColumn(name = "admin_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions;

}