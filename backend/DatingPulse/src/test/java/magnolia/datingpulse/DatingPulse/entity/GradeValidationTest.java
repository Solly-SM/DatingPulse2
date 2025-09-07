package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class GradeValidationTest {

    private Validator validator;
    private User testUserGiven;
    private User testUserReceived;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        // Create test users
        testUserGiven = User.builder()
                .username("grader")
                .email("grader@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testUserReceived = User.builder()
                .username("gradee")
                .email("gradee@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidGrade() {
        Grade grade = Grade.builder()
                .userGiven(testUserGiven)
                .userReceived(testUserReceived)
                .grade(5)
                .build();

        Set<ConstraintViolation<Grade>> violations = validator.validate(grade);
        assertTrue(violations.isEmpty(), "Valid grade should not have violations");
    }

    @Test
    void testValidGradeRange() {
        // Test all valid grade values (1-5)
        for (int i = 1; i <= 5; i++) {
            Grade grade = Grade.builder()
                    .userGiven(testUserGiven)
                    .userReceived(testUserReceived)
                    .grade(i)
                    .build();

            Set<ConstraintViolation<Grade>> violations = validator.validate(grade);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("grade")),
                    "Grade value " + i + " should be valid");
        }
    }

    @Test
    void testNullGrade() {
        Grade grade = Grade.builder()
                .userGiven(testUserGiven)
                .userReceived(testUserReceived)
                .grade(null)
                .build();

        Set<ConstraintViolation<Grade>> violations = validator.validate(grade);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("grade") && 
                v.getMessage().contains("required")),
                "Null grade should be invalid");
    }

    @Test
    void testGradeTooLow() {
        Grade grade = Grade.builder()
                .userGiven(testUserGiven)
                .userReceived(testUserReceived)
                .grade(0)
                .build();

        Set<ConstraintViolation<Grade>> violations = validator.validate(grade);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("grade") && 
                v.getMessage().contains("at least 1")),
                "Grade 0 should be invalid");
    }

    @Test
    void testGradeTooHigh() {
        Grade grade = Grade.builder()
                .userGiven(testUserGiven)
                .userReceived(testUserReceived)
                .grade(6)
                .build();

        Set<ConstraintViolation<Grade>> violations = validator.validate(grade);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("grade") && 
                v.getMessage().contains("not exceed 5")),
                "Grade 6 should be invalid");
    }

    @Test
    void testNullUserGiven() {
        Grade grade = Grade.builder()
                .userGiven(null)
                .userReceived(testUserReceived)
                .grade(5)
                .build();

        Set<ConstraintViolation<Grade>> violations = validator.validate(grade);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userGiven") && 
                v.getMessage().contains("required")),
                "Null userGiven should be invalid");
    }

    @Test
    void testNullUserReceived() {
        Grade grade = Grade.builder()
                .userGiven(testUserGiven)
                .userReceived(null)
                .grade(5)
                .build();

        Set<ConstraintViolation<Grade>> violations = validator.validate(grade);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("userReceived") && 
                v.getMessage().contains("required")),
                "Null userReceived should be invalid");
    }
}