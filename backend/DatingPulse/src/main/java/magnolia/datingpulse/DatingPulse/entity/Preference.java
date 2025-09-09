package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Pattern(regexp = "^(MALE|FEMALE|BOTH|NON_BINARY)$", 
             message = "Gender preference must be MALE, FEMALE, BOTH, or NON_BINARY")
    @Column(name = "preferred_gender", length = 20)
    private String preferredGender; // Changed from genderPreference to match schema
    
    @Min(value = 18, message = "Minimum age must be at least 18")
    @Max(value = 100, message = "Minimum age must not exceed 100")
    @Column(name = "min_age")
    private Integer minAge; // Changed from ageMin to match schema
    
    @Min(value = 18, message = "Maximum age must be at least 18")
    @Max(value = 100, message = "Maximum age must not exceed 100")
    @Column(name = "max_age")
    private Integer maxAge; // Changed from ageMax to match schema
    
    @Min(value = 1, message = "Maximum distance must be at least 1")
    @Max(value = 1000, message = "Maximum distance must not exceed 1000")
    @Column(name = "max_distance")
    private Integer maxDistance;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Additional preference fields now persisted to database
    @Pattern(regexp = "^(CASUAL|SERIOUS|MARRIAGE|FRIENDSHIP|HOOKUP)$", 
             message = "Relationship type must be CASUAL, SERIOUS, MARRIAGE, FRIENDSHIP, or HOOKUP")
    @Column(name = "relationship_type", length = 50)
    private String relationshipType;
    
    @Column(name = "wants_children")
    private Boolean wantsChildren;
    
    @Pattern(regexp = "^(HIGH_SCHOOL|COLLEGE|BACHELOR|MASTER|DOCTORATE|TRADE|OTHER)$", 
             message = "Education level must be valid value")
    @Size(max = 50, message = "Education level must not exceed 50 characters")
    @Column(name = "education_level", length = 50)
    private String educationLevel;
    
    @Size(max = 50, message = "Religion must not exceed 50 characters")
    @Column(name = "religion", length = 50)
    private String religion;
    
    @Pattern(regexp = "^(YES|NO|OCCASIONALLY|NEVER)$", 
             message = "Smoking preference must be YES, NO, OCCASIONALLY, or NEVER")
    @Column(name = "smoking", length = 50)
    private String smoking;
    
    @Pattern(regexp = "^(YES|NO|OCCASIONALLY|NEVER|SOCIALLY)$", 
             message = "Drinking preference must be YES, NO, OCCASIONALLY, NEVER, or SOCIALLY")
    @Column(name = "drinking", length = 50)
    private String drinking;
    
    @Size(max = 50, message = "Politics must not exceed 50 characters")
    @Column(name = "politics", length = 50)
    private String politics;
    
    @Size(max = 100, message = "Pets preference must not exceed 100 characters")
    @Column(name = "pets", length = 100)
    private String pets;
    
    @Size(max = 200, message = "Languages must not exceed 200 characters")
    @Column(name = "languages", length = 200)
    private String languages;
    
    @Column(name = "open_to_lgbtq")
    private Boolean openToLGBTQ;
    
    @Min(value = 120, message = "Minimum height must be at least 120cm")
    @Max(value = 250, message = "Minimum height must not exceed 250cm")
    @Column(name = "min_height")
    private Integer minHeight;         // in cm or inches
    
    @Min(value = 120, message = "Maximum height must be at least 120cm")
    @Max(value = 250, message = "Maximum height must not exceed 250cm")
    @Column(name = "max_height")
    private Integer maxHeight;
    
    @Pattern(regexp = "^(cm|in)$", message = "Height unit must be 'cm' or 'in'")
    @Column(name = "height_unit", length = 10)
    private String heightUnit;         // "cm" or "in"
    
    @Pattern(regexp = "^(SLIM|ATHLETIC|AVERAGE|CURVY|HEAVY|MUSCULAR)$", 
             message = "Body type must be valid value")
    @Column(name = "body_type", length = 50)
    private String bodyType;
    
    @Size(max = 50, message = "Ethnicity must not exceed 50 characters")
    @Column(name = "ethnicity", length = 50)
    private String ethnicity;
    
    @Pattern(regexp = "^(VEGETARIAN|VEGAN|KETO|PALEO|HALAL|KOSHER|NO_PREFERENCE)$", 
             message = "Dietary preference must be valid value")
    @Column(name = "dietary_preference", length = 50)
    private String dietaryPreference;
    
    @Pattern(regexp = "^(DAILY|WEEKLY|MONTHLY|RARELY|NEVER)$", 
             message = "Exercise preference must be DAILY, WEEKLY, MONTHLY, RARELY, or NEVER")
    @Column(name = "exercise_preference", length = 50)
    private String exercisePreference;
    
    @Pattern(regexp = "^(VACCINATED|NOT_VACCINATED|PREFER_VACCINATED|NO_PREFERENCE)$", 
             message = "COVID preference must be valid value")
    @Column(name = "covid_preference", length = 50)
    private String covidPreference;
    
    @Size(max = 20, message = "Star sign must not exceed 20 characters")
    @Column(name = "star_sign", length = 20)
    private String starSign;
    
    @Size(max = 500, message = "Hobbies must not exceed 500 characters")
    @Column(name = "hobbies", length = 500)
    private String hobbies;            // comma-separated or ManyToMany if you want normalization
    
    @Pattern(regexp = "^(WANTS_KIDS|NO_KIDS|MAYBE|HAVE_KIDS|DONT_WANT_MORE)$", 
             message = "Family plans must be valid value")
    @Column(name = "family_plans", length = 50)
    private String familyPlans;        // "wants_kids", "no_kids", etc.

    @OneToOne
    @JoinColumn(name = "user_profile_id")
    @NotNull(message = "User profile is required")
    private UserProfile userProfile;
    
    // Helper methods for backwards compatibility with tests
    public String getGenderPreference() {
        return preferredGender;
    }
    
    public void setGenderPreference(String genderPreference) {
        this.preferredGender = genderPreference;
    }
    
    public Integer getAgeMin() {
        return minAge;
    }
    
    public void setAgeMin(Integer ageMin) {
        this.minAge = ageMin;
    }
    
    public Integer getAgeMax() {
        return maxAge;
    }
    
    public void setAgeMax(Integer ageMax) {
        this.maxAge = ageMax;
    }
    
    // Also provide builder methods for backwards compatibility
    public static class PreferenceBuilder {
        public PreferenceBuilder genderPreference(String genderPreference) {
            this.preferredGender = genderPreference;
            return this;
        }
        
        public PreferenceBuilder ageMin(Integer ageMin) {
            this.minAge = ageMin;
            return this;
        }
        
        public PreferenceBuilder ageMax(Integer ageMax) {
            this.maxAge = ageMax;
            return this;
        }
    }
}