package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class PreferenceValidationTest {

    private Validator validator;
    private UserProfile testUserProfile;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        // Create a minimal test user profile
        testUserProfile = UserProfile.builder()
                .userID(1L)
                .build();
    }

    @Test
    void testValidPreference() {
        Preference preference = Preference.builder()
                .genderPreference("BOTH")
                .ageMin(25)
                .ageMax(35)
                .maxDistance(50)
                .relationshipType("SERIOUS")
                .educationLevel("BACHELOR")
                .smoking("NO")
                .drinking("SOCIALLY")
                .minHeight(160)
                .maxHeight(180)
                .heightUnit("cm")
                .bodyType("ATHLETIC")
                .exercisePreference("WEEKLY")
                .userProfile(testUserProfile)
                .build();

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.isEmpty(), "Valid preference should not have violations");
    }

    @Test
    void testInvalidGenderPreference() {
        Preference preference = createValidPreference();
        preference.setGenderPreference("INVALID");

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("genderPreference")),
                "Invalid gender preference should be caught");
    }

    @Test
    void testInvalidAgeRange() {
        Preference preference = createValidPreference();
        preference.setAgeMin(17); // Below minimum
        preference.setAgeMax(101); // Above maximum

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("ageMin")),
                "Age below 18 should be invalid");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("ageMax")),
                "Age above 100 should be invalid");
    }

    @Test
    void testInvalidDistance() {
        Preference preference = createValidPreference();
        preference.setMaxDistance(0); // Below minimum
        
        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("maxDistance") &&
                v.getMessage().contains("1")),
                "Distance below 1 should be invalid");

        preference.setMaxDistance(1001); // Above maximum
        violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("maxDistance") &&
                v.getMessage().contains("1000")),
                "Distance above 1000 should be invalid");
    }

    @Test
    void testInvalidRelationshipType() {
        Preference preference = createValidPreference();
        preference.setRelationshipType("INVALID");

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("relationshipType")),
                "Invalid relationship type should be caught");
    }

    @Test
    void testInvalidHeightRange() {
        Preference preference = createValidPreference();
        preference.setMinHeight(119); // Below minimum
        preference.setMaxHeight(251); // Above maximum

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("minHeight")),
                "Height below 120cm should be invalid");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("maxHeight")),
                "Height above 250cm should be invalid");
    }

    @Test
    void testInvalidHeightUnit() {
        Preference preference = createValidPreference();
        preference.setHeightUnit("ft");

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("heightUnit")),
                "Invalid height unit should be caught");
    }

    @Test
    void testStringLengthLimits() {
        Preference preference = createValidPreference();
        preference.setReligion("a".repeat(51)); // Exceeds max length
        preference.setLanguages("b".repeat(201)); // Exceeds max length
        preference.setHobbies("c".repeat(501)); // Exceeds max length

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("religion")),
                "Religion exceeding 50 characters should be invalid");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("languages")),
                "Languages exceeding 200 characters should be invalid");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("hobbies")),
                "Hobbies exceeding 500 characters should be invalid");
    }

    @Test
    void testRequiredUserProfile() {
        Preference preference = createValidPreference();
        preference.setUserProfile(null);

        Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userProfile")),
                "User profile should be required");
    }

    @Test
    void testValidEnumValues() {
        String[] validSmokingValues = {"YES", "NO", "OCCASIONALLY", "NEVER"};
        String[] validDrinkingValues = {"YES", "NO", "OCCASIONALLY", "NEVER", "SOCIALLY"};
        String[] validExerciseValues = {"DAILY", "WEEKLY", "MONTHLY", "RARELY", "NEVER"};

        for (String smoking : validSmokingValues) {
            Preference preference = createValidPreference();
            preference.setSmoking(smoking);
            Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("smoking")),
                    "Smoking value '" + smoking + "' should be valid");
        }

        for (String drinking : validDrinkingValues) {
            Preference preference = createValidPreference();
            preference.setDrinking(drinking);
            Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("drinking")),
                    "Drinking value '" + drinking + "' should be valid");
        }

        for (String exercise : validExerciseValues) {
            Preference preference = createValidPreference();
            preference.setExercisePreference(exercise);
            Set<ConstraintViolation<Preference>> violations = validator.validate(preference);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("exercisePreference")),
                    "Exercise value '" + exercise + "' should be valid");
        }
    }

    private Preference createValidPreference() {
        return Preference.builder()
                .genderPreference("BOTH")
                .ageMin(25)
                .ageMax(35)
                .maxDistance(50)
                .relationshipType("SERIOUS")
                .educationLevel("BACHELOR")
                .smoking("NO")
                .drinking("SOCIALLY")
                .minHeight(160)
                .maxHeight(180)
                .heightUnit("cm")
                .bodyType("ATHLETIC")
                .exercisePreference("WEEKLY")
                .userProfile(testUserProfile)
                .build();
    }
}