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

class DeviceValidationTest {

    private Validator validator;
    private User testUser;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidDevice() {
        Device device = Device.builder()
                .user(testUser)
                .type("ANDROID")
                .pushToken("test-push-token-123")
                .deviceInfo("Android 14, Samsung Galaxy S24")
                .createdAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Device>> violations = validator.validate(device);
        assertTrue(violations.isEmpty(), "Valid device should not have violations");
    }

    @Test
    void testValidDeviceTypes() {
        String[] validTypes = {"ANDROID", "IOS", "WEB", "DESKTOP"};
        
        for (String type : validTypes) {
            Device device = createDeviceWithType(type);
            Set<ConstraintViolation<Device>> violations = validator.validate(device);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("type")),
                    "Device type should be valid: " + type);
        }
    }

    @Test
    void testInvalidDeviceTypes() {
        String[] invalidTypes = {"", "mobile", "TABLET", "invalid", "123"};
        
        for (String type : invalidTypes) {
            Device device = createDeviceWithType(type);
            Set<ConstraintViolation<Device>> violations = validator.validate(device);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("type")),
                    "Device type should be invalid: " + type);
        }
    }

    @Test
    void testPushTokenValidation() {
        // Valid push token
        Device device = createDeviceWithPushToken("valid-token");
        Set<ConstraintViolation<Device>> violations = validator.validate(device);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("pushToken")));

        // Push token too long (over 255 characters)
        String longToken = "A".repeat(256);
        device = createDeviceWithPushToken(longToken);
        violations = validator.validate(device);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("pushToken") && 
                v.getMessage().contains("255 characters")),
                "Push token over 255 characters should be invalid");

        // Null push token should be valid (optional field)
        device = createDeviceWithPushToken(null);
        violations = validator.validate(device);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("pushToken")));
    }

    @Test
    void testDeviceInfoValidation() {
        // Valid device info
        Device device = createDeviceWithDeviceInfo("Android 14, Chrome 120");
        Set<ConstraintViolation<Device>> violations = validator.validate(device);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("deviceInfo")));

        // Device info too long (over 500 characters)
        String longInfo = "A".repeat(501);
        device = createDeviceWithDeviceInfo(longInfo);
        violations = validator.validate(device);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("deviceInfo") && 
                v.getMessage().contains("500 characters")),
                "Device info over 500 characters should be invalid");

        // Null device info should be valid (optional field)
        device = createDeviceWithDeviceInfo(null);
        violations = validator.validate(device);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("deviceInfo")));
    }

    @Test
    void testRequiredFields() {
        Device device = Device.builder()
                .user(null)
                .type(null)
                .createdAt(null)
                .build();

        Set<ConstraintViolation<Device>> violations = validator.validate(device);
        
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("user")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("type")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("createdAt")));
    }

    private Device createDeviceWithType(String type) {
        return Device.builder()
                .user(testUser)
                .type(type)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Device createDeviceWithPushToken(String pushToken) {
        return Device.builder()
                .user(testUser)
                .type("ANDROID")
                .pushToken(pushToken)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Device createDeviceWithDeviceInfo(String deviceInfo) {
        return Device.builder()
                .user(testUser)
                .type("ANDROID")
                .deviceInfo(deviceInfo)
                .createdAt(LocalDateTime.now())
                .build();
    }
}