package magnolia.datingpulse.DatingPulse.entity;

import org.junit.jupiter.api.Test;
import jakarta.persistence.Column;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration test demonstrating the fix for the matchSource column mapping issue
 */
class MatchSchemaValidationFixTest {

    @Test
    void testColumnMappingFix() throws NoSuchFieldException {
        // Verify the fix: @Column annotation should map matchSource field to match_source column
        Field matchSourceField = Match.class.getDeclaredField("matchSource");
        Column columnAnnotation = matchSourceField.getAnnotation(Column.class);
        
        assertNotNull(columnAnnotation, 
                "The @Column annotation is required to fix schema validation error");
        assertEquals("match_source", columnAnnotation.name(), 
                "Column name should be 'match_source' to match database schema, fixing the original error: 'missing column [matchSource] in table [matches]'");
    }

    @Test
    void testValidationPatternFix() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        
        // Create test users
        User testUser1 = User.builder()
                .username("user1")
                .email("user1@test.com")
                .password("hashedPassword")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        User testUser2 = User.builder()
                .username("user2")
                .email("user2@test.com")
                .password("hashedPassword")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        // Test MUTUAL_LIKE which is used in sample data and MatchService
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("MUTUAL_LIKE")  // This was failing before the fix
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("matchSource")),
                "MUTUAL_LIKE should be valid after fixing the validation pattern");

        // Test all other valid sources
        String[] validSources = {"SWIPE", "ALGORITHM", "MANUAL", "SUPER_LIKE"};
        for (String source : validSources) {
            match.setMatchSource(source);
            violations = validator.validate(match);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("matchSource")),
                    "Match source " + source + " should be valid");
        }
    }

    @Test
    void testInvalidMatchSourceStillRejected() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        
        // Create test users
        User testUser1 = User.builder()
                .username("user1")
                .email("user1@test.com")
                .password("hashedPassword")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        User testUser2 = User.builder()
                .username("user2")
                .email("user2@test.com")
                .password("hashedPassword")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        // Test that invalid sources are still rejected
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("INVALID_SOURCE")
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("matchSource")),
                "Invalid match sources should still be rejected");
    }
}