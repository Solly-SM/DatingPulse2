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
 * Comprehensive validation tests for AdminDTO
 * Testing admin role and permission validation
 */
class AdminDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidAdminDTO() {
        AdminDTO adminDTO = createValidAdminDTO();

        Set<ConstraintViolation<AdminDTO>> violations = validator.validate(adminDTO);
        assertTrue(violations.isEmpty(), "Valid AdminDTO should not have violations");
    }

    @Test
    void testUserIDValidation() {
        AdminDTO adminDTO = createValidAdminDTO();

        // Test null userID
        adminDTO.setUserID(null);
        Set<ConstraintViolation<AdminDTO>> violations = validator.validate(adminDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userID") && 
                v.getMessage().contains("required")),
                "Null userID should be invalid");

        // Test non-positive userID
        adminDTO.setUserID(0L);
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userID") && 
                v.getMessage().contains("positive")),
                "Zero userID should be invalid");

        adminDTO.setUserID(-1L);
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userID") && 
                v.getMessage().contains("positive")),
                "Negative userID should be invalid");

        // Test valid userID
        adminDTO.setUserID(1L);
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("userID")),
                "Positive userID should be valid");
    }

    @Test
    void testRoleValidation() {
        AdminDTO adminDTO = createValidAdminDTO();

        // Test null role
        adminDTO.setRole(null);
        Set<ConstraintViolation<AdminDTO>> violations = validator.validate(adminDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role") && 
                v.getMessage().contains("required")),
                "Null role should be invalid");

        // Test blank role
        adminDTO.setRole("   ");
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role") && 
                v.getMessage().contains("required")),
                "Blank role should be invalid");

        // Test invalid roles
        String[] invalidRoles = {"USER", "MODERATOR", "admin", "super_admin", "INVALID", "Admin", "Super_Admin"};
        for (String role : invalidRoles) {
            adminDTO.setRole(role);
            violations = validator.validate(adminDTO);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("role") && 
                    v.getMessage().contains("must be one of")),
                    "Role '" + role + "' should be invalid");
        }

        // Test valid roles
        String[] validRoles = {"ADMIN", "SUPER_ADMIN"};
        for (String role : validRoles) {
            adminDTO.setRole(role);
            violations = validator.validate(adminDTO);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("role")),
                    "Role '" + role + "' should be valid");
        }
    }

    @Test
    void testPermissionIDsValidation() {
        AdminDTO adminDTO = createValidAdminDTO();

        // Test null permissionIDs (should be valid as it's optional)
        adminDTO.setPermissionIDs(null);
        Set<ConstraintViolation<AdminDTO>> violations = validator.validate(adminDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("permissionIDs")),
                "Null permissionIDs should be valid (optional field)");

        // Test empty permissionIDs (should be valid)
        adminDTO.setPermissionIDs(Set.of());
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("permissionIDs")),
                "Empty permissionIDs should be valid");

        // Test valid permissionIDs
        adminDTO.setPermissionIDs(Set.of(1L, 2L, 3L));
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("permissionIDs")),
                "Valid permissionIDs should be valid");

        // Test invalid permissionIDs (non-positive)
        adminDTO.setPermissionIDs(Set.of(1L, 0L, 3L));
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().contains("permissionIDs") && 
                v.getMessage().contains("positive")),
                "Zero in permissionIDs should be invalid");

        adminDTO.setPermissionIDs(Set.of(1L, -1L, 3L));
        violations = validator.validate(adminDTO);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().contains("permissionIDs") && 
                v.getMessage().contains("positive")),
                "Negative value in permissionIDs should be invalid");
    }

    @Test
    void testCompleteValidationWorkflow() {
        // Test completely invalid AdminDTO
        AdminDTO invalidAdminDTO = new AdminDTO();
        invalidAdminDTO.setUserID(-1L);  // invalid
        invalidAdminDTO.setRole("USER");  // invalid for admin
        invalidAdminDTO.setPermissionIDs(Set.of(0L, -1L));  // invalid

        Set<ConstraintViolation<AdminDTO>> violations = validator.validate(invalidAdminDTO);
        assertFalse(violations.isEmpty(), "Invalid AdminDTO should have violations");

        // Should have violations for userID, role, and permissionIDs
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userID")));
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("role")));
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().contains("permissionIDs")));

        // Test minimal valid AdminDTO
        AdminDTO minimalAdminDTO = new AdminDTO();
        minimalAdminDTO.setUserID(1L);
        minimalAdminDTO.setRole("ADMIN");
        // permissionIDs can be null

        violations = validator.validate(minimalAdminDTO);
        assertTrue(violations.isEmpty(), "Minimal valid AdminDTO should not have violations");

        // Test complete valid AdminDTO
        AdminDTO completeAdminDTO = createValidAdminDTO();
        violations = validator.validate(completeAdminDTO);
        assertTrue(violations.isEmpty(), "Complete valid AdminDTO should not have violations");
    }

    @Test
    void testReadOnlyFields() {
        AdminDTO adminDTO = createValidAdminDTO();

        // Test that adminID (likely read-only) doesn't have validation constraints
        adminDTO.setAdminID(-999L);  // Negative ID shouldn't cause validation error

        Set<ConstraintViolation<AdminDTO>> violations = validator.validate(adminDTO);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("adminID")),
                "AdminID should not have validation constraints (read-only field)");
    }

    @Test
    void testRoleCaseSensitivity() {
        AdminDTO adminDTO = createValidAdminDTO();

        // Test that roles are case-sensitive
        String[] caseVariants = {"admin", "Admin", "ADMIN", "super_admin", "Super_Admin", "SUPER_ADMIN"};
        
        for (String role : caseVariants) {
            adminDTO.setRole(role);
            Set<ConstraintViolation<AdminDTO>> violations = validator.validate(adminDTO);
            
            if (role.equals("ADMIN") || role.equals("SUPER_ADMIN")) {
                assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("role")),
                        "Role '" + role + "' should be valid (exact case match)");
            } else {
                assertTrue(violations.stream().anyMatch(v -> 
                        v.getPropertyPath().toString().equals("role") && 
                        v.getMessage().contains("must be one of")),
                        "Role '" + role + "' should be invalid (case sensitive)");
            }
        }
    }

    private AdminDTO createValidAdminDTO() {
        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setAdminID(1L);
        adminDTO.setUserID(100L);
        adminDTO.setRole("ADMIN");
        adminDTO.setPermissionIDs(Set.of(1L, 2L, 3L));
        return adminDTO;
    }
}