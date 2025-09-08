package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "interests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Interest name is required")
    @Size(min = 2, max = 50, message = "Interest name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-]+$", message = "Interest name can only contain letters, numbers, spaces, and hyphens")
    private String name;
}