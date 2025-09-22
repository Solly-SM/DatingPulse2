package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class AdminValidationTest {

    private Validator validator;
    private User testUser;
    private Permission readPermission;
    private Permission writePermission;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .username("adminuser")
                .email("admin@test.com")
                
                .role("ADMIN")
                .status("ACTIVE")
                .isVerified(true)
                .loginAttempt(0)
                .build();
                
        readPermission = Permission.builder()
                .id(1L)
                .name("READ")
                .build();
                
        writePermission = Permission.builder()
                .id(2L)
                .name("WRITE")
                .build();
    }

    @Test
    void testValidAdmin() {
        Set<Permission> permissions = new HashSet<>();
        permissions.add(readPermission);
        permissions.add(writePermission);
        
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(permissions)
                .role("ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Valid admin should not have violations");
    }

    @Test
    void testRequiredUser() {
        Admin admin = Admin.builder()
                .user(null)
                .permissions(new HashSet<>())
                .role("ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user")),
                "User should be required");
    }

    @Test
    void testRequiredRole() {
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(new HashSet<>())
                .role(null)
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role")),
                "Role should be required");
    }

    @Test
    void testInvalidRole() {
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(new HashSet<>())
                .role("INVALID_ROLE")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role")),
                "Invalid role should be rejected");
    }

    @Test
    void testAdminPermissions() {
        // Test admin with empty permissions set
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(new HashSet<>())
                .role("ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Empty permissions set should be valid");
        
        // Test admin with null permissions  
        admin = Admin.builder()
                .user(testUser)
                .permissions(null)
                .role("ADMIN")
                .build();

        violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Null permissions should be valid");
    }

    @Test
    void testAdminCreationFields() {
        Set<Permission> permissions = new HashSet<>();
        permissions.add(readPermission);
        permissions.add(writePermission);
        
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(permissions)
                .role("SUPER_ADMIN")
                .build();

        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        assertTrue(violations.isEmpty(), "Admin with all fields should be valid");
        
        // Verify permissions set works correctly
        assertNotNull(admin.getPermissions());
        assertEquals(2, admin.getPermissions().size());
        assertTrue(admin.getPermissions().contains(readPermission));
        assertTrue(admin.getPermissions().contains(writePermission));
    }
}