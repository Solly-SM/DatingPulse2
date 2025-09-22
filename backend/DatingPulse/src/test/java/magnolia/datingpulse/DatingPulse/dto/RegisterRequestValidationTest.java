package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive validation tests for RegisterRequest DTO
 * Testing registration input validation and security requirements
 */
class RegisterRequestValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidRegisterRequest() {
        RegisterRequest request = RegisterRequest.builder()
                .username("john_doe")
                .email("john.doe@example.com")
                .phone("0821234567")
                .build();

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Valid register request should not have violations");
    }

    @Test
    void testUsernameValidation() {
        // Test null username
        RegisterRequest request = createValidRequest();
        request.setUsername(null);
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("required")));

        // Test blank username
        request.setUsername("   ");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("required")));

        // Test too short username
        request.setUsername("ab");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("between 3 and 50")));

        // Test too long username
        request.setUsername("a".repeat(51));
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("between 3 and 50")));

        // Test invalid characters in username
        request.setUsername("user@name");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("can only contain letters, numbers, and underscores")));

        request.setUsername("user-name");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("can only contain letters, numbers, and underscores")));

        // Test valid usernames
        String[] validUsernames = {"user123", "User_Name", "test_user_123", "MyUsername"};
        for (String username : validUsernames) {
            request.setUsername(username);
            violations = validator.validate(request);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("username")),
                    "Username '" + username + "' should be valid");
        }
    }

    @Test
    void testEmailValidation() {
        RegisterRequest request = createValidRequest();

        // Test null email
        request.setEmail(null);
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("email") && 
                v.getMessage().contains("required")));

        // Test blank email
        request.setEmail("   ");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("email") && 
                v.getMessage().contains("required")));

        // Test invalid email formats
        String[] invalidEmails = {"invalid", "invalid@", "@invalid.com", "invalid.com", "invalid@.com"};
        for (String email : invalidEmails) {
            request.setEmail(email);
            violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("email") && 
                    v.getMessage().contains("should be valid")),
                    "Email '" + email + "' should be invalid");
        }

        // Test too long email
        String longEmail = "a".repeat(250) + "@test.com";
        request.setEmail(longEmail);
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("email") && 
                v.getMessage().contains("not exceed 255")));

        // Test valid emails
        String[] validEmails = {"test@example.com", "user.name@domain.co.za", "test123@test-domain.com"};
        for (String email : validEmails) {
            request.setEmail(email);
            violations = validator.validate(request);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("email")),
                    "Email '" + email + "' should be valid");
        }
    }

    @Test
    void testPhoneValidation() {
        RegisterRequest request = createValidRequest();

        // Test null phone (should be valid as it's optional)
        request.setPhone(null);
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                "Null phone should be valid (optional field)");

        // Test empty phone (should be valid as it's optional)
        request.setPhone("");
        violations = validator.validate(request);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                "Empty phone should be valid (optional field)");

        // Test invalid phone formats
        String[] invalidPhones = {"123456789", "081234567", "08123456789", "27821234567", "+271234567"};
        for (String phone : invalidPhones) {
            request.setPhone(phone);
            violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("phone") && 
                    v.getMessage().contains("South African format")),
                    "Phone '" + phone + "' should be invalid");
        }

        // Test valid phone formats
        String[] validPhones = {"0821234567", "0731234567", "0841234567", "+27821234567", "+27731234567"};
        for (String phone : validPhones) {
            request.setPhone(phone);
            violations = validator.validate(request);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                    "Phone '" + phone + "' should be valid");
        }
    }

    @Test
    void testCompleteValidationWorkflow() {
        // Test completely invalid request
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .username("ab")  // too short
                .email("invalid-email")  // invalid format
                  // too short and weak
                .phone("123")  // invalid format
                .build();

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(invalidRequest);
        assertFalse(violations.isEmpty(), "Invalid request should have violations");
        
        // Should have violations for all fields
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phone")));

        // Test minimal valid request (without optional phone)
        RegisterRequest minimalRequest = RegisterRequest.builder()
                .username("testuser")
                .email("test@example.com")
                
                .build();

        violations = validator.validate(minimalRequest);
        assertTrue(violations.isEmpty(), "Minimal valid request should not have violations");

        // Test complete valid request
        RegisterRequest completeRequest = RegisterRequest.builder()
                .username("test_user_123")
                .email("test.user@example.co.za")
                
                .phone("+27821234567")
                .build();

        violations = validator.validate(completeRequest);
        assertTrue(violations.isEmpty(), "Complete valid request should not have violations");
    }

    private RegisterRequest createValidRequest() {
        return RegisterRequest.builder()
                .username("testuser")
                .email("test@example.com")
                
                .phone("0821234567")
                .build();
    }
}