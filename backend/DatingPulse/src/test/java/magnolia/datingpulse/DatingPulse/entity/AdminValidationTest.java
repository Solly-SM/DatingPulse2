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
                .permissions(new String[]{"READ", "WRITE"})
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Valid admin should not have violations");
    }

    @Test
    void testRequiredUser() {
        Admin admin = Admin.builder()
                .user(null)
                .permissions(new String[]{"READ"})
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user")),
                "User should be required");
    }

    @Test
    void testAdminPermissions() {
        // Test admin with empty permissions array
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(new String[]{})
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Empty permissions array should be valid");
        
        // Test admin with null permissions  
        admin = Admin.builder()
                .user(testUser)
                .permissions(null)
                .build();

        violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Null permissions should be valid");
    }

    @Test
    void testAdminCreationFields() {
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(new String[]{"READ", "WRITE", "DELETE"})
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Admin with all fields should be valid");
        
        // Verify permissions array works correctly
        assertNotNull(admin.getPermissions());
        assertEquals(3, admin.getPermissions().length);
        assertEquals("READ", admin.getPermissions()[0]);
        assertEquals("WRITE", admin.getPermissions()[1]);
        assertEquals("DELETE", admin.getPermissions()[2]);
    }
}