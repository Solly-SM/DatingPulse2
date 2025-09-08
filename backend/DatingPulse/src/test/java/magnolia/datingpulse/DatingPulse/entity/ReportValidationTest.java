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

class ReportValidationTest {

    private Validator validator;
    private User testReporter;
    private User testReported;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testReporter = User.builder()
                .username("reporter")
                .email("reporter@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testReported = User.builder()
                .username("reported")
                .email("reported@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidReport() {
        Report report = Report.builder()
                .reporter(testReporter)
                .reported(testReported)
                .targetType("USER")
                .targetID(123L)
                .reason("Inappropriate behavior")
                .status("PENDING")
                .reportedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Report>> violations = validator.validate(report);
        assertTrue(violations.isEmpty(), "Valid report should not have violations");
    }

    @Test
    void testValidTargetTypes() {
        String[] validTargetTypes = {"USER", "PHOTO", "AUDIO", "MESSAGE", "PROFILE"};
        
        for (String targetType : validTargetTypes) {
            Report report = createReportWithTargetType(targetType);
            Set<ConstraintViolation<Report>> violations = validator.validate(report);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("targetType")),
                    "Target type '" + targetType + "' should be valid");
        }
    }

    @Test
    void testInvalidTargetType() {
        Report report = createReportWithTargetType("INVALID_TYPE");
        Set<ConstraintViolation<Report>> violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("targetType") && 
                v.getMessage().contains("must be USER")),
                "Invalid target type should be rejected");
    }

    @Test
    void testValidStatusValues() {
        String[] validStatuses = {"PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"};
        
        for (String status : validStatuses) {
            Report report = createReportWithStatus(status);
            Set<ConstraintViolation<Report>> violations = validator.validate(report);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("status")),
                    "Status '" + status + "' should be valid");
        }
    }

    @Test
    void testInvalidStatus() {
        Report report = createReportWithStatus("INVALID_STATUS");
        Set<ConstraintViolation<Report>> violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("status") && 
                v.getMessage().contains("must be PENDING")),
                "Invalid status should be rejected");
    }

    @Test
    void testReasonValidation() {
        // Valid reason
        Report report = createReportWithReason("Inappropriate content posted");
        Set<ConstraintViolation<Report>> violations = validator.validate(report);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("reason")));

        // Reason too long
        String longReason = "A".repeat(501);
        report = createReportWithReason(longReason);
        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("reason") && 
                v.getMessage().contains("500 characters")),
                "Reason over 500 characters should be invalid");

        // Blank reason
        report = createReportWithReason("   ");
        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("reason") && 
                v.getMessage().contains("required")),
                "Blank reason should be invalid");

        // Null reason
        report = createReportWithReason(null);
        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("reason") && 
                v.getMessage().contains("required")),
                "Null reason should be invalid");
    }

    @Test
    void testTargetIDValidation() {
        // Valid positive target ID
        Report report = createReportWithTargetID(1L);
        Set<ConstraintViolation<Report>> violations = validator.validate(report);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("targetID")));

        // Zero target ID
        report = createReportWithTargetID(0L);
        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("targetID") && 
                v.getMessage().contains("positive")),
                "Zero target ID should be invalid");

        // Negative target ID
        report = createReportWithTargetID(-1L);
        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("targetID") && 
                v.getMessage().contains("positive")),
                "Negative target ID should be invalid");

        // Null target ID
        report = createReportWithTargetID(null);
        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("targetID") && 
                v.getMessage().contains("required")),
                "Null target ID should be invalid");
    }

    @Test
    void testRequiredFields() {
        // Test null reporter
        Report report = Report.builder()
                .reporter(null)
                .reported(testReported)
                .targetType("USER")
                .targetID(123L)
                .reason("Test reason")
                .status("PENDING")
                .reportedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Report>> violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("reporter") && 
                v.getMessage().contains("required")),
                "Null reporter should be invalid");

        // Test null reported user
        report = Report.builder()
                .reporter(testReporter)
                .reported(null)
                .targetType("USER")
                .targetID(123L)
                .reason("Test reason")
                .status("PENDING")
                .reportedAt(LocalDateTime.now())
                .build();

        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("reported") && 
                v.getMessage().contains("required")),
                "Null reported user should be invalid");

        // Test null reportedAt
        report = Report.builder()
                .reporter(testReporter)
                .reported(testReported)
                .targetType("USER")
                .targetID(123L)
                .reason("Test reason")
                .status("PENDING")
                .reportedAt(null)
                .build();

        violations = validator.validate(report);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("reportedAt") && 
                v.getMessage().contains("required")),
                "Null reportedAt should be invalid");
    }

    private Report createReportWithTargetType(String targetType) {
        return Report.builder()
                .reporter(testReporter)
                .reported(testReported)
                .targetType(targetType)
                .targetID(123L)
                .reason("Test reason")
                .status("PENDING")
                .reportedAt(LocalDateTime.now())
                .build();
    }

    private Report createReportWithStatus(String status) {
        return Report.builder()
                .reporter(testReporter)
                .reported(testReported)
                .targetType("USER")
                .targetID(123L)
                .reason("Test reason")
                .status(status)
                .reportedAt(LocalDateTime.now())
                .build();
    }

    private Report createReportWithReason(String reason) {
        return Report.builder()
                .reporter(testReporter)
                .reported(testReported)
                .targetType("USER")
                .targetID(123L)
                .reason(reason)
                .status("PENDING")
                .reportedAt(LocalDateTime.now())
                .build();
    }

    private Report createReportWithTargetID(Long targetID) {
        return Report.builder()
                .reporter(testReporter)
                .reported(testReported)
                .targetType("USER")
                .targetID(targetID)
                .reason("Test reason")
                .status("PENDING")
                .reportedAt(LocalDateTime.now())
                .build();
    }
}