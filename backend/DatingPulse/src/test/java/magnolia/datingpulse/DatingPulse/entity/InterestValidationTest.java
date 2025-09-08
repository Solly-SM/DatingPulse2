package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class InterestValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidInterest() {
        Interest interest = Interest.builder()
                .name("Photography")
                .build();

        Set<ConstraintViolation<Interest>> violations = validator.validate(interest);
        assertTrue(violations.isEmpty(), "Valid interest should not have violations");
    }

    @Test
    void testValidInterestNames() {
        String[] validNames = {
                "Photography",
                "Music",
                "Travel",
                "Sports",
                "Reading",
                "Gaming",
                "Art-Culture",
                "Food Wine",
                "Tech-Science",
                "Nature-Outdoors",
                "Fitness123"
        };

        for (String name : validNames) {
            Interest interest = createInterestWithName(name);
            Set<ConstraintViolation<Interest>> violations = validator.validate(interest);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("name")),
                    "Interest name '" + name + "' should be valid");
        }
    }

    @Test
    void testInvalidInterestNames() {
        String[] invalidNames = {
                "A", // Too short
                "Photography_with_special_chars_that_makes_it_too_long_definitely_over_fifty_characters",
                "Invalid@Characters",
                "Special#Symbols",
                "Percent%Signs",
                "Question?Marks",
                ""
        };

        for (String name : invalidNames) {
            Interest interest = createInterestWithName(name);
            Set<ConstraintViolation<Interest>> violations = validator.validate(interest);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("name")),
                    "Interest name '" + name + "' should be invalid");
        }
    }

    @Test
    void testBlankInterestName() {
        Interest interest = createInterestWithName("   ");
        Set<ConstraintViolation<Interest>> violations = validator.validate(interest);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("required")),
                "Blank interest name should be invalid");
    }

    @Test
    void testNullInterestName() {
        Interest interest = createInterestWithName(null);
        Set<ConstraintViolation<Interest>> violations = validator.validate(interest);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("required")),
                "Null interest name should be invalid");
    }

    @Test
    void testInterestNameLength() {
        // Test minimum length boundary
        Interest shortInterest = createInterestWithName("AB");
        Set<ConstraintViolation<Interest>> violations = validator.validate(shortInterest);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("name")),
                "2-character interest name should be valid");

        // Test maximum length boundary
        String maxLengthName = "A".repeat(50);
        Interest longInterest = createInterestWithName(maxLengthName);
        violations = validator.validate(longInterest);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("name")),
                "50-character interest name should be valid");

        // Test over maximum length
        String tooLongName = "A".repeat(51);
        Interest tooLongInterest = createInterestWithName(tooLongName);
        violations = validator.validate(tooLongInterest);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("name") && 
                v.getMessage().contains("between 2 and 50 characters")),
                "51-character interest name should be invalid");
    }

    private Interest createInterestWithName(String name) {
        return Interest.builder()
                .name(name)
                .build();
    }
}