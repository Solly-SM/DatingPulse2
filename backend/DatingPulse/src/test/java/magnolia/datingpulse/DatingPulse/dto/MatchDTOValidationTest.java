package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive validation tests for MatchDTO
 * Testing match creation and relationship validation
 */
class MatchDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidMatchDTO() {
        MatchDTO matchDTO = createValidMatchDTO();

        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);
        assertTrue(violations.isEmpty(), "Valid MatchDTO should not have violations");
    }

    @Test
    void testUserOneIDValidation() {
        MatchDTO matchDTO = createValidMatchDTO();

        // Test null userOneID
        matchDTO.setUserOneID(null);
        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userOneID") && 
                v.getMessage().contains("required")),
                "Null userOneID should be invalid");

        // Test non-positive userOneID
        matchDTO.setUserOneID(0L);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userOneID") && 
                v.getMessage().contains("positive")),
                "Zero userOneID should be invalid");

        matchDTO.setUserOneID(-1L);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userOneID") && 
                v.getMessage().contains("positive")),
                "Negative userOneID should be invalid");

        // Test valid userOneID
        matchDTO.setUserOneID(1L);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("userOneID")),
                "Positive userOneID should be valid");
    }

    @Test
    void testUserTwoIDValidation() {
        MatchDTO matchDTO = createValidMatchDTO();

        // Test null userTwoID
        matchDTO.setUserTwoID(null);
        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userTwoID") && 
                v.getMessage().contains("required")),
                "Null userTwoID should be invalid");

        // Test non-positive userTwoID
        matchDTO.setUserTwoID(0L);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userTwoID") && 
                v.getMessage().contains("positive")),
                "Zero userTwoID should be invalid");

        matchDTO.setUserTwoID(-1L);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userTwoID") && 
                v.getMessage().contains("positive")),
                "Negative userTwoID should be invalid");

        // Test valid userTwoID
        matchDTO.setUserTwoID(2L);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("userTwoID")),
                "Positive userTwoID should be valid");
    }

    @Test
    void testMatchSourceValidation() {
        MatchDTO matchDTO = createValidMatchDTO();

        // Test null matchSource (should be valid as it's optional)
        matchDTO.setMatchSource(null);
        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("matchSource")),
                "Null matchSource should be valid (optional field)");

        // Test invalid matchSource values
        String[] invalidSources = {"SWIPE", "LIKE", "DISLIKE", "INVALID", "mutual_like", "super_like", "algorithm", "manual"};
        for (String source : invalidSources) {
            matchDTO.setMatchSource(source);
            violations = validator.validate(matchDTO);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("matchSource") && 
                    v.getMessage().contains("must be one of")),
                    "Match source '" + source + "' should be invalid");
        }

        // Test valid matchSource values
        String[] validSources = {"MUTUAL_LIKE", "SUPER_LIKE", "ALGORITHM", "MANUAL"};
        for (String source : validSources) {
            matchDTO.setMatchSource(source);
            violations = validator.validate(matchDTO);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("matchSource")),
                    "Match source '" + source + "' should be valid");
        }
    }

    @Test
    void testOptionalFieldsValidation() {
        // Test that MatchDTO is valid with only required fields
        MatchDTO minimalMatchDTO = new MatchDTO();
        minimalMatchDTO.setUserOneID(1L);
        minimalMatchDTO.setUserTwoID(2L);

        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(minimalMatchDTO);
        assertTrue(violations.isEmpty(), "MatchDTO with only required fields should be valid");

        // Test that optional fields (when null) don't cause violations
        MatchDTO matchDTO = createValidMatchDTO();
        matchDTO.setId(null);
        matchDTO.setMatchedAt(null);
        matchDTO.setMatchSource(null);
        matchDTO.setIsActive(null);
        matchDTO.setExpiresAt(null);

        violations = validator.validate(matchDTO);
        assertTrue(violations.isEmpty(), "MatchDTO with null optional fields should be valid");
    }

    @Test
    void testCompleteValidationWorkflow() {
        // Test completely invalid MatchDTO
        MatchDTO invalidMatchDTO = new MatchDTO();
        invalidMatchDTO.setUserOneID(-1L);  // invalid
        invalidMatchDTO.setUserTwoID(0L);   // invalid
        invalidMatchDTO.setMatchSource("INVALID");  // invalid

        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(invalidMatchDTO);
        assertFalse(violations.isEmpty(), "Invalid MatchDTO should have violations");

        // Should have violations for userOneID, userTwoID, and matchSource
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userOneID")));
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userTwoID")));
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("matchSource")));

        // Test minimal valid MatchDTO
        MatchDTO minimalMatchDTO = new MatchDTO();
        minimalMatchDTO.setUserOneID(1L);
        minimalMatchDTO.setUserTwoID(2L);

        violations = validator.validate(minimalMatchDTO);
        assertTrue(violations.isEmpty(), "Minimal valid MatchDTO should not have violations");

        // Test complete valid MatchDTO
        MatchDTO completeMatchDTO = createValidMatchDTO();
        violations = validator.validate(completeMatchDTO);
        assertTrue(violations.isEmpty(), "Complete valid MatchDTO should not have violations");
    }

    @Test
    void testSameUserMatch() {
        // Test that validation allows same user IDs (business logic should prevent this)
        MatchDTO matchDTO = createValidMatchDTO();
        matchDTO.setUserOneID(1L);
        matchDTO.setUserTwoID(1L);  // Same user

        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);
        // Validation should pass (business logic constraint, not validation constraint)
        assertTrue(violations.isEmpty(), "Same user match should pass validation (business logic constraint)");
    }

    @Test
    void testDateTimeFields() {
        MatchDTO matchDTO = createValidMatchDTO();

        // Test that date/time fields don't have validation constraints
        matchDTO.setMatchedAt(LocalDateTime.now().plusYears(10));  // Future date
        matchDTO.setExpiresAt(LocalDateTime.now().minusYears(10)); // Past expiry

        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("matchedAt") ||
                v.getPropertyPath().toString().equals("expiresAt")),
                "DateTime fields should not have validation constraints");
    }

    @Test
    void testBooleanFields() {
        MatchDTO matchDTO = createValidMatchDTO();

        // Test that boolean fields accept all values
        matchDTO.setIsActive(true);
        Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("isActive")),
                "Boolean true should be valid");

        matchDTO.setIsActive(false);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("isActive")),
                "Boolean false should be valid");

        matchDTO.setIsActive(null);
        violations = validator.validate(matchDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("isActive")),
                "Boolean null should be valid");
    }

    @Test
    void testMatchSourceCaseSensitivity() {
        MatchDTO matchDTO = createValidMatchDTO();

        // Test that match sources are case-sensitive
        String[] caseVariants = {
            "mutual_like", "Mutual_Like", "MUTUAL_LIKE",
            "super_like", "Super_Like", "SUPER_LIKE",
            "algorithm", "Algorithm", "ALGORITHM",
            "manual", "Manual", "MANUAL"
        };

        for (String source : caseVariants) {
            matchDTO.setMatchSource(source);
            Set<ConstraintViolation<MatchDTO>> violations = validator.validate(matchDTO);

            if (source.equals("MUTUAL_LIKE") || source.equals("SUPER_LIKE") || 
                source.equals("ALGORITHM") || source.equals("MANUAL")) {
                assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("matchSource")),
                        "Match source '" + source + "' should be valid (exact case match)");
            } else {
                assertTrue(violations.stream().anyMatch(v -> 
                        v.getPropertyPath().toString().equals("matchSource") && 
                        v.getMessage().contains("must be one of")),
                        "Match source '" + source + "' should be invalid (case sensitive)");
            }
        }
    }

    private MatchDTO createValidMatchDTO() {
        MatchDTO matchDTO = new MatchDTO();
        matchDTO.setId(1L);
        matchDTO.setUserOneID(100L);
        matchDTO.setUserTwoID(200L);
        matchDTO.setMatchedAt(LocalDateTime.now());
        matchDTO.setMatchSource("MUTUAL_LIKE");
        matchDTO.setIsActive(true);
        matchDTO.setExpiresAt(LocalDateTime.now().plusDays(30));
        return matchDTO;
    }
}