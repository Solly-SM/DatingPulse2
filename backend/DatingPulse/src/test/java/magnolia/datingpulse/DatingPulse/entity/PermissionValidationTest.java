package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class PermissionValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidPermission() {
        Permission permission = Permission.builder()
                .name("USER_MANAGE")
                .build();

        Set<ConstraintViolation<Permission>> violations = validator.validate(permission);
        assertTrue(violations.isEmpty(), "Valid permission should not have violations");
    }

    @Test
    void testValidPermissionNames() {
        String[] validNames = {
                "USER_MANAGE",
                "PHOTO_MODERATE",
                "ADMIN_ACCESS",
                "CONTENT_DELETE",
                "SYSTEM_CONFIG"
        };

        for (String name : validNames) {
            Permission permission = createPermissionWithName(name);
            Set<ConstraintViolation<Permission>> violations = validator.validate(permission);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("name")),
                    "Permission name should be valid: " + name);
        }
    }

    @Test
    void testInvalidPermissionNames() {
        String[] invalidNames = {
                "",                    // Empty
                "ab",                  // Too short
                "user_manage",         // Lowercase
                "User-Manage",         // Hyphen not allowed
                "USER MANAGE",         // Space not allowed
                "USER@MANAGE",         // Special character not allowed
                "A".repeat(51)         // Too long
        };

        for (String name : invalidNames) {
            Permission permission = createPermissionWithName(name);
            Set<ConstraintViolation<Permission>> violations = validator.validate(permission);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("name")),
                    "Permission name should be invalid: " + name);
        }
    }

    @Test
    void testNullPermissionName() {
        Permission permission = createPermissionWithName(null);
        Set<ConstraintViolation<Permission>> violations = validator.validate(permission);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("required")),
                "Null permission name should be invalid");
    }

    @Test
    void testPermissionNameLengthValidation() {
        // Minimum length (3 characters)
        Permission permission = createPermissionWithName("ABC");
        Set<ConstraintViolation<Permission>> violations = validator.validate(permission);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("between 3 and 50")));

        // Maximum length (50 characters)
        permission = createPermissionWithName("A".repeat(50));
        violations = validator.validate(permission);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("between 3 and 50")));

        // Too short (2 characters)
        permission = createPermissionWithName("AB");
        violations = validator.validate(permission);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("between 3 and 50")));

        // Too long (51 characters)
        permission = createPermissionWithName("A".repeat(51));
        violations = validator.validate(permission);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("between 3 and 50")));
    }

    private Permission createPermissionWithName(String name) {
        return Permission.builder()
                .name(name)
                .build();
    }
}