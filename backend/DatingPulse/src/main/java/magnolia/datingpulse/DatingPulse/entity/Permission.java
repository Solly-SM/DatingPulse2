package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Permission name is required")
    @Size(min = 3, max = 50, message = "Permission name must be between 3 and 50 characters")
    @Pattern(regexp = "^[A-Z_]+$", 
             message = "Permission name must contain only uppercase letters and underscores")
    private String name; // e.g., "USER_MANAGE", "PHOTO_MODERATE", etc.
}