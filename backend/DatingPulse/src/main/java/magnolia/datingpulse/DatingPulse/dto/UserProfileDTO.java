package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserProfileDTO {
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userID;
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must not exceed 100")
    private Integer age;
    
    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(male|female|other|non_binary|MALE|FEMALE|OTHER|NON_BINARY)$", 
             message = "Gender must be one of: male, female, other, non_binary")
    private String gender;
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;
    
    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;
    
    private String pp;
    private String avatarThumbnail;
    private String country;
    private String region;
    private String city;
    
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;
    
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;
    
    private Set<@Positive(message = "Interest ID must be positive") Long> interestIDs;
    
    @Positive(message = "Preference ID must be positive")
    private Long preferenceID;
    
    private LocalDateTime lastSeen;
    private String education;
    private String jobTitle;
    private String relationship;
    private String privacy;
    
    // Physical Attributes  
    private Integer height;
    private Integer weight;
    private String bodyType;
    private String ethnicity;
    
    // Lifestyle Data
    private String pets;
    private String drinking;
    private String smoking;
    private String workout;
    private String dietaryPreference;
    private String socialMedia;
    private String sleepingHabits;
    private Set<String> languages;
    
    // Preferences
    private String relationshipGoal;
    private String sexualOrientation;
    private String lookingFor;
    private String interestedIn;
    
    // Personality
    private String communicationStyle;
    private String loveLanguage;
    private String zodiacSign;
    
    // Media
    private String audioIntroUrl;
    
    // Field visibility controls
    private Boolean showGender;
    private Boolean showAge;
    private Boolean showLocation;
    private Boolean showOrientation;
    
    // Additional Optional Profile Fields
    private String religion;
    private String politicalViews;
    private String familyPlans;
    private String fitnessLevel;
    private String travelFrequency;
    private String industry;
    private Set<String> musicPreferences;
    private Set<String> foodPreferences;
    private Set<String> entertainmentPreferences;
    private String currentlyReading;
    private String lifeGoals;
    private String petPreferences;
    
    // Compatibility score for matching purposes (not persisted)
    private Double compatibilityScore;
}