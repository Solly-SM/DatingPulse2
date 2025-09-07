package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long photoID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(nullable = false)
    @NotBlank(message = "Photo URL is required")
    @Pattern(regexp = "^(https?://).*\\.(jpg|jpeg|png|gif|webp)$", 
             message = "URL must be a valid image file URL (jpg, jpeg, png, gif, webp)")
    private String url;

    @Column
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "Profile photo status is required")
    private Boolean isProfilePhoto;

    @Column(nullable = false)
    @NotNull(message = "Private status is required")
    private Boolean isPrivate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Visibility is required")
    private PhotoVisibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Status is required")
    private PhotoStatus status; // Moderation status

    @Column(nullable = false)
    @NotNull(message = "Upload date is required")
    private LocalDateTime uploadedAt;

    @Column
    private LocalDateTime updatedAt; // Audit timestamp

    @Column
    @Min(value = 0, message = "Order index cannot be negative")
    private Integer orderIndex; // For manual gallery ordering
}