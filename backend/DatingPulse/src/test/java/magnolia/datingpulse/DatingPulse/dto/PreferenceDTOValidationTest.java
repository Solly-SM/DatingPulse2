package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class PreferenceDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidPreference() {
        PreferenceDTO dto = new PreferenceDTO();
        dto.setId(1L);
        dto.setGenderPreference("ALL");
        dto.setAgeMin(25);
        dto.setAgeMax(35);
        dto.setMaxDistance(50);
        dto.setRelationshipType("SERIOUS");
        dto.setUserProfileID(1L);

        Set<ConstraintViolation<PreferenceDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid PreferenceDTO should not have violations");
    }

    @Test
    void testInvalidAgeRange() {
        PreferenceDTO dto = new PreferenceDTO();
        dto.setGenderPreference("ALL");
        dto.setAgeMin(17); // Below minimum
        dto.setAgeMax(101); // Above maximum
        dto.setMaxDistance(50);
        dto.setUserProfileID(1L);

        Set<ConstraintViolation<PreferenceDTO>> violations = validator.validate(dto);
        
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("ageMin") && 
                v.getMessage().contains("18")),
                "Age minimum should be at least 18");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("ageMax") && 
                v.getMessage().contains("100")),
                "Age maximum should not exceed 100");
    }

    @Test
    void testInvalidDistance() {
        PreferenceDTO dto = new PreferenceDTO();
        dto.setGenderPreference("ALL");
        dto.setAgeMin(25);
        dto.setAgeMax(35);
        dto.setMaxDistance(1001); // Exceeds maximum
        dto.setUserProfileID(1L);

        Set<ConstraintViolation<PreferenceDTO>> violations = validator.validate(dto);
        
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("maxDistance") && 
                v.getMessage().contains("1000")),
                "Distance should not exceed 1000 km");
    }

    @Test
    void testRequiredFields() {
        PreferenceDTO dto = new PreferenceDTO();

        Set<ConstraintViolation<PreferenceDTO>> violations = validator.validate(dto);
        
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("genderPreference")),
                "Gender preference should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("ageMin")),
                "Minimum age should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("ageMax")),
                "Maximum age should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("maxDistance")),
                "Maximum distance should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("userProfileID")),
                "User profile ID should be required");
    }

    @Test
    void testInvalidGenderPreference() {
        PreferenceDTO dto = new PreferenceDTO();
        dto.setGenderPreference("INVALID");
        dto.setAgeMin(25);
        dto.setAgeMax(35);
        dto.setMaxDistance(50);
        dto.setUserProfileID(1L);

        Set<ConstraintViolation<PreferenceDTO>> violations = validator.validate(dto);
        
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("genderPreference") && 
                v.getMessage().contains("must be MALE, FEMALE, ALL, or NON_BINARY")),
                "Invalid gender preference should be rejected");
    }
}