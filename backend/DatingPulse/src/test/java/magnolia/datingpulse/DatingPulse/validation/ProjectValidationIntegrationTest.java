package magnolia.datingpulse.DatingPulse.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import magnolia.datingpulse.DatingPulse.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive validation test to verify that all major entities
 * have proper validation annotations and work correctly.
 */
class ProjectValidationIntegrationTest {

    private Validator validator;
    private User testUser1;
    private User testUser2;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser1 = User.builder()
                .username("testuser1")
                .email("user1@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testUser2 = User.builder()
                .username("testuser2")
                .email("user2@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testCompleteValidatedWorkflow() {
        // Test 1: Valid User creation
        Set<ConstraintViolation<User>> userViolations = validator.validate(testUser1);
        assertTrue(userViolations.isEmpty(), "Valid user should not have violations");

        // Test 2: Valid Like creation
        Like like = Like.builder()
                .user(testUser1)
                .likedUser(testUser2)
                .type(LikeType.LIKE)
                .likedAt(LocalDateTime.now())
                .build();
        
        Set<ConstraintViolation<Like>> likeViolations = validator.validate(like);
        assertTrue(likeViolations.isEmpty(), "Valid like should not have violations");

        // Test 3: Valid Match creation
        Match match = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("SWIPE")
                .isActive(true)
                .build();
        
        Set<ConstraintViolation<Match>> matchViolations = validator.validate(match);
        assertTrue(matchViolations.isEmpty(), "Valid match should not have violations");

        // Test 4: Valid Conversation creation
        Conversation conversation = Conversation.builder()
                .match(match)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();
        
        Set<ConstraintViolation<Conversation>> conversationViolations = validator.validate(conversation);
        assertTrue(conversationViolations.isEmpty(), "Valid conversation should not have violations");

        // Test 5: Valid Notification creation
        Notification notification = Notification.builder()
                .user(testUser2)
                .type("MATCH")
                .title("New Match!")
                .content("You have a new match")
                .priority("HIGH")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        Set<ConstraintViolation<Notification>> notificationViolations = validator.validate(notification);
        assertTrue(notificationViolations.isEmpty(), "Valid notification should not have violations");

        // Test 6: Valid Interest creation
        Interest interest = Interest.builder()
                .name("Photography")
                .build();
        
        Set<ConstraintViolation<Interest>> interestViolations = validator.validate(interest);
        assertTrue(interestViolations.isEmpty(), "Valid interest should not have violations");

        // Test 7: Valid BlockedUser creation
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(testUser1)
                .blocked(testUser2)
                .blockedAt(LocalDateTime.now())
                .build();
        
        Set<ConstraintViolation<BlockedUser>> blockedViolations = validator.validate(blockedUser);
        assertTrue(blockedViolations.isEmpty(), "Valid blocked user should not have violations");
    }

    @Test
    void testValidationConstraintsAreEnforced() {
        // Test invalid email
        User invalidUser = User.builder()
                .username("test")
                .email("invalid-email")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
        
        Set<ConstraintViolation<User>> violations = validator.validate(invalidUser);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("email") && 
                v.getMessage().contains("valid")),
                "Invalid email should be caught by validation");

        // Test invalid match source
        Match invalidMatch = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("INVALID_SOURCE")
                .isActive(true)
                .build();
        
        Set<ConstraintViolation<Match>> matchViolations2 = validator.validate(invalidMatch);
        assertTrue(matchViolations2.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("matchSource")),
                "Invalid match source should be caught by validation");

        // Test invalid notification type
        Notification invalidNotification = Notification.builder()
                .user(testUser1)
                .type("INVALID_TYPE")
                .title("Test")
                .content("Test content")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        Set<ConstraintViolation<Notification>> notificationViolations2 = validator.validate(invalidNotification);
        assertTrue(notificationViolations2.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type")),
                "Invalid notification type should be caught by validation");
    }

    @Test
    void testRequiredFieldsValidation() {
        // Test null required fields
        Like invalidLike = Like.builder()
                .user(null)
                .likedUser(null)
                .type(null)
                .likedAt(null)
                .build();
        
        Set<ConstraintViolation<Like>> violations = validator.validate(invalidLike);
        
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("user")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("likedUser")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("type")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("likedAt")));
        
        assertEquals(4, violations.size(), "Should have exactly 4 validation violations for null required fields");
    }

    @Test
    void testStringLengthValidation() {
        // Test long interest name
        Interest longNameInterest = Interest.builder()
                .name("A".repeat(51)) // Exceeds max length
                .build();
        
        Set<ConstraintViolation<Interest>> interestViolations = validator.validate(longNameInterest);
        assertTrue(interestViolations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("50")),
                "Long interest name should be caught by validation");

        // Test long notification title
        Notification longTitleNotification = Notification.builder()
                .user(testUser1)
                .type("LIKE")
                .title("A".repeat(101)) // Exceeds max length
                .content("Valid content")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        Set<ConstraintViolation<Notification>> notificationViolations3 = validator.validate(longTitleNotification);
        assertTrue(notificationViolations3.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("title") && 
                v.getMessage().contains("100")),
                "Long notification title should be caught by validation");
    }

    @Test
    void testPatternValidation() {
        // Test invalid phone number pattern
        User invalidPhoneUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .phone("123") // Invalid format
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
        
        Set<ConstraintViolation<User>> violations = validator.validate(invalidPhoneUser);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("phone") && 
                v.getMessage().contains("South African format")),
                "Invalid phone format should be caught by validation");
    }

    @Test
    void testNumberRangeValidation() {
        // Test user login attempts validation - Note: Check the exact constraint message
        User invalidLoginUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(15) // Exceeds max value
                .build();
        
        Set<ConstraintViolation<User>> violations = validator.validate(invalidLoginUser);
        // Note: Check if the message contains "login attempt" or "Maximum"
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("loginAttempt")),
                "Excessive login attempts should be caught by validation");
    }
}