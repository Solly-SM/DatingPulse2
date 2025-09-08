package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "User dating preferences and search criteria")
public class PreferenceDTO {
    @Schema(description = "Unique identifier for the preference", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @NotBlank(message = "Gender preference is required")
    @Pattern(regexp = "^(MALE|FEMALE|ALL|NON_BINARY)$", 
             message = "Gender preference must be MALE, FEMALE, ALL, or NON_BINARY")
    @Schema(description = "Preferred gender for matches", example = "ALL", allowableValues = {"MALE", "FEMALE", "ALL", "NON_BINARY"})
    private String genderPreference;
    
    @NotNull(message = "Minimum age is required")
    @Min(value = 18, message = "Minimum age must be at least 18")
    @Max(value = 100, message = "Minimum age must not exceed 100")
    @Schema(description = "Minimum age preference", example = "25", minimum = "18", maximum = "100")
    private Integer ageMin;
    
    @NotNull(message = "Maximum age is required")
    @Min(value = 18, message = "Maximum age must be at least 18")
    @Max(value = 100, message = "Maximum age must not exceed 100")
    @Schema(description = "Maximum age preference", example = "35", minimum = "18", maximum = "100")
    private Integer ageMax;
    
    @NotNull(message = "Maximum distance is required")
    @Min(value = 1, message = "Maximum distance must be at least 1 km")
    @Max(value = 1000, message = "Maximum distance must not exceed 1000 km")
    @Schema(description = "Maximum distance for matches in kilometers", example = "50", minimum = "1", maximum = "1000")
    private Integer maxDistance;
    
    @Pattern(regexp = "^(CASUAL|SERIOUS|MARRIAGE|FRIENDSHIP|OPEN)$", 
             message = "Relationship type must be CASUAL, SERIOUS, MARRIAGE, FRIENDSHIP, or OPEN")
    @Schema(description = "Preferred relationship type", example = "SERIOUS", 
            allowableValues = {"CASUAL", "SERIOUS", "MARRIAGE", "FRIENDSHIP", "OPEN"})
    private String relationshipType;
    
    @Schema(description = "Whether user wants children", example = "true")
    private Boolean wantsChildren;
    
    @Pattern(regexp = "^(HIGH_SCHOOL|UNDERGRADUATE|GRADUATE|POSTGRADUATE|PHD|TRADE_SCHOOL|OTHER)$", 
             message = "Education level must be a valid option")
    @Schema(description = "Preferred education level", example = "UNDERGRADUATE")
    private String educationLevel;
    
    @Size(max = 50, message = "Religion must not exceed 50 characters")
    @Schema(description = "Religious preference", example = "Christian", maxLength = 50)
    private String religion;
    
    @Pattern(regexp = "^(NEVER|OCCASIONALLY|SOCIALLY|REGULARLY|DAILY)$", 
             message = "Smoking preference must be NEVER, OCCASIONALLY, SOCIALLY, REGULARLY, or DAILY")
    @Schema(description = "Smoking preference", example = "NEVER")
    private String smoking;
    
    @Pattern(regexp = "^(NEVER|OCCASIONALLY|SOCIALLY|REGULARLY|DAILY)$", 
             message = "Drinking preference must be NEVER, OCCASIONALLY, SOCIALLY, REGULARLY, or DAILY")
    @Schema(description = "Drinking preference", example = "SOCIALLY")
    private String drinking;
    
    @Pattern(regexp = "^(LIBERAL|CONSERVATIVE|MODERATE|APOLITICAL|OTHER)$", 
             message = "Political preference must be a valid option")
    @Schema(description = "Political preference", example = "MODERATE")
    private String politics;
    
    @Size(max = 100, message = "Pets preference must not exceed 100 characters")
    @Schema(description = "Pet preferences", example = "Love dogs and cats", maxLength = 100)
    private String pets;
    
    @Size(max = 200, message = "Languages must not exceed 200 characters")
    @Schema(description = "Spoken languages", example = "English, Spanish, French", maxLength = 200)
    private String languages;
    
    @Schema(description = "Open to LGBTQ+ community", example = "true")
    private Boolean openToLGBTQ;
    
    @Min(value = 100, message = "Minimum height must be at least 100 cm")
    @Max(value = 250, message = "Minimum height must not exceed 250 cm")
    @Schema(description = "Minimum height preference in cm", example = "160", minimum = "100", maximum = "250")
    private Integer minHeight;
    
    @Min(value = 100, message = "Maximum height must be at least 100 cm")
    @Max(value = 250, message = "Maximum height must not exceed 250 cm")
    @Schema(description = "Maximum height preference in cm", example = "190", minimum = "100", maximum = "250")
    private Integer maxHeight;
    
    @Pattern(regexp = "^(CM|FEET_INCHES)$", 
             message = "Height unit must be CM or FEET_INCHES")
    @Schema(description = "Height measurement unit", example = "CM", allowableValues = {"CM", "FEET_INCHES"})
    private String heightUnit;
    
    @Pattern(regexp = "^(SLIM|ATHLETIC|AVERAGE|CURVY|PLUS_SIZE|MUSCULAR)$", 
             message = "Body type must be a valid option")
    @Schema(description = "Preferred body type", example = "ATHLETIC")
    private String bodyType;
    
    @Size(max = 50, message = "Ethnicity must not exceed 50 characters")
    @Schema(description = "Ethnicity preference", example = "Mixed", maxLength = 50)
    private String ethnicity;
    
    @Pattern(regexp = "^(OMNIVORE|VEGETARIAN|VEGAN|PESCATARIAN|KETO|PALEO|OTHER)$", 
             message = "Dietary preference must be a valid option")
    @Schema(description = "Dietary preference", example = "VEGETARIAN")
    private String dietaryPreference;
    
    @Pattern(regexp = "^(NEVER|RARELY|SOMETIMES|REGULARLY|DAILY)$", 
             message = "Exercise preference must be a valid option")
    @Schema(description = "Exercise preference", example = "REGULARLY")
    private String exercisePreference;
    
    @Pattern(regexp = "^(VACCINATED|UNVACCINATED|PREFER_NOT_TO_SAY|NO_PREFERENCE)$", 
             message = "Covid preference must be a valid option")
    @Schema(description = "Covid vaccination preference", example = "VACCINATED")
    private String covidPreference;
    
    @Size(max = 20, message = "Star sign must not exceed 20 characters")
    @Schema(description = "Astrological sign preference", example = "Leo", maxLength = 20)
    private String starSign;
    
    @Size(max = 500, message = "Hobbies must not exceed 500 characters")
    @Schema(description = "Hobby preferences", example = "Reading, hiking, cooking", maxLength = 500)
    private String hobbies;
    
    @Size(max = 200, message = "Family plans must not exceed 200 characters")
    @Schema(description = "Family planning preferences", example = "Want kids in the future", maxLength = 200)
    private String familyPlans;
    
    @NotNull(message = "User profile ID is required")
    @Positive(message = "User profile ID must be positive")
    @Schema(description = "Associated user profile ID", example = "1")
    private Long userProfileID;
}