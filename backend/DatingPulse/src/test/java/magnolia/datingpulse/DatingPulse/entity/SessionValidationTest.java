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

class SessionValidationTest {

    private Validator validator;
    private User testUser;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .userID(1L)
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(true)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidSession() {
        Session session = Session.builder()
                .sessionID("abcdef1234567890abcdef1234567890")
                .user(testUser)
                .token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ")
                .deviceInfo("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .expiresAt(LocalDateTime.now().plusHours(24))
                .createdAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.isEmpty(), "Valid session should not have violations");
    }

    @Test
    void testBlankSessionID() {
        Session session = createValidSession();
        session.setSessionID("");

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("sessionID") &&
                v.getMessage().contains("required")),
                "Blank session ID should be invalid");
    }

    @Test
    void testNullSessionID() {
        Session session = createValidSession();
        session.setSessionID(null);

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("sessionID")),
                "Null session ID should be invalid");
    }

    @Test
    void testSessionIDLengthValidation() {
        Session session = createValidSession();
        
        // Test too short
        session.setSessionID("short");
        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("sessionID") &&
                v.getMessage().contains("32")),
                "Session ID shorter than 32 characters should be invalid");
        
        // Test too long
        session.setSessionID("a".repeat(65));
        violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("sessionID") &&
                v.getMessage().contains("64")),
                "Session ID longer than 64 characters should be invalid");
        
        // Test minimum valid length
        session.setSessionID("a".repeat(32));
        violations = validator.validate(session);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("sessionID")),
                "Session ID with 32 characters should be valid");
        
        // Test maximum valid length
        session.setSessionID("a".repeat(64));
        violations = validator.validate(session);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("sessionID")),
                "Session ID with 64 characters should be valid");
    }

    @Test
    void testRequiredUser() {
        Session session = createValidSession();
        session.setUser(null);

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user")),
                "User should be required");
    }

    @Test
    void testBlankToken() {
        Session session = createValidSession();
        session.setToken("");

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("token") &&
                v.getMessage().contains("required")),
                "Blank token should be invalid");
    }

    @Test
    void testTokenLengthValidation() {
        Session session = createValidSession();
        
        // Test too short
        session.setToken("short");
        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("token") &&
                v.getMessage().contains("10")),
                "Token shorter than 10 characters should be invalid");
        
        // Test too long
        session.setToken("a".repeat(257));
        violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("token") &&
                v.getMessage().contains("256")),
                "Token longer than 256 characters should be invalid");
        
        // Test minimum valid length
        session.setToken("a".repeat(10));
        violations = validator.validate(session);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("token")),
                "Token with 10 characters should be valid");
        
        // Test maximum valid length
        session.setToken("a".repeat(256));
        violations = validator.validate(session);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("token")),
                "Token with 256 characters should be valid");
    }

    @Test
    void testDeviceInfoLengthValidation() {
        Session session = createValidSession();
        session.setDeviceInfo("a".repeat(501));

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("deviceInfo") &&
                v.getMessage().contains("500")),
                "Device info over 500 characters should be invalid");
        
        // Test null device info (should be allowed)
        session.setDeviceInfo(null);
        violations = validator.validate(session);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("deviceInfo")),
                "Null device info should be allowed");
    }

    @Test
    void testRequiredExpiresAt() {
        Session session = createValidSession();
        session.setExpiresAt(null);

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("expiresAt")),
                "Expires at timestamp should be required");
    }

    @Test
    void testFutureExpiresAt() {
        Session session = createValidSession();
        session.setExpiresAt(LocalDateTime.now().minusHours(1));

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("expiresAt") &&
                v.getMessage().contains("future")),
                "Past expiry time should be invalid");
    }

    @Test
    void testRequiredCreatedAt() {
        Session session = createValidSession();
        session.setCreatedAt(null);

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("createdAt")),
                "Created at timestamp should be required");
    }

    @Test
    void testOptionalRevokedAt() {
        Session session = createValidSession();
        session.setRevokedAt(null);

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("revokedAt")),
                "Revoked at timestamp should be optional");
        
        // Test with revoked timestamp
        session.setRevokedAt(LocalDateTime.now());
        violations = validator.validate(session);
        assertTrue(violations.stream().noneMatch(v -> 
                v.getPropertyPath().toString().equals("revokedAt")),
                "Revoked at timestamp should be valid when set");
    }

    @Test
    void testCommonSessionIDFormats() {
        String[] validSessionIDs = {
                "abcdef1234567890abcdef1234567890", // 32 chars hex-like
                "550e8400-e29b-41d4-a716-446655440000", // UUID format  
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWI", // Base64-like
                "a".repeat(64) // Maximum length
        };
        
        for (String sessionID : validSessionIDs) {
            Session session = createValidSession();
            session.setSessionID(sessionID);
            Set<ConstraintViolation<Session>> violations = validator.validate(session);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("sessionID")),
                    "Session ID '" + sessionID + "' should be valid");
        }
    }

    @Test
    void testCommonTokenFormats() {
        String[] validTokens = {
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", // JWT
                "randomTokenString123456789", // Random string
                "abcd1234".repeat(10), // Repeated pattern (80 chars)
                "a".repeat(256) // Maximum length
        };
        
        for (String token : validTokens) {
            Session session = createValidSession();
            session.setToken(token);
            Set<ConstraintViolation<Session>> violations = validator.validate(session);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("token")),
                    "Token format should be valid");
        }
    }

    private Session createValidSession() {
        return Session.builder()
                .sessionID("abcdef1234567890abcdef1234567890")
                .user(testUser)
                .token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ")
                .deviceInfo("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .expiresAt(LocalDateTime.now().plusHours(24))
                .createdAt(LocalDateTime.now())
                .build();
    }
}