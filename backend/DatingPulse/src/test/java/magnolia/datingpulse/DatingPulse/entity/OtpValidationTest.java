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

class OtpValidationTest {

    private Validator validator;
    private User testUser;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidOtp() {
        Otp otp = Otp.builder()
                .user(testUser)
                .code("123456")
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
        assertTrue(violations.isEmpty(), "Valid OTP should not have violations");
    }

    @Test
    void testValidOtpCodes() {
        String[] validCodes = {"123456", "000000", "999999", "654321", "111111"};
        
        for (String code : validCodes) {
            Otp otp = createOtpWithCode(code);
            Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("code")),
                    "OTP code '" + code + "' should be valid");
        }
    }

    @Test
    void testInvalidOtpCodes() {
        String[] invalidCodes = {
                "12345",    // Too short
                "1234567",  // Too long
                "12345a",   // Contains letter
                "12345@",   // Contains special character
                "12 456",   // Contains space
                "",         // Empty
                "ABCDEF"    // All letters
        };
        
        for (String code : invalidCodes) {
            Otp otp = createOtpWithCode(code);
            Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
            assertTrue(violations.stream().anyMatch(v -> 
                    v.getPropertyPath().toString().equals("code")),
                    "OTP code '" + code + "' should be invalid");
        }
    }

    @Test
    void testValidOtpTypes() {
        String[] validTypes = {"LOGIN", "SIGNUP", "RESET", "VERIFICATION"};
        
        for (String type : validTypes) {
            Otp otp = createOtpWithType(type);
            Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("type")),
                    "OTP type '" + type + "' should be valid");
        }
    }

    @Test
    void testInvalidOtpType() {
        Otp otp = createOtpWithType("INVALID_TYPE");
        Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("must be LOGIN")),
                "Invalid OTP type should be rejected");
    }

    @Test
    void testExpiryTimeValidation() {
        // Valid future expiry time
        Otp otp = createOtpWithExpiryTime(LocalDateTime.now().plusMinutes(10));
        Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("expiresAt")),
                "Future expiry time should be valid");

        // Invalid past expiry time
        otp = createOtpWithExpiryTime(LocalDateTime.now().minusMinutes(10));
        violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("expiresAt") && 
                v.getMessage().contains("future")),
                "Past expiry time should be invalid");

        // Null expiry time
        otp = createOtpWithExpiryTime(null);
        violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("expiresAt") && 
                v.getMessage().contains("required")),
                "Null expiry time should be invalid");
    }

    @Test
    void testRequiredFields() {
        // Test null user
        Otp otp = Otp.builder()
                .user(null)
                .code("123456")
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user") && 
                v.getMessage().contains("required")),
                "Null user should be invalid");

        // Test null code
        otp = Otp.builder()
                .user(testUser)
                .code(null)
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();

        violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("code") && 
                v.getMessage().contains("required")),
                "Null code should be invalid");

        // Test null type
        otp = Otp.builder()
                .user(testUser)
                .code("123456")
                .type(null)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();

        violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("required")),
                "Null type should be invalid");

        // Test null isUsed
        otp = Otp.builder()
                .user(testUser)
                .code("123456")
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(null)
                .createdAt(LocalDateTime.now())
                .build();

        violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("isUsed") && 
                v.getMessage().contains("required")),
                "Null isUsed should be invalid");

        // Test null createdAt
        otp = Otp.builder()
                .user(testUser)
                .code("123456")
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(null)
                .build();

        violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("createdAt") && 
                v.getMessage().contains("required")),
                "Null createdAt should be invalid");
    }

    @Test
    void testBlankCode() {
        Otp otp = createOtpWithCode("   ");
        Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("code") && 
                v.getMessage().contains("required")),
                "Blank OTP code should be invalid");
    }

    @Test
    void testBlankType() {
        Otp otp = createOtpWithType("   ");
        Set<ConstraintViolation<Otp>> violations = validator.validate(otp);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("required")),
                "Blank OTP type should be invalid");
    }

    @Test
    void testOtpUsageStates() {
        // Test unused OTP
        Otp unusedOtp = Otp.builder()
                .user(testUser)
                .code("123456")
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Otp>> violations = validator.validate(unusedOtp);
        assertTrue(violations.isEmpty(), "Unused OTP should be valid");

        // Test used OTP
        Otp usedOtp = Otp.builder()
                .user(testUser)
                .code("123456")
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(true)
                .createdAt(LocalDateTime.now())
                .build();

        violations = validator.validate(usedOtp);
        assertTrue(violations.isEmpty(), "Used OTP should be valid");
    }

    private Otp createOtpWithCode(String code) {
        return Otp.builder()
                .user(testUser)
                .code(code)
                .type("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Otp createOtpWithType(String type) {
        return Otp.builder()
                .user(testUser)
                .code("123456")
                .type(type)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Otp createOtpWithExpiryTime(LocalDateTime expiresAt) {
        return Otp.builder()
                .user(testUser)
                .code("123456")
                .type("LOGIN")
                .expiresAt(expiresAt)
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
}