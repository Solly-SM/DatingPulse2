package magnolia.datingpulse.DatingPulse;

import magnolia.datingpulse.DatingPulse.entity.Admin;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.entity.Permission;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test to verify the Admin entity structure with the new @ManyToMany permissions relationship
 * This is a simple unit test that doesn't require Spring context
 */
public class AdminSchemaValidationTest {
    
    @Test
    public void testAdminEntityStructure() {
        // Test that Admin entity can be created with @ManyToMany permissions
        User testUser = User.builder()
                .username("admin")
                .email("admin@test.com")
                .password("password")
                .role("ADMIN")
                .status("ACTIVE")
                .build();
        
        Permission readPermission = Permission.builder()
                .id(1L)
                .name("READ")
                .build();
        
        Permission writePermission = Permission.builder()
                .id(2L)
                .name("WRITE")
                .build();
        
        Set<Permission> permissions = new HashSet<>();
        permissions.add(readPermission);
        permissions.add(writePermission);
        
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(permissions)
                .role("ADMIN")
                .build();
        
        // Verify the entity structure
        assertNotNull(admin);
        assertEquals(testUser, admin.getUser());
        assertEquals(permissions, admin.getPermissions());
        assertEquals("ADMIN", admin.getRole());
        assertEquals(2, admin.getPermissions().size());
        
        // Test validation
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        
        assertTrue(violations.isEmpty(), "Admin entity should be valid");
    }
    
    @Test
    public void testAdminEntityWithoutOptionalFields() {
        // Test the minimal valid Admin entity
        User testUser = User.builder()
                .username("admin2")
                .email("admin2@test.com")
                .password("password")
                .role("ADMIN")
                .status("ACTIVE")
                .build();
        
        Admin admin = Admin.builder()
                .user(testUser)
                .role("ADMIN")
                .build(); // No permissions set
        
        // Should still be valid
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        
        assertTrue(violations.isEmpty(), "Admin entity should be valid without permissions");
    }
    
    @Test
    public void testAdminEntityRequiredFields() {
        // Test that User is required
        Admin admin = Admin.builder()
                .user(null)
                .permissions(new HashSet<>())
                .role("ADMIN")
                .build();
        
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        
        assertFalse(violations.isEmpty(), "Admin should be invalid without user");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user")),
                "Should have violation for missing user");
    }
    
    @Test
    public void testAdminEntityRoleValidation() {
        User testUser = User.builder()
                .username("admin3")
                .email("admin3@test.com")
                .password("password")
                .role("ADMIN")
                .status("ACTIVE")
                .build();
        
        // Test invalid role
        Admin admin = Admin.builder()
                .user(testUser)
                .role("INVALID_ROLE")
                .build();
        
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        
        assertFalse(violations.isEmpty(), "Admin should be invalid with invalid role");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role")),
                "Should have violation for invalid role");
    }
}