package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @Column(name = "user_id")
    private Long userID;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "First name can only contain letters, spaces, hyphens, and apostrophes")
    private String firstname;
    
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes")
    private String lastname;
    
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 120, message = "Age must not exceed 120")
    private Integer age;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER|NON_BINARY)$", message = "Gender must be MALE, FEMALE, OTHER, or NON_BINARY")
    private String gender;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @Column(length = 1024)
    @Size(max = 1024, message = "Bio must not exceed 1024 characters")
    private String bio;

    @Size(max = 500, message = "Profile picture URL must not exceed 500 characters")
    @Pattern(regexp = "^(https?://.*\\.(jpg|jpeg|png|gif|webp))$", message = "Profile picture must be a valid image URL")
    private String pp; // Profile picture URL
    
    @Size(max = 500, message = "Avatar thumbnail URL must not exceed 500 characters")
    @Pattern(regexp = "^(https?://.*\\.(jpg|jpeg|png|gif|webp))$", message = "Avatar thumbnail must be a valid image URL")
    private String avatarThumbnail; // Thumbnail URL

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;
    
    @Size(max = 100, message = "Region must not exceed 100 characters")
    private String region;
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;
    
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    @ManyToMany
    @JoinTable(
            name = "user_interests",
            joinColumns = @JoinColumn(name = "user_profile_id"),
            inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private Set<Interest> interests;

    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL)
    private Preference preference;

    private LocalDateTime lastSeen;

    @Size(max = 200, message = "Education must not exceed 200 characters")
    private String education;
    
    @Size(max = 200, message = "Job title must not exceed 200 characters")
    private String jobTitle;

    @Pattern(regexp = "^(SINGLE|COMPLICATED|OPEN|PREFER_NOT_TO_SAY)$", message = "Relationship status must be SINGLE, COMPLICATED, OPEN, or PREFER_NOT_TO_SAY")
    private String relationship;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Privacy level is required")
    private PrivacyLevel privacy;
}