package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
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
    @Column(name = "firstname")
    private String firstname;
    
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes")
    @Column(name = "lastname")
    private String lastname;
    
    @Column(name = "age")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 120, message = "Age must not exceed 120")
    private Integer age;

    @Column(name = "gender", nullable = false, length = 20)
    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER|NON_BINARY)$", message = "Gender must be MALE, FEMALE, OTHER, or NON_BINARY")
    private String gender;

    @Column(name = "dob")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @Column(name = "bio", length = 1024)
    @Size(max = 1024, message = "Bio must not exceed 1024 characters")
    private String bio;

    @Column(name = "pp", length = 500)
    @Size(max = 500, message = "Profile picture URL must not exceed 500 characters")
    @Pattern(regexp = "^(https?://.*\\.(jpg|jpeg|png|gif|webp))$", message = "Profile picture must be a valid image URL")
    private String pp; // Profile picture URL as per schema

    @Column(name = "avatar_thumbnail", length = 500)
    @Size(max = 500, message = "Avatar thumbnail URL must not exceed 500 characters")
    @Pattern(regexp = "^(https?://.*\\.(jpg|jpeg|png|gif|webp))$", message = "Avatar thumbnail must be a valid image URL")
    private String avatarThumbnail; // Thumbnail version of profile picture

    @Column(name = "country", length = 100)
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country; // Country as per schema

    @Column(name = "region", length = 100)
    @Size(max = 100, message = "Region must not exceed 100 characters")
    private String region; // Region as per schema
    
    @Column(name = "city", length = 100)
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city; // City as per schema
    
    @Column(name = "latitude")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;
    
    @Column(name = "longitude")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    @Column(name = "max_distance")
    @Min(value = 1, message = "Max distance must be at least 1")
    @Max(value = 1000, message = "Max distance must not exceed 1000")
    private Integer maxDistance;

    @Column(name = "show_distance")
    @Builder.Default
    private Boolean showDistance = true;

    @Column(name = "is_profile_complete")
    @Builder.Default
    private Boolean isProfileComplete = false;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "user_interests",
            joinColumns = @JoinColumn(name = "user_id"), // Fixed to match schema
            inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private Set<Interest> interests;

    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL)
    private Preference preference; // User preferences as per schema

    @Column(name = "last_seen")
    private LocalDateTime lastSeen; // Last active timestamp as per schema
    
    @Column(name = "education", length = 200)
    @Size(max = 200, message = "Education must not exceed 200 characters")
    private String education; // Education info as per schema
    
    @Column(name = "job_title", length = 200)
    @Size(max = 200, message = "Job title must not exceed 200 characters")
    private String jobTitle; // Job title as per schema
    
    @Column(name = "relationship", length = 50)
    @Pattern(regexp = "^(SINGLE|COMPLICATED|OPEN|PREFER_NOT_TO_SAY)$", message = "Relationship status must be SINGLE, COMPLICATED, OPEN, or PREFER_NOT_TO_SAY")
    private String relationship; // Relationship status as per schema
    
    @Enumerated(EnumType.STRING)
    @Column(name = "privacy", nullable = false)
    @NotNull(message = "Privacy level is required")
    @Builder.Default
    private PrivacyLevel privacy = PrivacyLevel.PUBLIC; // Who can view profile as per schema
}