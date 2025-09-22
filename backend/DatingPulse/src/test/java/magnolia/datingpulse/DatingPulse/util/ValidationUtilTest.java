package magnolia.datingpulse.DatingPulse.util;

import magnolia.datingpulse.DatingPulse.dto.LoginRequest;
import magnolia.datingpulse.DatingPulse.dto.RegisterRequest;
import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive tests for ValidationUtil
 * Testing the utility methods for validation across the application
 */
class ValidationUtilTest {

    private ValidationUtil validationUtil;

    @BeforeEach
    void setUp() {
        validationUtil = new ValidationUtil();
    }

    @Test
    void testValidateValidObject() {
        UserDTO validUser = createValidUserDTO();
        
        var violations = validationUtil.validate(validUser);
        assertTrue(violations.isEmpty(), "Valid object should have no violations");
        
        assertTrue(validationUtil.isValid(validUser), "Valid object should return true for isValid");
        assertNull(validationUtil.getValidationErrors(validUser), "Valid object should have null error message");
        assertEquals(0, validationUtil.getViolationCount(validUser), "Valid object should have 0 violations");
    }

    @Test
    void testValidateInvalidObject() {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setUsername("ab"); // too short
        invalidUser.setEmail("invalid-email"); // invalid format
        
        var violations = validationUtil.validate(invalidUser);
        assertFalse(violations.isEmpty(), "Invalid object should have violations");
        
        assertFalse(validationUtil.isValid(invalidUser), "Invalid object should return false for isValid");
        assertNotNull(validationUtil.getValidationErrors(invalidUser), "Invalid object should have error message");
        assertTrue(validationUtil.getViolationCount(invalidUser) > 0, "Invalid object should have violations count > 0");
    }

    @Test
    void testValidateAndThrow() {
        UserDTO validUser = createValidUserDTO();
        
        // Should not throw for valid object
        assertDoesNotThrow(() -> validationUtil.validateAndThrow(validUser),
                "Valid object should not throw exception");

        UserDTO invalidUser = new UserDTO();
        invalidUser.setUsername("ab"); // too short
        
        // Should throw for invalid object
        assertThrows(IllegalArgumentException.class, 
                () -> validationUtil.validateAndThrow(invalidUser),
                "Invalid object should throw IllegalArgumentException");
    }

    @Test
    void testValidateProperty() {
        UserDTO user = createValidUserDTO();
        
        // Valid property
        var violations = validationUtil.validateProperty(user, "username");
        assertTrue(violations.isEmpty(), "Valid property should have no violations");
        
        // Invalid property
        user.setEmail("invalid-email");
        violations = validationUtil.validateProperty(user, "email");
        assertFalse(violations.isEmpty(), "Invalid property should have violations");
    }

    @Test
    void testValidateValue() {
        // Valid value
        var violations = validationUtil.validateValue(UserDTO.class, "username", "validuser");
        assertTrue(violations.isEmpty(), "Valid value should have no violations");
        
        // Invalid value
        violations = validationUtil.validateValue(UserDTO.class, "username", "ab");
        assertFalse(violations.isEmpty(), "Invalid value should have violations");
    }

    @Test
    void testFormatViolations() {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setUsername("ab"); // too short
        invalidUser.setEmail("invalid"); // invalid format
        
        var violations = validationUtil.validate(invalidUser);
        String formatted = validationUtil.formatViolations(violations);
        
        assertNotNull(formatted, "Formatted violations should not be null");
        assertFalse(formatted.isEmpty(), "Formatted violations should not be empty");
        assertTrue(formatted.contains("username"), "Should mention username field");
        assertTrue(formatted.contains("email"), "Should mention email field");
    }

    @Test
    void testValidateMultiple() {
        UserDTO validUser = createValidUserDTO();
        LoginRequest validLogin = createValidLoginRequest();
        RegisterRequest invalidRegister = new RegisterRequest();
        invalidRegister.setUsername("ab"); // invalid
        
        ValidationUtil.ValidationSummary summary = validationUtil.validateMultiple(
                validUser, validLogin, invalidRegister);
        
        assertFalse(summary.isValid(), "Should be invalid due to one invalid object");
        assertEquals(3, summary.getValidatedObjects(), "Should have validated 3 objects");
        assertTrue(summary.getTotalViolations() > 0, "Should have violations from invalid object");
        
        String summaryText = summary.getSummary();
        assertNotNull(summaryText, "Summary text should not be null");
        assertTrue(summaryText.contains("RegisterRequest"), "Should mention the invalid object type");
    }

    @Test
    void testValidateAndLog() {
        UserDTO validUser = createValidUserDTO();
        UserDTO invalidUser = new UserDTO();
        invalidUser.setUsername("ab");
        
        assertTrue(validationUtil.validateAndLog(validUser, "test context"),
                "Valid object should return true");
        
        assertFalse(validationUtil.validateAndLog(invalidUser, "test context"),
                "Invalid object should return false");
    }

    @Test
    void testQuickValidate() {
        UserDTO validUser = createValidUserDTO();
        UserDTO invalidUser = new UserDTO();
        invalidUser.setUsername("ab");
        
        ValidationUtil.ValidationResult validResult = validationUtil.quickValidate(validUser);
        assertTrue(validResult.isValid(), "Valid object should have valid result");
        assertEquals("Valid", validResult.getMessage(), "Valid object should have 'Valid' message");
        assertEquals(0, validResult.getViolationCount(), "Valid object should have 0 violations");
        
        ValidationUtil.ValidationResult invalidResult = validationUtil.quickValidate(invalidUser);
        assertFalse(invalidResult.isValid(), "Invalid object should have invalid result");
        assertNotEquals("Valid", invalidResult.getMessage(), "Invalid object should not have 'Valid' message");
        assertTrue(invalidResult.getViolationCount() > 0, "Invalid object should have violations > 0");
    }

    @Test
    void testValidateNullObject() {
        var violations = validationUtil.validate(null);
        assertTrue(violations.isEmpty(), "Null object should return empty violations set");
        
        assertTrue(validationUtil.isValid(null), "Null object should be considered valid");
        assertNull(validationUtil.getValidationErrors(null), "Null object should have null errors");
        assertEquals(0, validationUtil.getViolationCount(null), "Null object should have 0 violations");
    }

    @Test
    void testValidationSummaryAllValid() {
        UserDTO validUser = createValidUserDTO();
        LoginRequest validLogin = createValidLoginRequest();
        
        ValidationUtil.ValidationSummary summary = validationUtil.validateMultiple(
                validUser, validLogin);
        
        assertTrue(summary.isValid(), "All valid objects should result in valid summary");
        assertEquals(2, summary.getValidatedObjects(), "Should have validated 2 objects");
        assertEquals(0, summary.getTotalViolations(), "Should have 0 violations");
        
        String summaryText = summary.getSummary();
        assertTrue(summaryText.contains("All 2 objects are valid"), 
                "Summary should indicate all objects are valid");
    }

    @Test
    void testValidationWithDifferentEntityTypes() {
        // Test with entity
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                 // Valid BCrypt hash length
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
        
        assertTrue(validationUtil.isValid(user), "Valid User entity should be valid");
        
        // Test with DTO
        RegisterRequest request = RegisterRequest.builder()
                .username("testuser")
                .email("test@example.com")
                
                .build();
        
        assertTrue(validationUtil.isValid(request), "Valid RegisterRequest DTO should be valid");
        
        // Test mixed validation
        ValidationUtil.ValidationSummary summary = validationUtil.validateMultiple(user, request);
        assertTrue(summary.isValid(), "Mixed valid entities and DTOs should be valid");
    }

    @Test
    void testValidationResultToString() {
        ValidationUtil.ValidationResult validResult = 
                new ValidationUtil.ValidationResult(true, "Valid", 0);
        
        String resultString = validResult.toString();
        assertTrue(resultString.contains("valid=true"), "Should show valid status");
        assertTrue(resultString.contains("violations=0"), "Should show violation count");
        assertTrue(resultString.contains("Valid"), "Should show message");
    }

    @Test
    void testValidationSummaryToString() {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setUsername("ab");
        
        ValidationUtil.ValidationSummary summary = validationUtil.validateMultiple(invalidUser);
        
        String summaryString = summary.toString();
        assertNotNull(summaryString, "Summary toString should not be null");
        assertTrue(summaryString.contains("violations"), "Should mention violations");
        assertTrue(summaryString.contains("UserDTO"), "Should mention object type");
    }

    private UserDTO createValidUserDTO() {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("testuser");
        userDTO.setEmail("test@example.com");
        userDTO.setPhone("0821234567");
        return userDTO;
    }

    private LoginRequest createValidLoginRequest() {
        return LoginRequest.builder()
                .username("testuser")
                
                .build();
    }
}