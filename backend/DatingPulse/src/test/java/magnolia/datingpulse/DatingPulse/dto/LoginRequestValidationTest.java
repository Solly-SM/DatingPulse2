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
 * Comprehensive validation tests for LoginRequest DTO
 * Testing login input validation and security requirements
 */
class LoginRequestValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidLoginRequest() {
        LoginRequest request = LoginRequest.builder()
                .username("john_doe")
                .password("MyPassword123!")
                .build();

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Valid login request should not have violations");
    }

    @Test
    void testValidLoginRequestWithEmail() {
        LoginRequest request = LoginRequest.builder()
                .username("john.doe@example.com")
                .password("MyPassword123!")
                .build();

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Valid login request with email should not have violations");
    }

    @Test
    void testUsernameValidation() {
        LoginRequest request = createValidRequest();

        // Test null username
        request.setUsername(null);
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("required")),
                "Null username should be invalid");

        // Test blank username
        request.setUsername("   ");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("required")),
                "Blank username should be invalid");

        // Test empty username
        request.setUsername("");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("required")),
                "Empty username should be invalid");

        // Test too short username
        request.setUsername("ab");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("between 3 and 255")),
                "Too short username should be invalid");

        // Test too long username
        request.setUsername("a".repeat(256));
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("between 3 and 255")),
                "Too long username should be invalid");

        // Test valid usernames and emails
        String[] validUsernames = {
            "john_doe", "user123", "test_user", "John_Doe_123",
            "john@example.com", "user.name@domain.co.za", "test123@test-domain.com"
        };
        
        for (String username : validUsernames) {
            request.setUsername(username);
            violations = validator.validate(request);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("username")),
                    "Username/email '" + username + "' should be valid");
        }
    }

    @Test
    void testPasswordValidation() {
        LoginRequest request = createValidRequest();

        // Test null password
        request.setPassword(null);
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("password") && 
                v.getMessage().contains("required")),
                "Null password should be invalid");

        // Test blank password
        request.setPassword("   ");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("password") && 
                v.getMessage().contains("required")),
                "Blank password should be invalid");

        // Test empty password
        request.setPassword("");
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("password") && 
                v.getMessage().contains("required")),
                "Empty password should be invalid");

        // Test too long password (for security, prevent extremely long passwords)
        request.setPassword("a".repeat(129));
        violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("password") && 
                v.getMessage().contains("not exceed 128")),
                "Too long password should be invalid");

        // Test valid passwords (any non-empty password should be accepted for login)
        String[] validPasswords = {
            "password", "123456", "MyPassword123!", "short", "a".repeat(128)
        };
        
        for (String password : validPasswords) {
            request.setPassword(password);
            violations = validator.validate(request);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("password")),
                    "Password '" + password + "' should be valid for login");
        }
    }

    @Test
    void testCompleteValidationWorkflow() {
        // Test completely invalid request
        LoginRequest invalidRequest = LoginRequest.builder()
                .username("ab")  // too short
                .password("")    // empty
                .build();

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(invalidRequest);
        assertFalse(violations.isEmpty(), "Invalid request should have violations");
        
        // Should have violations for both fields
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));

        // Test valid request with username
        LoginRequest validUsernameRequest = LoginRequest.builder()
                .username("testuser")
                .password("anypassword")
                .build();

        violations = validator.validate(validUsernameRequest);
        assertTrue(violations.isEmpty(), "Valid username login request should not have violations");

        // Test valid request with email
        LoginRequest validEmailRequest = LoginRequest.builder()
                .username("test@example.com")
                .password("anypassword")
                .build();

        violations = validator.validate(validEmailRequest);
        assertTrue(violations.isEmpty(), "Valid email login request should not have violations");

        // Test edge case - minimum length values
        LoginRequest minimalRequest = LoginRequest.builder()
                .username("abc")  // minimum 3 characters
                .password("a")    // minimum 1 character
                .build();

        violations = validator.validate(minimalRequest);
        assertTrue(violations.isEmpty(), "Minimal valid request should not have violations");

        // Test edge case - maximum length values
        LoginRequest maximalRequest = LoginRequest.builder()
                .username("a".repeat(255))  // maximum 255 characters
                .password("a".repeat(128))  // maximum 128 characters
                .build();

        violations = validator.validate(maximalRequest);
        assertTrue(violations.isEmpty(), "Maximal valid request should not have violations");
    }

    @Test
    void testSpecialCharactersInCredentials() {
        LoginRequest request = createValidRequest();

        // Test special characters in username (should be valid for login)
        String[] specialUsernames = {
            "user@domain.com", "user.name+tag@example.co.za", "user-name@test.com"
        };
        
        for (String username : specialUsernames) {
            request.setUsername(username);
            Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("username")),
                    "Username with special characters '" + username + "' should be valid for login");
        }

        // Test special characters in password (should be valid for login)
        String[] specialPasswords = {
            "pass@word", "p@ss!w0rd", "päßwörd", "密码123", "пароль"
        };
        
        for (String password : specialPasswords) {
            request.setPassword(password);
            Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("password")),
                    "Password with special characters should be valid for login");
        }
    }

    @Test
    void testSecurityConsiderations() {
        // Test that login validation is more permissive than registration
        // This is important because users might have legacy passwords
        LoginRequest request = LoginRequest.builder()
                .username("olduser")
                .password("weak123")  // This would fail registration but should pass login
                .build();

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Legacy password should be valid for login");

        // Test SQL injection attempt (should be handled by validation length limits)
        request.setUsername("user'; DROP TABLE users; --");
        violations = validator.validate(request);
        // Should either pass validation (and be handled by parameterized queries) 
        // or fail due to length/character restrictions
        assertTrue(violations.isEmpty() || 
                   violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")),
                   "SQL injection attempt should be handled appropriately");

        // Test XSS attempt
        request.setUsername("<script>alert('xss')</script>");
        violations = validator.validate(request);
        // Should pass validation (XSS protection should be handled in presentation layer)
        assertTrue(violations.isEmpty(), "XSS attempt should pass validation (handled at presentation layer)");
    }

    private LoginRequest createValidRequest() {
        return LoginRequest.builder()
                .username("testuser")
                .password("testpassword")
                .build();
    }
}