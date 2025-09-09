package magnolia.datingpulse.DatingPulse;

import magnolia.datingpulse.DatingPulse.entity.Admin;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test to verify the Admin entity structure after removing createdAt and isActive fields
 * This is a simple unit test that doesn't require Spring context
 */
public class AdminSchemaValidationTest {
    
    @Test
    public void testAdminEntityStructure() {
        // Test that Admin entity can be created without createdAt and isActive fields
        User testUser = User.builder()
                .username("admin")
                .email("admin@test.com")
                .password("password")
                .role("ADMIN")
                .status("ACTIVE")
                .build();
        
        Admin admin = Admin.builder()
                .user(testUser)
                .permissions(new String[]{"READ", "WRITE"})
                .build();
        
        // Verify the entity structure
        assertNotNull(admin);
        assertEquals(testUser, admin.getUser());
        assertArrayEquals(new String[]{"READ", "WRITE"}, admin.getPermissions());
        
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
                .build(); // No permissions array
        
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
                .permissions(new String[]{"READ"})
                .build();
        
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Admin>> violations = validator.validate(admin);
        
        assertFalse(violations.isEmpty(), "Admin should be invalid without user");
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user")),
                "Should have violation for missing user");
    }
}