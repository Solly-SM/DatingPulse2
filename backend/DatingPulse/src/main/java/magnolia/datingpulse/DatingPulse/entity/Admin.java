package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @Column(name = "admin_id")
    private Long adminID;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userID")
    @NotNull(message = "User is required")
    private User user;

    @Column(nullable = false)
    @NotBlank(message = "Admin role is required")
    @Pattern(regexp = "^(ADMIN|SUPER_ADMIN)$", 
             message = "Role must be one of: ADMIN, SUPER_ADMIN")
    private String role; // ADMIN, SUPER_ADMIN


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "admin_permissions",
            joinColumns = @JoinColumn(name = "admin_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions;

}