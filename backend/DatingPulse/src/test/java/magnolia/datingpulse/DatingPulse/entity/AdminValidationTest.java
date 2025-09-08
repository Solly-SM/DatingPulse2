package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class AdminValidationTest {

    private Validator validator;
    private User testUser;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .username("adminuser")
                .email("admin@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("ADMIN")
                .status("ACTIVE")
                .isVerified(true)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidAdmin() {
        Admin admin = Admin.builder()
                .user(testUser)
                .role("ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Valid admin should not have violations");
    }

    @Test
    void testValidAdminRoles() {
        String[] validRoles = {"ADMIN", "SUPER_ADMIN"};
        
        for (String role : validRoles) {
            Admin admin = createAdminWithRole(role);
            Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("role")),
                    "Admin role '" + role + "' should be valid");
        }
    }

    @Test
    void testInvalidAdminRole() {
        String[] invalidRoles = {"USER", "MODERATOR", "STAFF", "admin", "super_admin", "", "   ", null};
        
        for (String role : invalidRoles) {
            Admin admin = createAdminWithRole(role);
            Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("role")),
                    "Admin role '" + role + "' should be invalid");
        }
    }

    @Test
    void testRequiredFields() {
        // Test null user
        Admin admin = Admin.builder()
                .user(null)
                .role("ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user") && 
                v.getMessage().contains("required")),
                "Null user should be invalid");

        // Test null role
        admin = Admin.builder()
                .user(testUser)
                .role(null)
                .build();

        violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role") && 
                v.getMessage().contains("required")),
                "Null role should be invalid");

        // Test blank role
        admin = Admin.builder()
                .user(testUser)
                .role("   ")
                .build();

        violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role") && 
                v.getMessage().contains("required")),
                "Blank role should be invalid");
    }

    @Test
    void testAdminWithDifferentUsers() {
        // Test ADMIN role
        User adminUser = User.builder()
                .username("admin1")
                .email("admin1@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("ADMIN")
                .status("ACTIVE")
                .isVerified(true)
                .loginAttempt(0)
                .build();

        Admin admin = Admin.builder()
                .user(adminUser)
                .role("ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Admin with admin user should be valid");

        // Test SUPER_ADMIN role
        User superAdminUser = User.builder()
                .username("superadmin")
                .email("superadmin@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("SUPER_ADMIN")
                .status("ACTIVE")
                .isVerified(true)
                .loginAttempt(0)
                .build();

        Admin superAdmin = Admin.builder()
                .user(superAdminUser)
                .role("SUPER_ADMIN")
                .build();

        violations = validator.validate(superAdmin);
        assertTrue(violations.isEmpty(), "Super admin should be valid");
    }

    @Test
    void testAdminWithPermissions() {
        // Test admin without permissions (should be valid as permissions are optional)
        Admin admin = Admin.builder()
                .user(testUser)
                .role("ADMIN")
                .permissions(null)
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Admin without permissions should be valid");

        // Test admin with empty permissions set (should be valid)
        admin = Admin.builder()
                .user(testUser)
                .role("ADMIN")
                .permissions(Set.of())
                .build();

        violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Admin with empty permissions should be valid");
    }

    @Test
    void testMinimalValidAdmin() {
        // Test the minimal required fields for a valid admin
        Admin minimalAdmin = Admin.builder()
                .user(testUser)
                .role("ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(minimalAdmin);
        assertTrue(violations.isEmpty(), "Minimal admin should be valid");
        
        // Verify all required fields are present
        assertNotNull(minimalAdmin.getUser(), "User should be set");
        assertNotNull(minimalAdmin.getRole(), "Role should be set");
    }

    @Test
    void testAllRequiredFieldsMissing() {
        // Test with all required fields missing
        Admin admin = Admin.builder()
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        
        // Should have violations for all required fields
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("user")),
                "Should have violation for missing user");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("role")),
                "Should have violation for missing role");
        
        // Verify we have exactly 2 violations (one for each required field)
        assertEquals(2, violations.size(), "Should have exactly 2 validation violations");
    }

    @Test
    void testRolePatternValidation() {
        // Test that role follows exact pattern matching
        Admin admin = createAdminWithRole("ADMIN");
        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("role")),
                "ADMIN role should be valid");

        admin = createAdminWithRole("SUPER_ADMIN");
        violations = validator.validate(admin);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("role")),
                "SUPER_ADMIN role should be valid");

        // Test case sensitivity
        admin = createAdminWithRole("admin");
        violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role") && 
                v.getMessage().contains("must be one of")),
                "Lowercase 'admin' should be invalid due to case sensitivity");
    }

    private Admin createAdminWithRole(String role) {
        return Admin.builder()
                .user(testUser)
                .role(role)
                .build();
    }
}