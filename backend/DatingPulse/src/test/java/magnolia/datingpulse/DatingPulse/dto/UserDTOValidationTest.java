package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive validation tests for UserDTO
 * Testing user data transfer object validation
 */
class UserDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidUserDTO() {
        UserDTO userDTO = createValidUserDTO();

        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
        assertTrue(violations.isEmpty(), "Valid UserDTO should not have violations");
    }

    @Test
    void testUsernameValidation() {
        UserDTO userDTO = createValidUserDTO();

        // Test null username
        userDTO.setUsername(null);
        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("required")),
                "Null username should be invalid");

        // Test blank username
        userDTO.setUsername("   ");
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("required")),
                "Blank username should be invalid");

        // Test too short username
        userDTO.setUsername("ab");
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("between 3 and 50")),
                "Too short username should be invalid");

        // Test too long username
        userDTO.setUsername("a".repeat(51));
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("username") && 
                v.getMessage().contains("between 3 and 50")),
                "Too long username should be invalid");

        // Test invalid characters
        String[] invalidUsernames = {"user@name", "user-name", "user name", "user#name", "user!name"};
        for (String username : invalidUsernames) {
            userDTO.setUsername(username);
            violations = validator.validate(userDTO);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("username") && 
                    v.getMessage().contains("can only contain letters, numbers, and underscores")),
                    "Username '" + username + "' should be invalid due to special characters");
        }

        // Test valid usernames
        String[] validUsernames = {"user123", "User_Name", "test_user_123", "MyUsername", "a".repeat(50)};
        for (String username : validUsernames) {
            userDTO.setUsername(username);
            violations = validator.validate(userDTO);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("username")),
                    "Username '" + username + "' should be valid");
        }
    }

    @Test
    void testEmailValidation() {
        UserDTO userDTO = createValidUserDTO();

        // Test null email
        userDTO.setEmail(null);
        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("email") && 
                v.getMessage().contains("required")),
                "Null email should be invalid");

        // Test blank email
        userDTO.setEmail("   ");
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("email") && 
                v.getMessage().contains("required")),
                "Blank email should be invalid");

        // Test invalid email formats
        String[] invalidEmails = {"invalid", "invalid@", "@invalid.com", "invalid.com", "invalid@.com", "invalid@@test.com"};
        for (String email : invalidEmails) {
            userDTO.setEmail(email);
            violations = validator.validate(userDTO);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("email") && 
                    v.getMessage().contains("should be valid")),
                    "Email '" + email + "' should be invalid");
        }

        // Test too long email
        String longEmail = "a".repeat(250) + "@test.com";
        userDTO.setEmail(longEmail);
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("email") && 
                v.getMessage().contains("not exceed 255")),
                "Too long email should be invalid");

        // Test valid emails
        String[] validEmails = {
            "test@example.com", "user.name@domain.co.za", "test123@test-domain.com",
            "user+tag@example.org", "very.long.email.address@very-long-domain-name.co.za"
        };
        for (String email : validEmails) {
            userDTO.setEmail(email);
            violations = validator.validate(userDTO);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("email")),
                    "Email '" + email + "' should be valid");
        }
    }

    @Test
    void testPhoneValidation() {
        UserDTO userDTO = createValidUserDTO();

        // Test null phone (should be valid as it's optional)
        userDTO.setPhone(null);
        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                "Null phone should be valid (optional field)");

        // Test empty phone (should be valid as it's optional)
        userDTO.setPhone("");
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                "Empty phone should be valid (optional field)");

        // Test invalid phone formats
        String[] invalidPhones = {"123456789", "081234567", "08123456789", "27821234567", "+271234567", "abc1234567"};
        for (String phone : invalidPhones) {
            userDTO.setPhone(phone);
            violations = validator.validate(userDTO);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("phone") && 
                    v.getMessage().contains("South African format")),
                    "Phone '" + phone + "' should be invalid");
        }

        // Test valid phone formats
        String[] validPhones = {"0821234567", "0731234567", "0841234567", "+27821234567", "+27731234567"};
        for (String phone : validPhones) {
            userDTO.setPhone(phone);
            violations = validator.validate(userDTO);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                    "Phone '" + phone + "' should be valid");
        }
    }

    @Test
    void testOptionalFieldsValidation() {
        // Test that UserDTO is valid with only required fields
        UserDTO minimalUserDTO = new UserDTO();
        minimalUserDTO.setUsername("testuser");
        minimalUserDTO.setEmail("test@example.com");

        Set<ConstraintViolation<UserDTO>> violations = validator.validate(minimalUserDTO);
        assertTrue(violations.isEmpty(), "UserDTO with only required fields should be valid");

        // Test that optional fields (when null) don't cause violations
        UserDTO userDTO = createValidUserDTO();
        userDTO.setPhone(null);
        userDTO.setRole(null);
        userDTO.setStatus(null);
        userDTO.setCreatedAt(null);
        userDTO.setUpdatedAt(null);
        userDTO.setLastLogin(null);
        userDTO.setIsVerified(null);

        violations = validator.validate(userDTO);
        assertTrue(violations.isEmpty(), "UserDTO with null optional fields should be valid");
    }

    @Test
    void testReadOnlyFieldsValidation() {
        // Test that read-only fields don't have validation constraints
        UserDTO userDTO = createValidUserDTO();
        
        // These fields are marked as read-only in the schema
        userDTO.setUserID(-1L);  // Negative ID
        userDTO.setCreatedAt(LocalDateTime.now().plusYears(10));  // Future date
        userDTO.setUpdatedAt(LocalDateTime.now().minusYears(10));  // Past date
        userDTO.setLastLogin(LocalDateTime.now().plusDays(1));  // Future login
        userDTO.setIsVerified(null);  // Null verification status

        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
        // Should only have violations for required fields, not read-only fields
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("userID") ||
                v.getPropertyPath().toString().equals("createdAt") ||
                v.getPropertyPath().toString().equals("updatedAt") ||
                v.getPropertyPath().toString().equals("lastLogin") ||
                v.getPropertyPath().toString().equals("isVerified")),
                "Read-only fields should not have validation constraints");
    }

    @Test
    void testCompleteValidationWorkflow() {
        // Test completely invalid UserDTO
        UserDTO invalidUserDTO = new UserDTO();
        invalidUserDTO.setUsername("ab");  // too short
        invalidUserDTO.setEmail("invalid-email");  // invalid format
        invalidUserDTO.setPhone("123");  // invalid format

        Set<ConstraintViolation<UserDTO>> violations = validator.validate(invalidUserDTO);
        assertFalse(violations.isEmpty(), "Invalid UserDTO should have violations");
        
        // Should have violations for username, email, and phone
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phone")));

        // Test minimal valid UserDTO
        UserDTO minimalUserDTO = new UserDTO();
        minimalUserDTO.setUsername("testuser");
        minimalUserDTO.setEmail("test@example.com");

        violations = validator.validate(minimalUserDTO);
        assertTrue(violations.isEmpty(), "Minimal valid UserDTO should not have violations");

        // Test complete valid UserDTO
        UserDTO completeUserDTO = createValidUserDTO();
        violations = validator.validate(completeUserDTO);
        assertTrue(violations.isEmpty(), "Complete valid UserDTO should not have violations");
    }

    @Test
    void testBoundaryValues() {
        UserDTO userDTO = createValidUserDTO();

        // Test boundary values for username
        userDTO.setUsername("abc");  // minimum length
        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("username")),
                "Minimum length username should be valid");

        userDTO.setUsername("a".repeat(50));  // maximum length
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("username")),
                "Maximum length username should be valid");

        // Test boundary values for email
        userDTO.setEmail("a@b.c");  // minimal valid email
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("email")),
                "Minimal valid email should be valid");

        // Test a reasonably long email that should be valid
        userDTO.setEmail("test.email.with.long.name@example-domain.co.za");
        violations = validator.validate(userDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("email")),
                "Long email should be valid");
    }

    private UserDTO createValidUserDTO() {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserID(1L);
        userDTO.setUsername("john_doe");
        userDTO.setEmail("john.doe@example.com");
        userDTO.setPhone("0821234567");
        userDTO.setRole("USER");
        userDTO.setStatus("ACTIVE");
        userDTO.setCreatedAt(LocalDateTime.now().minusDays(30));
        userDTO.setUpdatedAt(LocalDateTime.now().minusDays(1));
        userDTO.setLastLogin(LocalDateTime.now().minusHours(1));
        userDTO.setIsVerified(true);
        return userDTO;
    }
}