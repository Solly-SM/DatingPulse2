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

class NotificationValidationTest {

    private Validator validator;
    private User testUser;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidNotification() {
        Notification notification = Notification.builder()
                .user(testUser)
                .type("LIKE")
                .relatedID(123L)
                .title("New Like")
                .content("Someone liked your profile!")
                .priority("MEDIUM")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
        assertTrue(violations.isEmpty(), "Valid notification should not have violations");
    }

    @Test
    void testValidNotificationTypes() {
        String[] validTypes = {"LIKE", "MATCH", "MESSAGE", "SYSTEM", "VERIFICATION", "REPORT", "ADMIN"};
        
        for (String type : validTypes) {
            Notification notification = createNotificationWithType(type);
            Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("type")),
                    "Notification type " + type + " should be valid");
        }
    }

    @Test
    void testInvalidNotificationType() {
        Notification notification = createNotificationWithType("INVALID");
        Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("must be LIKE")),
                "Invalid notification type should be rejected");
    }

    @Test
    void testValidPriorities() {
        String[] validPriorities = {"LOW", "MEDIUM", "HIGH", "CRITICAL"};
        
        for (String priority : validPriorities) {
            Notification notification = createNotificationWithPriority(priority);
            Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("priority")),
                    "Priority " + priority + " should be valid");
        }
    }

    @Test
    void testInvalidPriority() {
        Notification notification = createNotificationWithPriority("INVALID");
        Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("priority") && 
                v.getMessage().contains("must be LOW")),
                "Invalid priority should be rejected");
    }

    @Test
    void testTitleValidation() {
        // Valid title
        Notification notification = createNotificationWithTitle("Test Title");
        Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("title")));

        // Title too long
        String longTitle = "A".repeat(101);
        notification = createNotificationWithTitle(longTitle);
        violations = validator.validate(notification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("title") && 
                v.getMessage().contains("100 characters")),
                "Title over 100 characters should be invalid");

        // Null title
        notification = createNotificationWithTitle(null);
        violations = validator.validate(notification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("title") && 
                v.getMessage().contains("required")),
                "Null title should be invalid");
    }

    @Test
    void testContentValidation() {
        // Valid content
        Notification notification = createNotificationWithContent("Test content");
        Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("content")));

        // Content too long
        String longContent = "A".repeat(1001);
        notification = createNotificationWithContent(longContent);
        violations = validator.validate(notification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("content") && 
                v.getMessage().contains("1000 characters")),
                "Content over 1000 characters should be invalid");

        // Null content
        notification = createNotificationWithContent(null);
        violations = validator.validate(notification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("content") && 
                v.getMessage().contains("required")),
                "Null content should be invalid");
    }

    @Test
    void testRelatedIDValidation() {
        // Valid positive related ID
        Notification notification = createNotificationWithRelatedID(123L);
        Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("relatedID")));

        // Invalid negative related ID
        notification = createNotificationWithRelatedID(-1L);
        violations = validator.validate(notification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("relatedID") && 
                v.getMessage().contains("positive")),
                "Negative related ID should be invalid");

        // Null related ID should be valid (optional)
        notification = createNotificationWithRelatedID(null);
        violations = validator.validate(notification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("relatedID")));
    }

    @Test
    void testRequiredFields() {
        Notification notification = Notification.builder()
                .user(null)
                .type(null)
                .title(null)
                .content(null)
                .isRead(null)
                .createdAt(null)
                .build();

        Set<ConstraintViolation<Notification>> violations = validator.validate(notification);
        
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("user")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("type")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("title")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("content")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("isRead")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("createdAt")));
    }

    private Notification createNotificationWithType(String type) {
        return Notification.builder()
                .user(testUser)
                .type(type)
                .title("Test Title")
                .content("Test content")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Notification createNotificationWithPriority(String priority) {
        return Notification.builder()
                .user(testUser)
                .type("LIKE")
                .title("Test Title")
                .content("Test content")
                .priority(priority)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Notification createNotificationWithTitle(String title) {
        return Notification.builder()
                .user(testUser)
                .type("LIKE")
                .title(title)
                .content("Test content")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Notification createNotificationWithContent(String content) {
        return Notification.builder()
                .user(testUser)
                .type("LIKE")
                .title("Test Title")
                .content(content)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Notification createNotificationWithRelatedID(Long relatedID) {
        return Notification.builder()
                .user(testUser)
                .type("LIKE")
                .relatedID(relatedID)
                .title("Test Title")
                .content("Test content")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
}