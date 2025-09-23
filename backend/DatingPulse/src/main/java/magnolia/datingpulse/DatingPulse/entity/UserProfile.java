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
    @Pattern(regexp = "^(male|female|other|non_binary|MALE|FEMALE|OTHER|NON_BINARY)$", 
             message = "Gender must be male, female, other, or non_binary")
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
    private Boolean showDistance = true;

    @Column(name = "show_gender")
    private Boolean showGender = true;

    @Column(name = "show_age")
    private Boolean showAge = true;

    @Column(name = "show_location")
    private Boolean showLocation = true;

    @Column(name = "is_profile_complete")
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
    private PrivacyLevel privacy = PrivacyLevel.PUBLIC; // Who can view profile as per schema
    
    // Physical Attributes (additional)
    @Column(name = "height")
    @Min(value = 100, message = "Height must be at least 100 cm")
    @Max(value = 250, message = "Height must not exceed 250 cm")
    private Integer height;
    
    @Column(name = "weight")
    @Min(value = 30, message = "Weight must be at least 30 kg")
    @Max(value = 300, message = "Weight must not exceed 300 kg")
    private Integer weight;
    
    @Column(name = "body_type", length = 50)
    @Size(max = 50, message = "Body type must not exceed 50 characters")
    private String bodyType;
    
    @Column(name = "ethnicity", length = 100)
    @Size(max = 100, message = "Ethnicity must not exceed 100 characters")
    private String ethnicity;
    
    // Lifestyle Data
    @Column(name = "pets", length = 100)
    @Size(max = 100, message = "Pets information must not exceed 100 characters")
    private String pets;
    
    @Column(name = "drinking", length = 50)
    @Size(max = 50, message = "Drinking preference must not exceed 50 characters")
    private String drinking;
    
    @Column(name = "smoking", length = 50)
    @Size(max = 50, message = "Smoking preference must not exceed 50 characters")
    private String smoking;
    
    @Column(name = "workout", length = 50)
    @Size(max = 50, message = "Workout preference must not exceed 50 characters")
    private String workout;
    
    @Column(name = "dietary_preference", length = 100)
    @Size(max = 100, message = "Dietary preference must not exceed 100 characters")
    private String dietaryPreference;
    
    @Column(name = "social_media", length = 50)
    @Size(max = 50, message = "Social media preference must not exceed 50 characters")
    private String socialMedia;
    
    @Column(name = "sleeping_habits", length = 100)
    @Size(max = 100, message = "Sleeping habits must not exceed 100 characters")
    private String sleepingHabits;
    
    @ElementCollection
    @CollectionTable(name = "user_languages", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "language")
    private Set<String> languages;
    
    // Preferences
    @Column(name = "relationship_goal", length = 100)
    @Size(max = 100, message = "Relationship goal must not exceed 100 characters")
    private String relationshipGoal;
    
    @Column(name = "sexual_orientation", length = 50)
    @Size(max = 50, message = "Sexual orientation must not exceed 50 characters")
    private String sexualOrientation;
    
    @Column(name = "looking_for", length = 500)
    @Size(max = 500, message = "Looking for must not exceed 500 characters")
    private String lookingFor;
    
    @Column(name = "interested_in", length = 20)
    @Pattern(regexp = "^(male|female|both|all|MALE|FEMALE|BOTH|ALL)$", 
             message = "Interested in must be male, female, both, or all")
    private String interestedIn;
    
    // Personality
    @Column(name = "communication_style", length = 100)
    @Size(max = 100, message = "Communication style must not exceed 100 characters")
    private String communicationStyle;
    
    @Column(name = "love_language", length = 50)
    @Size(max = 50, message = "Love language must not exceed 50 characters")
    private String loveLanguage;
    
    @Column(name = "zodiac_sign", length = 20)
    @Size(max = 20, message = "Zodiac sign must not exceed 20 characters")
    private String zodiacSign;
    
    // Media
    @Column(name = "audio_intro_url", length = 500)
    @Size(max = 500, message = "Audio intro URL must not exceed 500 characters")
    private String audioIntroUrl;
    
    // Additional visibility controls
    @Column(name = "show_orientation")
    private Boolean showOrientation = false;
    
    // Additional Optional Profile Fields
    @Column(name = "religion", length = 100)
    @Size(max = 100, message = "Religion must not exceed 100 characters")
    private String religion;
    
    @Column(name = "political_views", length = 100)
    @Size(max = 100, message = "Political views must not exceed 100 characters")
    private String politicalViews;
    
    @Column(name = "family_plans", length = 100)
    @Size(max = 100, message = "Family plans must not exceed 100 characters")
    private String familyPlans;
    
    @Column(name = "fitness_level", length = 50)
    @Size(max = 50, message = "Fitness level must not exceed 50 characters")
    private String fitnessLevel;
    
    @Column(name = "travel_frequency", length = 50)
    @Size(max = 50, message = "Travel frequency must not exceed 50 characters")
    private String travelFrequency;
    
    @Column(name = "industry", length = 100)
    @Size(max = 100, message = "Industry must not exceed 100 characters")
    private String industry;
    
    @ElementCollection
    @CollectionTable(name = "user_music_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "preference")
    private Set<String> musicPreferences;
    
    @ElementCollection
    @CollectionTable(name = "user_food_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "preference")
    private Set<String> foodPreferences;
    
    @ElementCollection
    @CollectionTable(name = "user_entertainment_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "preference")
    private Set<String> entertainmentPreferences;
    
    @Column(name = "currently_reading", length = 200)
    @Size(max = 200, message = "Currently reading must not exceed 200 characters")
    private String currentlyReading;
    
    @Column(name = "life_goals", length = 500)
    @Size(max = 500, message = "Life goals must not exceed 500 characters")
    private String lifeGoals;
    
    @Column(name = "pet_preferences", length = 100)
    @Size(max = 100, message = "Pet preferences must not exceed 100 characters")
    private String petPreferences;
}