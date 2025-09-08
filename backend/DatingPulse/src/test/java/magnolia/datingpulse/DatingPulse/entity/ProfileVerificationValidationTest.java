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

class ProfileVerificationValidationTest {

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
    void testValidProfileVerification() {
        ProfileVerification verification = ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .documentURL("https://example.com/document.jpg")
                .notes("Initial verification request")
                .build();

        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.isEmpty(), "Valid profile verification should not have violations");
    }

    @Test
    void testValidVerificationTypes() {
        String[] validTypes = {"PHOTO", "ID", "SOCIAL", "PHONE", "EMAIL", "MANUAL"};
        
        for (String type : validTypes) {
            ProfileVerification verification = createVerificationWithType(type);
            Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("type")),
                    "Verification type '" + type + "' should be valid");
        }
    }

    @Test
    void testInvalidVerificationType() {
        ProfileVerification verification = createVerificationWithType("INVALID_TYPE");
        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("must be PHOTO")),
                "Invalid verification type should be rejected");
    }

    @Test
    void testValidStatusValues() {
        String[] validStatuses = {"PENDING", "APPROVED", "REJECTED", "EXPIRED"};
        
        for (String status : validStatuses) {
            ProfileVerification verification = createVerificationWithStatus(status);
            Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("status")),
                    "Status '" + status + "' should be valid");
        }
    }

    @Test
    void testInvalidStatus() {
        ProfileVerification verification = createVerificationWithStatus("INVALID_STATUS");
        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("status") && 
                v.getMessage().contains("must be PENDING")),
                "Invalid status should be rejected");
    }

    @Test
    void testDocumentURLValidation() {
        // Valid document URLs
        String[] validURLs = {
                "https://example.com/document.jpg",
                "http://example.com/document.jpg",   // HTTP is also allowed per pattern
                "https://storage.com/verification.jpeg",
                "https://secure.domain.com/files/id.png",
                "https://cdn.example.org/docs/passport.pdf"
        };

        for (String url : validURLs) {
            ProfileVerification verification = createVerificationWithDocumentURL(url);
            Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("documentURL")),
                    "Document URL '" + url + "' should be valid");
        }

        // Invalid document URLs
        String[] invalidURLs = {
                "https://example.com/document.txt", // Invalid extension
                "https://example.com/document.doc", // Invalid extension
                "ftp://example.com/document.jpg",   // Wrong protocol
                "not-a-url",                        // Not a URL
                "https://example.com/",             // No file extension
                ""                                  // Empty string
        };

        for (String url : invalidURLs) {
            ProfileVerification verification = createVerificationWithDocumentURL(url);
            Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("documentURL")),
                    "Document URL '" + url + "' should be invalid");
        }

        // Null document URL should be valid (optional field)
        ProfileVerification verification = createVerificationWithDocumentURL(null);
        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("documentURL")),
                "Null document URL should be valid (optional field)");
    }

    @Test
    void testNotesValidation() {
        // Valid notes
        String validNotes = "User provided clear photo for verification";
        ProfileVerification verification = createVerificationWithNotes(validNotes);
        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("notes")));

        // Notes at maximum length
        String maxLengthNotes = "A".repeat(1000);
        verification = createVerificationWithNotes(maxLengthNotes);
        violations = validator.validate(verification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("notes")),
                "1000-character notes should be valid");

        // Notes too long
        String tooLongNotes = "A".repeat(1001);
        verification = createVerificationWithNotes(tooLongNotes);
        violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("notes") && 
                v.getMessage().contains("1000 characters")),
                "Notes over 1000 characters should be invalid");

        // Null notes should be valid (optional field)
        verification = createVerificationWithNotes(null);
        violations = validator.validate(verification);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("notes")),
                "Null notes should be valid (optional field)");
    }

    @Test
    void testRequiredFields() {
        // Test null user
        ProfileVerification verification = ProfileVerification.builder()
                .user(null)
                .type("PHOTO")
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user") && 
                v.getMessage().contains("required")),
                "Null user should be invalid");

        // Test null type
        verification = ProfileVerification.builder()
                .user(testUser)
                .type(null)
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .build();

        violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("required")),
                "Null type should be invalid");

        // Test blank type
        verification = ProfileVerification.builder()
                .user(testUser)
                .type("   ")
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .build();

        violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("required")),
                "Blank type should be invalid");

        // Test null status
        verification = ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status(null)
                .requestedAt(LocalDateTime.now())
                .build();

        violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("status") && 
                v.getMessage().contains("required")),
                "Null status should be invalid");

        // Test blank status
        verification = ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status("   ")
                .requestedAt(LocalDateTime.now())
                .build();

        violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("status") && 
                v.getMessage().contains("required")),
                "Blank status should be invalid");

        // Test null requestedAt
        verification = ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status("PENDING")
                .requestedAt(null)
                .build();

        violations = validator.validate(verification);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("requestedAt") && 
                v.getMessage().contains("required")),
                "Null requestedAt should be invalid");
    }

    @Test
    void testCompleteVerificationWorkflow() {
        // Test a complete verification scenario with all fields
        ProfileVerification verification = ProfileVerification.builder()
                .user(testUser)
                .type("ID")
                .status("APPROVED")
                .requestedAt(LocalDateTime.now().minusHours(2))
                .verifiedAt(LocalDateTime.now())
                .documentURL("https://secure.example.com/verifications/id-doc.pdf")
                .notes("ID document successfully verified")
                .build();

        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.isEmpty(), "Complete verification workflow should be valid");
    }

    @Test
    void testOptionalTimestampFields() {
        // Optional timestamp fields should be allowed to be null
        ProfileVerification verification = ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .verifiedAt(null)    // Optional
                .rejectedAt(null)    // Optional
                .build();

        Set<ConstraintViolation<ProfileVerification>> violations = validator.validate(verification);
        assertTrue(violations.isEmpty(), "Verification with null optional timestamps should be valid");
    }

    private ProfileVerification createVerificationWithType(String type) {
        return ProfileVerification.builder()
                .user(testUser)
                .type(type)
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .build();
    }

    private ProfileVerification createVerificationWithStatus(String status) {
        return ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status(status)
                .requestedAt(LocalDateTime.now())
                .build();
    }

    private ProfileVerification createVerificationWithDocumentURL(String documentURL) {
        return ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .documentURL(documentURL)
                .build();
    }

    private ProfileVerification createVerificationWithNotes(String notes) {
        return ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .notes(notes)
                .build();
    }
}