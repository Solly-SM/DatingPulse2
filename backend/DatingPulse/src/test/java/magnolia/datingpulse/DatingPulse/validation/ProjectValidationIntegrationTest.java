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

    @Test
    void testDTOValidationIntegration() {
        // Test RegisterRequest with comprehensive validation
        magnolia.datingpulse.DatingPulse.dto.RegisterRequest registerRequest = 
            magnolia.datingpulse.DatingPulse.dto.RegisterRequest.builder()
                .username("new_user")
                .email("new.user@example.com")
                .password("SecurePass123!")
                .phone("0821234567")
                .build();

        Set<ConstraintViolation<magnolia.datingpulse.DatingPulse.dto.RegisterRequest>> registerViolations = 
            validator.validate(registerRequest);
        assertTrue(registerViolations.isEmpty(), "Valid registration request should not have violations");

        // Test LoginRequest validation
        magnolia.datingpulse.DatingPulse.dto.LoginRequest loginRequest = 
            magnolia.datingpulse.DatingPulse.dto.LoginRequest.builder()
                .username("testuser")
                .password("anypassword")
                .build();

        Set<ConstraintViolation<magnolia.datingpulse.DatingPulse.dto.LoginRequest>> loginViolations = 
            validator.validate(loginRequest);
        assertTrue(loginViolations.isEmpty(), "Valid login request should not have violations");

        // Test UserDTO validation
        magnolia.datingpulse.DatingPulse.dto.UserDTO userDTO = new magnolia.datingpulse.DatingPulse.dto.UserDTO();
        userDTO.setUsername("dto_user");
        userDTO.setEmail("dto.user@example.com");
        userDTO.setPhone("0731234567");

        Set<ConstraintViolation<magnolia.datingpulse.DatingPulse.dto.UserDTO>> userDtoViolations = 
            validator.validate(userDTO);
        assertTrue(userDtoViolations.isEmpty(), "Valid user DTO should not have violations");
    }

    @Test
    void testCrossEntityValidationWorkflow() {
        // Test a complete workflow that involves multiple entities and DTOs
        
        // 1. Start with valid user registration (DTO validation)
        magnolia.datingpulse.DatingPulse.dto.RegisterRequest request = 
            magnolia.datingpulse.DatingPulse.dto.RegisterRequest.builder()
                .username("workflow_user")
                .email("workflow@example.com")
                .password("WorkflowPass123!")
                .phone("0821234567")
                .build();

        Set<ConstraintViolation<magnolia.datingpulse.DatingPulse.dto.RegisterRequest>> requestViolations = 
            validator.validate(request);
        assertTrue(requestViolations.isEmpty(), "Registration request should be valid");

        // 2. Create user entity from DTO data
        User workflowUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") // Valid BCrypt hash
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        Set<ConstraintViolation<User>> userViolations = validator.validate(workflowUser);
        assertTrue(userViolations.isEmpty(), "User entity should be valid");

        // 3. Create admin for workflow management
        magnolia.datingpulse.DatingPulse.dto.AdminDTO adminDTO = new magnolia.datingpulse.DatingPulse.dto.AdminDTO();
        adminDTO.setUserID(1L);
        adminDTO.setRole("ADMIN");

        Set<ConstraintViolation<magnolia.datingpulse.DatingPulse.dto.AdminDTO>> adminViolations = 
            validator.validate(adminDTO);
        assertTrue(adminViolations.isEmpty(), "Admin DTO should be valid");

        // 4. Create match scenario
        magnolia.datingpulse.DatingPulse.dto.MatchDTO matchDTO = new magnolia.datingpulse.DatingPulse.dto.MatchDTO();
        matchDTO.setUserOneID(1L);
        matchDTO.setUserTwoID(2L);
        matchDTO.setMatchSource("MUTUAL_LIKE");

        Set<ConstraintViolation<magnolia.datingpulse.DatingPulse.dto.MatchDTO>> matchViolations = 
            validator.validate(matchDTO);
        assertTrue(matchViolations.isEmpty(), "Match DTO should be valid");

        // 5. Verify all components work together
        assertTrue(requestViolations.isEmpty() && userViolations.isEmpty() && 
                   adminViolations.isEmpty() && matchViolations.isEmpty(),
                   "Complete workflow should have no validation violations");
    }

    @Test
    void testValidationErrorHandlingWorkflow() {
        // Test that validation properly catches errors across different entity types
        
        // Invalid registration request
        magnolia.datingpulse.DatingPulse.dto.RegisterRequest invalidRequest = 
            magnolia.datingpulse.DatingPulse.dto.RegisterRequest.builder()
                .username("ab")  // too short
                .email("invalid-email")  // invalid format
                .password("weak")  // doesn't meet complexity requirements
                .phone("123")  // invalid format
                .build();

        Set<ConstraintViolation<magnolia.datingpulse.DatingPulse.dto.RegisterRequest>> requestViolations = 
            validator.validate(invalidRequest);
        assertFalse(requestViolations.isEmpty(), "Invalid registration should have violations");
        assertTrue(requestViolations.size() >= 4, "Should have violations for all invalid fields");

        // Invalid user entity
        User invalidUser = User.builder()
                .username("ab")  // too short
                .email("invalid")  // invalid format
                .password("")  // blank
                .role("INVALID_ROLE")  // invalid role
                .status("INVALID_STATUS")  // invalid status
                .loginAttempt(-1)  // negative
                .build();

        Set<ConstraintViolation<User>> userViolations = validator.validate(invalidUser);
        assertFalse(userViolations.isEmpty(), "Invalid user should have violations");
        assertTrue(userViolations.size() >= 6, "Should have violations for all invalid fields");

        // Verify that validation catches all the expected issues
        assertTrue(requestViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
        assertTrue(requestViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        assertTrue(requestViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
        assertTrue(requestViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phone")));
    }
}