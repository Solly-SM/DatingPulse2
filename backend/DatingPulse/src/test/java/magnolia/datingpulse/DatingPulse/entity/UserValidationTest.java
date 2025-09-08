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

class UserValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidUser() {
        User user = User.builder()
                .username("validuser123")
                .email("valid@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .phone("0821234567")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.isEmpty(), "Valid user should not have violations");
    }

    @Test
    void testUsernameValidation() {
        // Valid usernames
        String[] validUsernames = {
                "user123",
                "test_user",
                "ValidUser",
                "username_with_underscores",
                "us3r",      // minimum 3 chars
                "A".repeat(50) // maximum 50 chars
        };

        for (String username : validUsernames) {
            User user = createUserWithUsername(username);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("username")),
                    "Username '" + username + "' should be valid");
        }

        // Invalid usernames
        String[] invalidUsernames = {
                "ab",        // Too short
                "A".repeat(51), // Too long
                "user@name", // Invalid character
                "user name", // Space not allowed
                "user-name", // Hyphen not allowed
                "",          // Empty
                "   ",       // Blank
        };

        for (String username : invalidUsernames) {
            User user = createUserWithUsername(username);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")),
                    "Username '" + username + "' should be invalid");
        }
    }

    @Test
    void testEmailValidation() {
        // Valid emails
        String[] validEmails = {
                "test@example.com",
                "user.name@domain.co.za",
                "valid+email@test.org",
                "123@numbers.com"
        };

        for (String email : validEmails) {
            User user = createUserWithEmail(email);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("email")),
                    "Email '" + email + "' should be valid");
        }

        // Invalid emails
        String[] invalidEmails = {
                "invalid-email",
                "@invalid.com",
                "test@",
                "test..email@example.com",
                "",
                "   ",
                "A".repeat(250) + "@test.com" // Too long
        };

        for (String email : invalidEmails) {
            User user = createUserWithEmail(email);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")),
                    "Email '" + email + "' should be invalid");
        }
    }

    @Test
    void testPasswordValidation() {
        // Valid password (BCrypt hash format)
        String validPassword = "$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        User user = createUserWithPassword(validPassword);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("password")),
                "Valid BCrypt password should be accepted");

        // Invalid passwords
        String[] invalidPasswords = {
                "",           // Empty
                "   ",        // Blank
                null,         // Null
                "short",      // Too short
                "A".repeat(256) // Too long
        };

        for (String password : invalidPasswords) {
            user = createUserWithPassword(password);
            violations = validator.validate(user);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")),
                    "Password '" + password + "' should be invalid");
        }
    }

    @Test
    void testPhoneValidation() {
        // Valid South African phone numbers
        String[] validPhones = {
                "0821234567",     // National format
                "+27821234567",   // International format
                "0731234567",     // Vodacom
                "0841234567",     // Cell C
                "0611234567"      // Telkom Mobile
        };

        for (String phone : validPhones) {
            User user = createUserWithPhone(phone);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                    "Phone '" + phone + "' should be valid");
        }

        // Invalid phone numbers
        String[] invalidPhones = {
                "1234567890",     // Invalid format
                "082123456",      // Too short
                "08212345678",    // Too long
                "+278123456789",  // Too long international (10 digits after +27)
                "082-123-4567",   // Dashes not allowed
                "082 123 4567",   // Spaces not allowed
                "+27012345678",   // Invalid - starts with 0 after +27
        };

        for (String phone : invalidPhones) {
            User user = createUserWithPhone(phone);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phone")),
                    "Phone '" + phone + "' should be invalid");
        }

        // Null phone should be valid (optional field)
        User user = createUserWithPhone(null);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                "Null phone should be valid (optional field)");
    }

    @Test
    void testRoleValidation() {
        // Valid roles
        String[] validRoles = {"USER", "ADMIN", "SUPER_ADMIN"};

        for (String role : validRoles) {
            User user = createUserWithRole(role);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("role")),
                    "Role '" + role + "' should be valid");
        }

        // Invalid roles
        String[] invalidRoles = {"INVALID", "user", "admin", "", "   ", null};

        for (String role : invalidRoles) {
            User user = createUserWithRole(role);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("role")),
                    "Role '" + role + "' should be invalid");
        }
    }

    @Test
    void testStatusValidation() {
        // Valid statuses
        String[] validStatuses = {"ACTIVE", "SUSPENDED", "BANNED"};

        for (String status : validStatuses) {
            User user = createUserWithStatus(status);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("status")),
                    "Status '" + status + "' should be valid");
        }

        // Invalid statuses
        String[] invalidStatuses = {"INVALID", "active", "suspended", "", "   ", null};

        for (String status : invalidStatuses) {
            User user = createUserWithStatus(status);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("status")),
                    "Status '" + status + "' should be invalid");
        }
    }

    @Test
    void testLoginAttemptValidation() {
        // Valid login attempts
        Integer[] validAttempts = {0, 1, 5, 10};

        for (Integer attempts : validAttempts) {
            User user = createUserWithLoginAttempts(attempts);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("loginAttempt")),
                    "Login attempts '" + attempts + "' should be valid");
        }

        // Invalid login attempts
        Integer[] invalidAttempts = {-1, 11, -5, 100};

        for (Integer attempts : invalidAttempts) {
            User user = createUserWithLoginAttempts(attempts);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("loginAttempt")),
                    "Login attempts '" + attempts + "' should be invalid");
        }

        // Null login attempts
        User user = createUserWithLoginAttempts(null);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("loginAttempt") && 
                v.getMessage().contains("required")),
                "Null login attempts should be invalid");
    }

    @Test
    void testVerificationStatusValidation() {
        // Valid verification statuses
        Boolean[] validStatuses = {true, false};

        for (Boolean status : validStatuses) {
            User user = createUserWithVerificationStatus(status);
            Set<ConstraintViolation<User>> violations = validator.validate(user);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("isVerified")),
                    "Verification status '" + status + "' should be valid");
        }

        // Null verification status
        User user = createUserWithVerificationStatus(null);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("isVerified") && 
                v.getMessage().contains("required")),
                "Null verification status should be invalid");
    }

    @Test
    void testRequiredFields() {
        // Test with minimal required fields
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.isEmpty(), "User with all required fields should be valid");
    }

    // Helper methods
    private User createUserWithUsername(String username) {
        return User.builder()
                .username(username)
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    private User createUserWithEmail(String email) {
        return User.builder()
                .username("testuser")
                .email(email)
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    private User createUserWithPassword(String password) {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password(password)
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    private User createUserWithPhone(String phone) {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .phone(phone)
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    private User createUserWithRole(String role) {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role(role)
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    private User createUserWithStatus(String status) {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status(status)
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    private User createUserWithLoginAttempts(Integer attempts) {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(attempts)
                .build();
    }

    private User createUserWithVerificationStatus(Boolean isVerified) {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(isVerified)
                .loginAttempt(0)
                .build();
    }
}