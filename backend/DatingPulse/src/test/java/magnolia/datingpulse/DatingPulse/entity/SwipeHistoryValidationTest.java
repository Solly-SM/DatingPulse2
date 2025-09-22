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

class SwipeHistoryValidationTest {

    private Validator validator;
    private User testUser;
    private User testTargetUser;
    private Device testDevice;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .username("swiper")
                .email("swiper@test.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testTargetUser = User.builder()
                .username("target")
                .email("target@test.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        testDevice = Device.builder()
                .user(testUser)
                .type("ANDROID")
                .pushToken("test-push-token-123")
                .deviceInfo("Android 14, Samsung Galaxy S24")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testValidSwipeHistory() {
        SwipeHistory swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
        assertTrue(violations.isEmpty(), "Valid swipe history should not have violations");
    }

    @Test
    void testValidSwipeTypes() {
        String[] validSwipeTypes = {"LIKE", "DISLIKE", "SUPER_LIKE", "PASS"};
        
        for (String swipeType : validSwipeTypes) {
            SwipeHistory swipeHistory = createSwipeHistoryWithType(swipeType);
            Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("swipeType")),
                    "Swipe type '" + swipeType + "' should be valid");
        }
    }

    @Test
    void testInvalidSwipeType() {
        String[] invalidSwipeTypes = {"LOVE", "HATE", "MAYBE", "like", "dislike", "", "   ", null};
        
        for (String swipeType : invalidSwipeTypes) {
            SwipeHistory swipeHistory = createSwipeHistoryWithType(swipeType);
            Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("swipeType")),
                    "Swipe type '" + swipeType + "' should be invalid");
        }
    }

    @Test
    void testAppVersionValidation() {
        // Valid app versions
        String[] validVersions = {"1.0.0", "2.1.5", "1.0.0-beta", "3.2.1", "v1.0", "2023.1"};
        
        for (String version : validVersions) {
            SwipeHistory swipeHistory = createSwipeHistoryWithAppVersion(version);
            Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("appVersion")),
                    "App version '" + version + "' should be valid");
        }

        // Version at maximum length
        String maxLengthVersion = "A".repeat(20);
        SwipeHistory swipeHistory = createSwipeHistoryWithAppVersion(maxLengthVersion);
        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("appVersion")),
                "20-character app version should be valid");

        // Version too long
        String tooLongVersion = "A".repeat(21);
        swipeHistory = createSwipeHistoryWithAppVersion(tooLongVersion);
        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("appVersion") && 
                v.getMessage().contains("20 characters")),
                "App version over 20 characters should be invalid");

        // Blank version
        swipeHistory = createSwipeHistoryWithAppVersion("   ");
        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("appVersion") && 
                v.getMessage().contains("required")),
                "Blank app version should be invalid");

        // Null version
        swipeHistory = createSwipeHistoryWithAppVersion(null);
        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("appVersion") && 
                v.getMessage().contains("required")),
                "Null app version should be invalid");
    }

    @Test
    void testRewindStatus() {
        // Test false rewind status
        SwipeHistory swipeHistory = createSwipeHistoryWithRewindStatus(false);
        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("isRewind")),
                "False rewind status should be valid");

        // Test true rewind status
        swipeHistory = createSwipeHistoryWithRewindStatus(true);
        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("isRewind")),
                "True rewind status should be valid");

        // Test null rewind status
        swipeHistory = createSwipeHistoryWithRewindStatus(null);
        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("isRewind") && 
                v.getMessage().contains("required")),
                "Null rewind status should be invalid");
    }

    @Test
    void testRequiredFields() {
        // Test null user
        SwipeHistory swipeHistory = SwipeHistory.builder()
                .user(null)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user") && 
                v.getMessage().contains("required")),
                "Null user should be invalid");

        // Test null target user
        swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(null)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("targetUser") && 
                v.getMessage().contains("required")),
                "Null target user should be invalid");

        // Test null device
        swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(null)
                .appVersion("1.0.0")
                .build();

        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("device") && 
                v.getMessage().contains("required")),
                "Null device should be invalid");

        // Test null createdAt
        swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(null)
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("createdAt") && 
                v.getMessage().contains("required")),
                "Null createdAt should be invalid");
    }

    @Test
    void testSwipeWorkflows() {
        // Test regular like
        SwipeHistory likeSwipe = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(likeSwipe);
        assertTrue(violations.isEmpty(), "Like swipe should be valid");

        // Test super like
        SwipeHistory superLikeSwipe = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("SUPER_LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        violations = validator.validate(superLikeSwipe);
        assertTrue(violations.isEmpty(), "Super like swipe should be valid");

        // Test rewind swipe
        SwipeHistory rewindSwipe = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(true)
                .createdAt(LocalDateTime.now().minusMinutes(5))
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        violations = validator.validate(rewindSwipe);
        assertTrue(violations.isEmpty(), "Rewind swipe should be valid");
    }

    @Test
    void testTimestamps() {
        // Test current time
        SwipeHistory swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("createdAt")),
                "Current timestamp should be valid");

        // Test past time
        swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("DISLIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now().minusHours(1))
                .device(testDevice)
                .appVersion("1.0.0")
                .build();

        violations = validator.validate(swipeHistory);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("createdAt")),
                "Past timestamp should be valid");
    }

    @Test
    void testOptionalSession() {
        // Test swipe history without session (should be valid as session is optional)
        SwipeHistory swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("PASS")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .session(null)
                .build();

        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
        assertTrue(violations.isEmpty(), "Swipe history without session should be valid");
    }

    @Test
    void testCompleteSwipeWorkflow() {
        // Test a complete swipe scenario with all fields
        SwipeHistory swipeHistory = SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.2.5")
                .build();

        Set<ConstraintViolation<SwipeHistory>> violations = validator.validate(swipeHistory);
        assertTrue(violations.isEmpty(), "Complete swipe workflow should be valid");
        
        // Verify all required fields are present
        assertNotNull(swipeHistory.getUser(), "User should be set");
        assertNotNull(swipeHistory.getTargetUser(), "Target user should be set");
        assertNotNull(swipeHistory.getSwipeType(), "Swipe type should be set");
        assertNotNull(swipeHistory.getIsRewind(), "Rewind status should be set");
        assertNotNull(swipeHistory.getCreatedAt(), "Created timestamp should be set");
        assertNotNull(swipeHistory.getDevice(), "Device should be set");
        assertNotNull(swipeHistory.getAppVersion(), "App version should be set");
    }

    private SwipeHistory createSwipeHistoryWithType(String swipeType) {
        return SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType(swipeType)
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();
    }

    private SwipeHistory createSwipeHistoryWithAppVersion(String appVersion) {
        return SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(false)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion(appVersion)
                .build();
    }

    private SwipeHistory createSwipeHistoryWithRewindStatus(Boolean isRewind) {
        return SwipeHistory.builder()
                .user(testUser)
                .targetUser(testTargetUser)
                .swipeType("LIKE")
                .isRewind(isRewind)
                .createdAt(LocalDateTime.now())
                .device(testDevice)
                .appVersion("1.0.0")
                .build();
    }
}