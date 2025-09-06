package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Integer minHeight;         // in cm or inches
    private Integer maxHeight;
    private String heightUnit;         // "cm" or "in"
    private String bodyType;
    private String ethnicity;
    private String dietaryPreference;
    private String exercisePreference;
    private String covidPreference;
    private String starSign;
    private String hobbies;            // comma-separated or ManyToMany if you want normalization
    private String familyPlans;        // "wants_kids", "no_kids", etc.

    @OneToOne
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;
}