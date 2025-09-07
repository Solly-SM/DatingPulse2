package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;

@Data
public class PreferenceDTO {
    private Long id;
    private String genderPreference;
    private Integer ageMin;
    private Integer ageMax;
    private Integer maxDistance;
    private String relationshipType;
    private Boolean wantsChildren;
    private String educationLevel;
    private String religion;
    private String smoking;
    private String drinking;
    private String politics;
    private String pets;
    private String languages;
    private Boolean openToLGBTQ;
    private Integer minHeight;
    private Integer maxHeight;
    private String heightUnit;
    private String bodyType;
    private String ethnicity;
    private String dietaryPreference;
    private String exercisePreference;
    private String covidPreference;
    private String starSign;
    private String hobbies;
    private String familyPlans;
    private Long userProfileID;
}