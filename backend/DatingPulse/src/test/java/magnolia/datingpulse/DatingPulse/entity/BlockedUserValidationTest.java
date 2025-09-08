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

class BlockedUserValidationTest {

    private Validator validator;
    private User testBlocker;
    private User testBlocked;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testBlocker = User.builder()
                .username("blocker")
                .email("blocker@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testBlocked = User.builder()
                .username("blocked")
                .email("blocked@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidBlockedUser() {
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(testBlocker)
                .blocked(testBlocked)
                .blockedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        assertTrue(violations.isEmpty(), "Valid blocked user should not have violations");
    }

    @Test
    void testNullBlocker() {
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(null)
                .blocked(testBlocked)
                .blockedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("blocker") && 
                v.getMessage().contains("required")),
                "Null blocker should be invalid");
    }

    @Test
    void testNullBlocked() {
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(testBlocker)
                .blocked(null)
                .blockedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("blocked") && 
                v.getMessage().contains("required")),
                "Null blocked user should be invalid");
    }

    @Test
    void testNullBlockedAt() {
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(testBlocker)
                .blocked(testBlocked)
                .blockedAt(null)
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("blockedAt") && 
                v.getMessage().contains("required")),
                "Null blockedAt timestamp should be invalid");
    }

    @Test
    void testValidTimestamps() {
        // Test current time
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(testBlocker)
                .blocked(testBlocked)
                .blockedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("blockedAt")),
                "Current timestamp should be valid");

        // Test past time
        blockedUser = BlockedUser.builder()
                .blocker(testBlocker)
                .blocked(testBlocked)
                .blockedAt(LocalDateTime.now().minusHours(1))
                .build();

        violations = validator.validate(blockedUser);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("blockedAt")),
                "Past timestamp should be valid");
    }

    @Test
    void testCompleteBlockingWorkflow() {
        // Test a complete blocking scenario with all required fields
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(testBlocker)
                .blocked(testBlocked)
                .blockedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        
        // Should have no violations
        assertTrue(violations.isEmpty(), "Complete blocking workflow should be valid");
        
        // Verify all required fields are present
        assertNotNull(blockedUser.getBlocker(), "Blocker should be set");
        assertNotNull(blockedUser.getBlocked(), "Blocked user should be set");
        assertNotNull(blockedUser.getBlockedAt(), "Blocked timestamp should be set");
    }

    @Test
    void testDifferentUsers() {
        // Ensure blocker and blocked are different users (business logic validation)
        // This tests that the validation doesn't prevent different users from being used
        assertNotEquals(testBlocker.getUsername(), testBlocked.getUsername(), 
                "Test users should be different");
        assertNotEquals(testBlocker.getEmail(), testBlocked.getEmail(), 
                "Test user emails should be different");

        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(testBlocker)
                .blocked(testBlocked)
                .blockedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        assertTrue(violations.isEmpty(), "Blocking different users should be valid");
    }

    @Test
    void testAllRequiredFieldsValidation() {
        // Test with all required fields missing
        BlockedUser blockedUser = BlockedUser.builder()
                .build();

        Set<ConstraintViolation<BlockedUser>> violations = validator.validate(blockedUser);
        
        // Should have violations for all required fields
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("blocker")),
                "Should have violation for missing blocker");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("blocked")),
                "Should have violation for missing blocked user");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("blockedAt")),
                "Should have violation for missing blockedAt timestamp");
        
        // Verify we have exactly 3 violations (one for each required field)
        assertEquals(3, violations.size(), "Should have exactly 3 validation violations");
    }
}