package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class MatchValidationTest {

    private Validator validator;
    private User testUser1;
    private User testUser2;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser1 = User.builder()
                .username("user1")
                .email("user1@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testUser2 = User.builder()
                .username("user2")
                .email("user2@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidMatch() {
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("SWIPE")
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.isEmpty(), "Valid match should not have violations");
    }

    @Test
    void testValidMatchSources() {
        String[] validSources = {"SWIPE", "ALGORITHM", "MANUAL", "SUPER_LIKE", "MUTUAL_LIKE"};
        
        for (String source : validSources) {
            Match match = Match.builder()
                    .userOne(testUser1)
                    .userTwo(testUser2)
                    .matchedAt(LocalDateTime.now())
                    .matchSource(source)
                    .isActive(true)
                    .build();

            Set<ConstraintViolation<Match>> violations = validator.validate(match);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("matchSource")),
                    "Match source " + source + " should be valid");
        }
    }

    @Test
    void testInvalidMatchSource() {
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("INVALID")
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("matchSource") && 
                v.getMessage().contains("must be SWIPE, ALGORITHM, MANUAL, SUPER_LIKE, or MUTUAL_LIKE")),
                "Invalid match source should be rejected");
    }

    @Test
    void testNullUserOne() {
        Match match = Match.builder()
                .userOne(null)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("SWIPE")
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userOne") && 
                v.getMessage().contains("required")),
                "Null user one should be invalid");
    }

    @Test
    void testNullUserTwo() {
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(null)
                .matchedAt(LocalDateTime.now())
                .matchSource("SWIPE")
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userTwo") && 
                v.getMessage().contains("required")),
                "Null user two should be invalid");
    }

    @Test
    void testNullMatchedAt() {
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(null)
                .matchSource("SWIPE")
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("matchedAt") && 
                v.getMessage().contains("required")),
                "Null matched timestamp should be invalid");
    }

    @Test
    void testBlankMatchSource() {
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("")
                .isActive(true)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("matchSource")),
                "Blank match source should be invalid");
    }

    @Test
    void testNullIsActive() {
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("SWIPE")
                .isActive(null)
                .build();

        Set<ConstraintViolation<Match>> violations = validator.validate(match);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("isActive") && 
                v.getMessage().contains("required")),
                "Null active status should be invalid");
    }
}